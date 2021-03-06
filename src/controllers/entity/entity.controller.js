import _ from 'lodash';
import Promise from 'bluebird';
import { ObjectID } from 'mongodb';
import fs from 'fs';
import path from 'path';

import { Entity, Record } from '../../models';

import config from '../../config';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

function rewriteDocumentEntity(result) {
    if (result.entity.type === CONSTS.ENTITY_TYPES.DOCUMENT) {
        let keywords = result.entity.info;

        const designs = fs.readdirSync(path.join(
            CONSTS.DOCUMENT_PATH,
            'design/'
        ));

        const snapshots = fs.readdirSync(path.join(
            CONSTS.DOCUMENT_PATH,
            'snapshot/'
        ));

        keywords = keywords.map((keyword) => {
            let myDesigns = designs.filter((design) => {
                const position = design.indexOf(`附图${keyword}`);

                if (
                    position !== -1 &&
                    isNaN(parseInt(design.charAt(position + `附图${keyword}`.length), 10)) 
                ) {
                    return true;
                }

                return false;
            });
            myDesigns = _.uniq(_.flatten(myDesigns));

            let mySnapshots = _.uniq(snapshots.filter((snapshot) => {
                if (
                    snapshot.startsWith(keyword) &&
                    isNaN(parseInt(snapshot.charAt(keyword.length), 10))
                ) {
                    return true;
                }

                return false;
            }));
            mySnapshots = _.uniq(_.flatten(mySnapshots));

            return {
                designs: myDesigns,
                snapshots: mySnapshots
            };
        });

        keywords = keywords.reduce((prev, curr) => {
            curr.designs.map((design) => {
                return prev.designs.push(design);
            });

            curr.snapshots.map((snapshot) => {
                return prev.snapshots.push(snapshot);
            });

            return prev;
        }, { designs: [], snapshots: [] });
        keywords.designs = _.uniq(keywords.designs);
        keywords.snapshots = _.uniq(keywords.snapshots);

        const record = result.toJSON();
        record.data = keywords;

        return record;
    }

    return result.toJSON();
}

async function loadLastRecord(entities) {
    // load last record
    const status = await Promise.map(entities, (entity) => {
        return Record.findOne({
            entity: entity._id
        })
            .populate('entity')
            .sort({ createdAt: -1 });
    });

    // filter entity without last record
    let results = status.filter((value) => {
        if (value == null) {
            return false;
        }
        
        return true;
    });

    return results;
}

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

        if (
            req.body.type === CONSTS.ENTITY_TYPES.INFO ||
            req.body.type === CONSTS.ENTITY_TYPES.DOCUMENT ||
            req.body.type === CONSTS.ENTITY_TYPES.VIDEO
        ) {
            // insert a dummy record
            await Record.create({
                entity: entity._id,
                data: 0
            });
        }

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
            params.type = { $in: type };
        } else {
            return res.status(200).json([]);
        }

        const query = _.pickBy(params, _.identity);

        const entities = await Entity.find(query);

        if (
            entities !== undefined &&
            entities != null
        ) {
            let results = await loadLastRecord(entities);

            // rewrite record data of document entity with file names
            results = results.map(rewriteDocumentEntity);

            return res.status(200).json(results);
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

export async function listLastRecord(req, res) {
    const pageOption = getPageOption(req);
    const { limit, offset } = pageOption;

    const { project, type } = req.query;

    try {
        const params = {
            project
        };

        if (
            type !== undefined &&
            type != null
        ) {
            params.type = { $in: type };
        }

        const query = _.pickBy(params, _.identity);
        
        const entities = await Entity.find(query)
            .sort({ updatedAt: -1})
            .limit(limit)
            .skip(offset);

        if (
            entities !== undefined &&
            entities != null
        ) {
            let results = await loadLastRecord(entities);

            // rewrite record data of document entity with file names
            results = results.map(rewriteDocumentEntity);

            // get total count
            const all_entities = await Entity.find(query);
            const all_results = await loadLastRecord(all_entities);
            const count = all_results.length;

            return res.status(200).json({
                _meta: {
                    ...getPageMetadata(pageOption, count)
                },
                results
            });
        }

        return res.status(404).end();
    } catch (err) {
        logger.error('EntityCtrl::list() error', err);
        return res.status(500).send(err.toString());
    }
}
