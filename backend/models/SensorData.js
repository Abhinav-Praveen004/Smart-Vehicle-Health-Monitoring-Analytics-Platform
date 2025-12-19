import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  rpm: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  battery: {
    type: Number,
    required: true
  },
  fuel: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  fuelEfficiency: {
    type: Number,
    default: 15
  },
  speed: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
sensorDataSchema.index({ vehicleId: 1, timestamp: -1 });

export default mongoose.model('SensorData', sensorDataSchema);