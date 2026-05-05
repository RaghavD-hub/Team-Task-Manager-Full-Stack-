import Task from '../models/Task.js';

export const retrieveMetrics = async (req, res) => {
  try {
    const baseQuery = req.currentUser.accessLevel === 'Admin' ? {} : { assignedTo: req.currentUser._id };

    const tasks = await Task.find(baseQuery);
    
    const metrics = {
      totalCount: tasks.length,
      byStatus: {
        Todo: 0,
        'In-Progress': 0,
        Done: 0
      },
      overdueCount: 0
    };

    tasks.forEach(task => {
      if (metrics.byStatus[task.currentStatus] !== undefined) {
        metrics.byStatus[task.currentStatus]++;
      }
      if (task.isPastDue) {
        metrics.overdueCount++;
      }
    });

    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: 'Metrics gathering failed', details: err.message });
  }
};
