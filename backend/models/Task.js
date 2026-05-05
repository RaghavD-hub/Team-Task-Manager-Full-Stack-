import mongoose from 'mongoose';

const taskBlueprint = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    default: '',
  },
  currentStatus: {
    type: String,
    enum: ['Todo', 'In-Progress', 'Done'],
    default: 'Todo',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  parentProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true,
});

// Provide a virtual to check if the task is past its due date
taskBlueprint.virtual('isPastDue').get(function() {
  if (this.currentStatus === 'Done') return false;
  return new Date() > this.targetDate;
});

// Ensure virtuals are included in JSON responses
taskBlueprint.set('toJSON', { virtuals: true });
taskBlueprint.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskBlueprint);
export default Task;
