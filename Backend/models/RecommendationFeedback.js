import mongoose from 'mongoose';

const recommendationFeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  outfitId: {
    type: String,
    required: [true, 'Please provide outfit id'],
    trim: true
  },
  prompt: {
    type: String,
    default: '',
    trim: true
  },
  feedback: {
    type: String,
    enum: ['like', 'dislike'],
    required: [true, 'Please provide feedback type']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

recommendationFeedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

recommendationFeedbackSchema.index({ user: 1, outfitId: 1 }, { unique: true });

const RecommendationFeedback = mongoose.model('RecommendationFeedback', recommendationFeedbackSchema);

export default RecommendationFeedback;
