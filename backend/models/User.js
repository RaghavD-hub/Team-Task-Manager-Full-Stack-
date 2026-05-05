import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userBaseSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  secretHash: {
    type: String,
    required: true,
  },
  accessLevel: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'Member',
  }
}, {
  timestamps: true,
});

// Intercept save to hash password
userBaseSchema.pre('save', async function(next) {
  const account = this;
  if (!account.isModified('secretHash')) return next();

  try {
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds);
    account.secretHash = await bcrypt.hash(account.secretHash, generatedSalt);
    next();
  } catch (err) {
    next(err);
  }
});

// Verify password method
userBaseSchema.methods.validatePassword = async function(candidateString) {
  return bcrypt.compare(candidateString, this.secretHash);
};

const User = mongoose.model('User', userBaseSchema);
export default User;
