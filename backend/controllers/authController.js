import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signupSchema, loginSchema } from '../validators/userValidator.js';

const generateToken = (userId, accessLevel) => {
  return jwt.sign(
    { userId, accessLevel },
    process.env.JWT_SECRET || 'fallback_secret_for_dev',
    { expiresIn: '24h' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        issues: validationResult.error.format() 
      });
    }

    const { fullName, emailAddress, secretHash, accessLevel } = validationResult.data;

    const existingUser = await User.findOne({ emailAddress });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const newUser = await User.create({
      fullName,
      emailAddress,
      secretHash,
      accessLevel: accessLevel || 'Member'
    });

    const sessionToken = generateToken(newUser._id, newUser.accessLevel);

    res.status(201).json({
      message: 'Account created successfully',
      token: sessionToken,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        emailAddress: newUser.emailAddress,
        accessLevel: newUser.accessLevel
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: 'Internal server error during registration', details: err.message });
  }
};

export const authenticateUser = async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        issues: validationResult.error.format() 
      });
    }

    const { emailAddress, secretHash } = validationResult.data;

    const account = await User.findOne({ emailAddress });
    if (!account) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await account.validatePassword(secretHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const sessionToken = generateToken(account._id, account.accessLevel);

    res.status(200).json({
      message: 'Login successful',
      token: sessionToken,
      user: {
        id: account._id,
        fullName: account.fullName,
        emailAddress: account.emailAddress,
        accessLevel: account.accessLevel
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Internal server error during authentication', details: err.message });
  }
};
