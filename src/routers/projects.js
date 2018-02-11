import express from 'express';
import ProjectCtrl from '../controllers/project';

const router = express.Router();

// project
router.route('/projects')
    .get(ProjectCtrl.list)
    .post(ProjectCtrl.create);

router.route('/projects/:projectId')
    .get(ProjectCtrl.read)
    .put(ProjectCtrl.update)
    .delete(ProjectCtrl.remove);
router.param('projectId', ProjectCtrl.projectById);

export default router;
