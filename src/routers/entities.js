import express from 'express';
import EntityCtrl from '../controllers/entity';

const router = express.Router();

// project
router.route('/entities')
    .get(EntityCtrl.list)
    .post(EntityCtrl.create);

router.route('/entities/within')
    .post(EntityCtrl.load)

router.route('/entities/:entityId')
    .get(EntityCtrl.read)
    .put(EntityCtrl.update)
    .delete(EntityCtrl.remove);
router.param('entityId', EntityCtrl.entityById);

export default router;
