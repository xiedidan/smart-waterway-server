import _ from 'lodash';
import Promise from 'bluebird';
import { ObjectID } from 'mongodb';

import { Entity } from '../../models';

import config from '../../config';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export async function entityById(req, res, next, id) {
    try {
        const entity = await Entity.findById(id);
        if (entity) {
            req.entity = entity;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.ENTITY_NOT_FOUND));
    } catch (err) {
        logger.error(`EntityCtrl::entityById() error`, err);
        res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.entity.toJSON());
}

export async function update(req, res) {
    const { entity, body } = req;
    const { name, project, user, access, desc, location, type, info } = body;
    const query = _.pickBy({ name, project, user, access, desc, location, type, info }, _.identity);

    try {
        entity.set(query);
        const updatedEntity = await entity.save();
        return res.status(200).json(updatedEntity.toJSON());
    } catch (err) {
        logger.error(`EntityCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    try {
        await req.entity.remove();
        return res.status(200).end();
    } catch (err) {
        logger.error(`EntityCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function create(req, res) {
    try {
        const entity = await Entity.create({
            name: req.body.name || '',
            project: req.body.project || '',
            user: req.body.user || '',
            access: req.body.access || CONSTS.DOCUMENT_ACCESS.PUBLIC,
            desc: req.body.desc || '',
            location: req.body.location || { type: 'Point', coordinates: [0, 0] },
            type: req.body.type || CONSTS.ENTITY_TYPES.UNKNOWN,
            info: req.body.info || {}
        });
        entity.markModified('info');
        await entity.save();

        return res.status(200).json(entity.toJSON());
    } catch (err) {
        logger.error(`EntityCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    }
}

// load*() does NOT support paging, while list() does

export async function load(req, res) {
    const { project, type } = req.query;
    // const params = _.pickBy({ project, type }, _.identity);

    try {
        const params = {
            project
        };
        if (
            type !== undefined &&
            type != null
        ) {
            params.type = { $in: params.type };
        }

        const query = _.pickBy(params, _.identity);

        const entities = await Entity.find(query);

        if (
            entities !== undefined &&
            entities != null
        ) {
            // load last record
            const status = await Promise.map(entities, (entity) => {
                return Record.findOne({
                    entity: entity._id
                })
                    .populate('entity')
                    .sort({ createdAt: -1 });
            });

            return res.status(200).json(status);
        }

        return res.status(404).end();
    } catch (err) {
        logger.error('EntityCtrl::load() error', err);
        return res.status(500).send(err.toString());
    }
}

export async function loadWithin(req, res) {
    if (req.body.coordinates === undefined || req.body.coordinates == null) {
        const err = errors.MISSING_REQUEST_FIELDS;
        err.fields.push('coordinates');

        return res.status(400).send(JSON.stringify(err));
    }

    const { project, type } = req.query;
    const params = _.pickBy({ project, type }, _.identity);

    const query = {
        ...params,
        location: {
            $geoWithin: {
                $geometry: req.body.coordinates
            }
        },
    };

    try {
        const entities = await Entity.find(query);

        return res.status(200).json(entities);
    } catch (err) {
        logger.error('EntityCtrl::loadWithin() error', err);
        return res.status(500).send(err.toString());
    }
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { limit, offset } = pageOption;

    const { project, type } = req.query;
    const query = _.pickBy({project, type}, _.identity);

    try {
        const entities = await Entity.find(query)
            .populate('project')
            .populate('user')
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip(offset);

        const count = await Entity.count(query);

        return res.status(200).json({
            _meta: {
                ...getPageMetadata(pageOption, count)
            },
            entities
        });
    } catch (err) {
        logger.error(`EntityCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}
