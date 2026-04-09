import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide outfit title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide outfit description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  items: [{
    type: String,
    required: true
  }],
  imageUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['Casual', 'Formal', 'Business', 'Evening', 'Sports', 'Party'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'female',
    index: true
  },
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'],
    default: 'All Season'
  },
  occasion: {
    type: String,
    enum: ['Work', 'Date', 'Party', 'Casual', 'Wedding', 'Gym', 'Travel'],
    required: true
  },
  stylePersonality: [{
    type: String,
    enum: ['Minimalist', 'Bohemian', 'Classic', 'Edgy', 'Romantic', 'Preppy', 'Streetwear', 'Vintage', 'Athleisure', 'Glamorous']
  }],
  // Enhanced fields for comprehensive style guide
  colorPalette: [{
    name: String,
    hex: String,
    role: {
      type: String,
      enum: ['primary', 'secondary', 'accent', 'neutral']
    }
  }],
  keyPieces: [{
    item: String,
    description: String,
    priority: {
      type: String,
      enum: ['essential', 'recommended', 'optional']
    }
  }],
  accessories: [{
    type: String
  }],
  celebrities: [{
    name: String,
    imageUrl: String
  }],
  stylingTips: {
    dos: [String],
    donts: [String],
    mixingTips: [String]
  },
  suitableBodyTypes: [{
    type: String,
    enum: ['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle', 'All']
  }],
  priceRange: {
    type: String,
    enum: ['Budget', 'Moderate', 'Premium', 'Luxury'],
    default: 'Moderate'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  vibe: {
    type: String,
    maxlength: [200, 'Vibe description cannot exceed 200 characters']
  },
  bestFor: [{
    type: String
  }],
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['main', 'outfit', 'detail', 'inspiration']
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  saves: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  trending: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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

// Update the updatedAt timestamp
outfitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search and filtering
outfitSchema.index({ category: 1, occasion: 1 });
outfitSchema.index({ tags: 1 });
outfitSchema.index({ stylePersonality: 1 });

const Outfit = mongoose.model('Outfit', outfitSchema);

export default Outfit;
