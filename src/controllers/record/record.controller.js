import _ from 'lodash';
import Promise from 'bluebird';
import { ObjectID } from 'mongodb';

import { Record } from '../../models';

import config from '../../config';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';

export async function recordById(req, res, next, id) {
    try {
        const record = await Record.findById(id);
        if (record) {
            req.record = record;
            return next();
        }

        return res.status(400)
            .send(JSON.stringify(errors.RECORD_NOT_FOUND));
    } catch (err) {
        logger.error(`RecordCtrl::recordById() error`, err);
        res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.record.toJSON());
}

export async function create(req, res) {
    try {
        const record = await Record.create(req.body);
        return res.status(200).json(record);
    } catch (err) {
        logger.error(`RecordCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function getLastRecord(req, res) {
    try {
        const record = await Record.findOne({
            entity: req.entity._id
        })
            .populate('entity')
            .sort({ createdAt: -1 });

        if (record !== undefined && record != null) {
            return res.status(200).json(record.toJSON());
        }

        return res.status(400)
            .send(JSON.stringify(errors.RECORD_NOT_FOUND));
    } catch (err) {
        logger.error(`RecordCtrl::getLastRecord() error`, err);
        res.status(500).send(err.toString());
    }
}
