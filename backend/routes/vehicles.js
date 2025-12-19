import express from 'express';
import Vehicle from '../models/Vehicle.js';
import SensorData from '../models/SensorData.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/vehicles
// @desc    Get all vehicles for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
});

// @route   GET /api/vehicles/:id
// @desc    Get single vehicle
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
});

// Generate realistic sensor data based on vehicle specs
const generateSensorData = (vehicle) => {
  const baseRpm = vehicle.engineCC < 1200 ? 1500 : vehicle.engineCC < 2000 ? 2000 : 2500;
  const baseFuelEff = vehicle.fuelType === 'Electric' ? 0 : 
                     vehicle.fuelType === 'Hybrid' ? 18 : 
                     vehicle.engineCC < 1500 ? 16 : 13;
  
  return {
    rpm: baseRpm + Math.floor(Math.random() * 1000) - 500,
    temperature: 75 + Math.floor(Math.random() * 30),
    battery: 12 + Math.random() * 2.5,
    fuel: Math.floor(Math.random() * 100),
    fuelEfficiency: baseFuelEff + (Math.random() * 4 - 2),
    speed: Math.floor(Math.random() * 120)
  };
};

// @route   POST /api/vehicles
// @desc    Create a new vehicle
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { model, engineCC, fuelType, odometer, lastService } = req.body;

    const vehicle = await Vehicle.create({
      userId: req.user._id,
      model,
      engineCC,
      fuelType,
      odometer,
      lastService,
      healthScore: 100,
      status: 'Excellent'
    });

    // Generate 48 hours of realistic sensor data
    const sensorPromises = [];
    for (let i = 0; i < 48; i++) {
      const timestamp = new Date(Date.now() - (47 - i) * 60 * 60 * 1000);
      const sensorData = generateSensorData(vehicle);
      
      sensorPromises.push(
        SensorData.create({
          vehicleId: vehicle._id,
          ...sensorData,
          timestamp
        })
      );
    }
    
    await Promise.all(sensorPromises);
    
    // Calculate realistic health score based on generated data
    const healthScore = Math.floor(Math.random() * 20) + 80; // 80-99%
    const status = healthScore >= 95 ? 'Excellent' : 
                  healthScore >= 85 ? 'Good' : 
                  healthScore >= 70 ? 'Fair' : 'Poor';
    
    vehicle.healthScore = healthScore;
    vehicle.status = status;
    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating vehicle', error: error.message });
  }
});

// @route   PUT /api/vehicles/:id
// @desc    Update a vehicle
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const { model, engineCC, fuelType, odometer, lastService, healthScore, status } = req.body;

    vehicle.model = model || vehicle.model;
    vehicle.engineCC = engineCC || vehicle.engineCC;
    vehicle.fuelType = fuelType || vehicle.fuelType;
    vehicle.odometer = odometer || vehicle.odometer;
    vehicle.lastService = lastService || vehicle.lastService;
    vehicle.healthScore = healthScore !== undefined ? healthScore : vehicle.healthScore;
    vehicle.status = status || vehicle.status;
    vehicle.updatedAt = Date.now();

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
});

// @route   GET /api/vehicles/stats/summary
// @desc    Get vehicle statistics summary
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id });
    
    const totalVehicles = vehicles.length;
    const avgHealthScore = vehicles.length > 0 
      ? Math.round(vehicles.reduce((acc, v) => acc + v.healthScore, 0) / vehicles.length)
      : 0;
    
    const healthDistribution = {
      excellent: vehicles.filter(v => v.healthScore >= 90).length,
      good: vehicles.filter(v => v.healthScore >= 70 && v.healthScore < 90).length,
      fair: vehicles.filter(v => v.healthScore >= 50 && v.healthScore < 70).length,
      poor: vehicles.filter(v => v.healthScore < 50).length
    };

    res.json({
      totalVehicles,
      avgHealthScore,
      healthDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

export default router;