import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    lifestyle        : { type: String, default: '' },
    stylePersonality : [{ type: String }],
    colorPreferences : [{ type: String }],
    bodyType         : { type: String, default: '' },
    budget           : { type: String, default: '' },
    // expanded quiz fields
    occasion         : { type: String, default: '' },
    mood             : [{ type: String }],
    season           : { type: String, default: '' }
  },
  styleDNA: {
    type: String,
    required: true
  },
  recommendations: [{
    title: String,
    description: String,
    items: [String],
    imageUrl: String,
    tags: [String]
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
quizResultSchema.index({ user: 1, completedAt: -1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
