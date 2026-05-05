import mongoose from 'mongoose';

const projectBlueprint = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is mandatory'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Must be an Admin
  }
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectBlueprint);
export default Project;
