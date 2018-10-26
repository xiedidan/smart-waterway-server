import express from 'express';
import EntityCtrl from '../controllers/entity';
import RecordCtrl from '../controllers/record';

const router = express.Router();

// entity
router.route('/entities')
    .get(EntityCtrl.list)
    .post(EntityCtrl.create);

router.route('/entities/status')
    .get(EntityCtrl.listLastRecord);

router.route('/entities/load')
    .get(EntityCtrl.load);

router.route('/entities/within')
    .post(EntityCtrl.loadWithin);

router.route('/entities/:entityId/status')
    .get(RecordCtrl.getLastRecord);

router.route('/entities/:entityId')
    .get(EntityCtrl.read)
    .put(EntityCtrl.update)
    .delete(EntityCtrl.remove);

router.param('entityId', EntityCtrl.entityById);

export default router;
