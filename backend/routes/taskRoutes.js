import express from 'express';
import { issueTask, fetchMyTasks, modifyTaskStatus } from '../controllers/taskController.js';
import { requireAuthentication, restrictToRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(requireAuthentication);
router.post('/', restrictToRoles('Admin'), issueTask);
router.get('/', fetchMyTasks);
router.patch('/:taskId/status', modifyTaskStatus);

export default router;
