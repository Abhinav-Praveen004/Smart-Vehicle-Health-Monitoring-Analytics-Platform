import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  engineCC: {
    type: Number,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
    required: true
  },
  odometer: {
    type: Number,
    required: true,
    default: 0
  },
  lastService: {
    type: Date,
    required: true
  },
  healthScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
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

// Update healthScore and status based on sensor data
vehicleSchema.methods.updateHealthScore = function(sensorData) {
  // Calculate health score based on various factors
  let score = 100;
  
  // Temperature factor (reduce score if temperature is high)
  if (sensorData.temperature > 100) score -= 10;
  else if (sensorData.temperature > 90) score -= 5;
  
  // Battery factor
  if (sensorData.battery < 12) score -= 15;
  else if (sensorData.battery < 12.5) score -= 8;
  
  // RPM factor (extreme RPM values)
  if (sensorData.rpm > 4000 || sensorData.rpm < 500) score -= 5;
  
  // Fuel efficiency factor
  if (sensorData.fuelEfficiency < 10) score -= 10;
  else if (sensorData.fuelEfficiency < 12) score -= 5;
  
  this.healthScore = Math.max(0, Math.min(100, score));
  
  // Update status based on health score
  if (this.healthScore >= 90) this.status = 'Excellent';
  else if (this.healthScore >= 70) this.status = 'Good';
  else if (this.healthScore >= 50) this.status = 'Fair';
  else this.status = 'Poor';
  
  this.updatedAt = Date.now();
};

export default mongoose.model('Vehicle', vehicleSchema);