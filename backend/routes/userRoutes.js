import express from 'express';
import { fetchAllUsers } from '../controllers/userController.js';
import { requireAuthentication } from '../middlewares/auth.js';

const router = express.Router();

router.use(requireAuthentication);
router.get('/', fetchAllUsers);

export default router;
