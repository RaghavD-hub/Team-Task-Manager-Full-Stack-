import Project from '../models/Project.js';

export const generateProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const projectInstance = await Project.create({
      title,
      description,
      managerId: req.currentUser._id,
    });
    res.status(201).json(projectInstance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate project', details: err.message });
  }
};

export const fetchAllProjects = async (req, res) => {
  try {
    const records = await Project.find().populate('managerId', 'fullName emailAddress');
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
