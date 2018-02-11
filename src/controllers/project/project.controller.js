import _ from 'lodash';
import Promise from 'bluebird';
import { ObjectID } from 'mongodb';

import { Project } from '../../models';

import config from '../../config';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export async function projectById(req, res, next, id) {
    try {
        const project = await Project.findById(id);
        if (project) {
            req.project = project;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.PROJECT_NOT_FOUND));
    }
    catch(err) {
        logger.error(`ProjectCtrl::projectById() error`, err);
        res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.project.toJSON());
}

export async function update(req, res) {
    const { project, body } = req;
    const { name, user, desc, geo } = body;
    const query = _.pickBy({ name, user, desc, geo }, _.identity);

    try {
        if (name !== project.name) {
            const existedProject = await Project.find({ name });
            if (existedProject.length !== 0) {
                return res.status(400).send(JSON.stringify(errors.PROJECT_NAME_EXISTED));
            }
        }

        project.set(query);
        const updatedProject = await project.save();
        return res.status(200).json(updatedProject.toJSON());
    }
    catch(err) {
        logger.error(`ProjectCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    try {
        await req.project.remove();
        return res.status(200).end();
    }
    catch(err) {
        logger.error(`ProjectCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function create(req, res) {
    try {
        const existedProject = await Project.find({ name: req.body.name || '' });
        if (existedProject.length === 0) {
            const project = await Project.create({
                name: req.body.name || '',
                user: req.body.user || '',
                desc: req.body.desc || '',
                geo: req.body.geo || { type: 'Polygon', coordinates: [[ [0, 0], [0, 1], [1, 1] ]] }
            });

            return res.status(200).json(project);
        }

        return res.status(400).send(JSON.stringify(errors.PROJECT_NAME_EXISTED));
    }
    catch(err) {
        logger.error(`ProjectCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function list(req, res) {
    const { page, pageSize } = getPageOption(req);

    try {
        const projects = await Project.find({ })
            .sort({ updatedAt: -1 })
            .limit(pageSize)
            .skip(page * pageSize);

        const count = await Project.count({ });

        return res.status(200).json({
          _meta: {...getPageMetadata(getPageOption(req), count)},
          projects
        });
    }
    catch(err) {
        logger.error(`ProjectCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}
