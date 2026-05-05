import express from 'express';
import { registerUser, authenticateUser } from '../controllers/authController.js';
import { requireAuthentication } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authenticateUser);

// Simple endpoint to verify token validity
router.get('/me', requireAuthentication, (req, res) => {
  res.json({
    user: {
      id: req.currentUser._id,
      fullName: req.currentUser.fullName,
      emailAddress: req.currentUser.emailAddress,
      accessLevel: req.currentUser.accessLevel
    }
  });
});

export default router;
