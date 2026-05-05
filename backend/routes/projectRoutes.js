import express from 'express';
import { generateProject, fetchAllProjects } from '../controllers/projectController.js';
import { requireAuthentication, restrictToRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(requireAuthentication);
router.post('/', restrictToRoles('Admin'), generateProject);
router.get('/', fetchAllProjects);

export default router;
