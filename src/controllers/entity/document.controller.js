import _ from 'lodash';
import Promise from 'bluebird';
import { ObjectID } from 'mongodb';

import { Project } from '../../models';

import config from '../../config';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export async function upload(req, res, next) {
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