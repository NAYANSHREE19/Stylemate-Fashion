import mongoose from 'mongoose';

const wardrobeItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Others'],
    required: true
  },
  color: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  source: {
    type: String,
    enum: ['Manual', 'Recommendation', 'AI'],
    default: 'Manual'
  },
  sourceOutfitId: {
    type: String,
    default: null,
    trim: true
  },
  season: [{
    type: String,
    enum: ['Spring', 'Summer', 'Fall', 'Winter']
  }],
  occasion: [{
    type: String,
    enum: ['Casual', 'Formal', 'Business', 'Party', 'Sports', 'All']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  purchaseDate: {
    type: Date,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  timesWorn: {
    type: Number,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500
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
wardrobeItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
wardrobeItemSchema.index({ user: 1, category: 1 });
wardrobeItemSchema.index({ user: 1, isFavorite: 1 });
wardrobeItemSchema.index({ user: 1, sourceOutfitId: 1 });

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema);

export default WardrobeItem;
