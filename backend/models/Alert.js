import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['warning', 'critical', 'info'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
alertSchema.index({ userId: 1, timestamp: -1 });
alertSchema.index({ vehicleId: 1, timestamp: -1 });

export default mongoose.model('Alert', alertSchema);