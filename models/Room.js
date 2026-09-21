import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide room name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide room category'],
    enum: ['Single', 'Double', 'Deluxe', 'Suite', 'Presidential']
  },
  price: {
    type: Number,
    required: [true, 'Please provide room price'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Please provide room description']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide room capacity'],
    min: 1
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  size: {
    type: Number,
    required: [true, 'Please provide room size in sq ft']
  }
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);
