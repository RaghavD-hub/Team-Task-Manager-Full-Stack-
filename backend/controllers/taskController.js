import Task from '../models/Task.js';

export const issueTask = async (req, res) => {
  try {
    const { headline, details, assignedTo, parentProject, targetDate } = req.body;
    const taskItem = await Task.create({
      headline,
      details,
      assignedTo,
      parentProject,
      targetDate
    });
    res.status(201).json(taskItem);
  } catch (err) {
    res.status(500).json({ error: 'Unable to issue task', details: err.message });
  }
};

export const fetchMyTasks = async (req, res) => {
  try {
    const query = req.currentUser.accessLevel === 'Admin' ? {} : { assignedTo: req.currentUser._id };
    const tasks = await Task.find(query)
      .populate('assignedTo', 'fullName emailAddress')
      .populate('parentProject', 'title');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Unable to retrieve tasks' });
  }
};

export const modifyTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { currentStatus } = req.body;
    
    const targetTask = await Task.findById(taskId);
    if (!targetTask) return res.status(404).json({ error: 'Task missing' });

    // Ensure member is assigned to this task OR is an Admin
    if (req.currentUser.accessLevel !== 'Admin' && targetTask.assignedTo.toString() !== req.currentUser._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to modify this specific task' });
    }

    targetTask.currentStatus = currentStatus;
    await targetTask.save();

    res.status(200).json(targetTask);
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};
