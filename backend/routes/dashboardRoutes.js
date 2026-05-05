import express from 'express';
import { retrieveMetrics } from '../controllers/dashboardController.js';
import { requireAuthentication } from '../middlewares/auth.js';

const router = express.Router();

router.use(requireAuthentication);
router.get('/metrics', retrieveMetrics);

export default router;
