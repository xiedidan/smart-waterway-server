import express from 'express';
import UserCtrl from '../controllers/user';

const router = express.Router();

// user
router.route('/login')
    .post(UserCtrl.login);
router.route('/logout')
    .get(UserCtrl.logout);

router.route('/users')
    .get(UserCtrl.list)
    .post(UserCtrl.create);

router.route('/users/me')
    .get(UserCtrl.getSessionUser);

router.route('/users/:userId')
    .get(UserCtrl.read)
    .put(UserCtrl.update)
    .delete(UserCtrl.remove);
router.param('userId', UserCtrl.userById);

export default router;
