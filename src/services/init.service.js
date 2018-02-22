import { User } from '../models';
import { logger } from '../lib/logger';
import * as CONSTS from '../consts';

export async function init() {
    try {
        const adminCount = await User.count({role: CONSTS.USER_ROLES.ADMIN});
        if (adminCount === 0) {
            // add initial admin user
            const admin = new User(CONSTS.DEFAULT_USER);
            await admin.save();
        }
    } catch (err) {
        logger.error(`init.service.js::init() error`, err);
    }
}
