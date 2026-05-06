import User from '../models/User.js';

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-secretHash');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
