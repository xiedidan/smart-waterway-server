import express from 'express';
import RecordCtrl from '../controllers/record';

const router = express.Router();

// record
router.route('/records')
    .post(RecordCtrl.create);

router.route('/records/:recordId')
    .get(RecordCtrl.read);

router.param('recordId', RecordCtrl.recordById);

export default router;
