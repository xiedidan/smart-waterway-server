import _ from 'lodash';
import Promise from 'bluebird';
import { User } from '../../models';

import config from '../../config';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export async function userById(req, res, next, id) {
    try {
        const user = await User.findById(id);
        if (user) {
            req.user = user;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.USER_NOT_FOUND));
    }
    catch(err) {
        logger.error(`UserCtrl::userById() error`, err);
        res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.user.toJSON());
}

export async function update(req, res) {
    const { user, body } = req;
    const { username, password, role } = body;
    const query = _.pickBy({ username, password, role }, _.identity);

    try {
        if (username !== user.username) {
            const existedUser = await User.find({ username });
            if (existedUser.length !== 0) {
                return res.status(400).send(JSON.stringify(errors.USERNAME_EXISTED));
            }
        }

        user.set(query);
        const updatedUser = await user.save();
        return res.status(200).json(updatedUser.toJSON());
    }
    catch(err) {
        logger.error(`UserCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    try {
        await req.user.remove();
        return res.status(200).end();
    }
    catch(err) {
        logger.error(`UserCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function create(req, res) {
    try {
        const existedUser = await User.find({ username: req.body.username || '' });
        if (existedUser.length === 0) {
            const user = await User.create({
                username: req.body.username || '',
                password: req.body.password || '',
                role: Number(req.body.role) || CONSTS.USER_ROLES.NORMAL
            });

            return res.status(200).json(user);
        }

        return res.status(400).send(JSON.stringify(errors.USERNAME_EXISTED));
    }
    catch(err) {
        logger.error(`UserCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { limit, offset } = pageOption;

    try {
        const users = await User.find({ })
            .sort({ updatedAt: -1 })
            .limit(pageSize)
            .skip(page * pageSize);

        const count = await User.count({ });

        return res.status(200).json({
          _meta: {...getPageMetadata(pageOption, count)},
          users
        });
    }
    catch(err) {
        logger.error(`UserCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}

