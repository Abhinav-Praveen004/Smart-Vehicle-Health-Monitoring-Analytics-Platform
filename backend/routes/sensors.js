import express from 'express';
import SensorData from '../models/SensorData.js';
import Vehicle from '../models/Vehicle.js';
import Alert from '../models/Alert.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/sensors/vehicle/:vehicleId
// @desc    Get sensor data for a vehicle
// @access  Private
router.get('/vehicle/:vehicleId', protect, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { hours = 24 } = req.query;

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const timeLimit = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const sensorData = await SensorData.find({
      vehicleId,
      timestamp: { $gte: timeLimit }
    }).sort({ timestamp: 1 });

    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data', error: error.message });
  }
});

// @route   POST /api/sensors
// @desc    Add sensor data for a vehicle
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, rpm, temperature, battery, fuel, fuelEfficiency, speed } = req.body;

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const sensorData = await SensorData.create({
      vehicleId,
      rpm,
      temperature,
      battery,
      fuel,
      fuelEfficiency: fuelEfficiency || 15,
      speed: speed || 0
    });

    // Update vehicle health score
    vehicle.updateHealthScore({
      temperature,
      battery,
      rpm,
      fuelEfficiency: fuelEfficiency || 15
    });
    await vehicle.save();

    // Create alerts if needed
    if (temperature > 100) {
      await Alert.create({
        vehicleId,
        userId: req.user._id,
        type: 'warning',
        message: `Engine temperature above normal (${temperature}°C)`
      });
    }

    if (battery < 12) {
      await Alert.create({
        vehicleId,
        userId: req.user._id,
        type: 'critical',
        message: `Low battery voltage (${battery}V)`
      });
    }

    if (fuel < 10) {
      await Alert.create({
        vehicleId,
        userId: req.user._id,
        type: 'warning',
        message: `Low fuel level (${fuel}%)`
      });
    }

    res.status(201).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sensor data', error: error.message });
  }
});

// @route   GET /api/sensors/stats/:vehicleId
// @desc    Get sensor statistics for a vehicle
// @access  Private
router.get('/stats/:vehicleId', protect, async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const sensorData = await SensorData.find({
      vehicleId,
      timestamp: { $gte: timeLimit }
    });

    if (sensorData.length === 0) {
      return res.json({
        avgRpm: 0,
        avgTemperature: 0,
        avgBattery: 0,
        avgFuel: 0,
        avgFuelEfficiency: 0
      });
    }

    const stats = {
      avgRpm: Math.round(sensorData.reduce((acc, d) => acc + d.rpm, 0) / sensorData.length),
      avgTemperature: Math.round(sensorData.reduce((acc, d) => acc + d.temperature, 0) / sensorData.length),
      avgBattery: (sensorData.reduce((acc, d) => acc + d.battery, 0) / sensorData.length).toFixed(2),
      avgFuel: Math.round(sensorData.reduce((acc, d) => acc + d.fuel, 0) / sensorData.length),
      avgFuelEfficiency: (sensorData.reduce((acc, d) => acc + d.fuelEfficiency, 0) / sensorData.length).toFixed(1)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor stats', error: error.message });
  }
});

export default router;