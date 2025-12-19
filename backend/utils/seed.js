import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import SensorData from '../models/SensorData.js';
import Alert from '../models/Alert.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-health-monitor');
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await SensorData.deleteMany({});
    await Alert.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      role: 'user'
    });
    console.log('👤 Created demo user');

    // Create demo vehicles
    const vehicles = await Vehicle.create([
      {
        userId: demoUser._id,
        model: 'Honda Civic',
        engineCC: 1500,
        fuelType: 'Petrol',
        odometer: 45000,
        lastService: new Date('2024-10-15'),
        healthScore: 85,
        status: 'Good'
      },
      {
        userId: demoUser._id,
        model: 'Toyota Camry',
        engineCC: 2000,
        fuelType: 'Hybrid',
        odometer: 32000,
        lastService: new Date('2024-11-20'),
        healthScore: 92,
        status: 'Excellent'
      },
      {
        userId: demoUser._id,
        model: 'Ford Mustang',
        engineCC: 5000,
        fuelType: 'Petrol',
        odometer: 28000,
        lastService: new Date('2024-09-10'),
        healthScore: 78,
        status: 'Good'
      }
    ]);
    console.log('🚗 Created demo vehicles');

    // Create sensor data for the last 24 hours
    const sensorDataPromises = [];
    for (const vehicle of vehicles) {
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
        sensorDataPromises.push(
          SensorData.create({
            vehicleId: vehicle._id,
            rpm: Math.floor(Math.random() * 3000) + 1000,
            temperature: Math.floor(Math.random() * 40) + 70,
            battery: Math.random() * 2 + 12,
            fuel: Math.floor(Math.random() * 100),
            fuelEfficiency: Math.random() * 5 + 12,
            speed: Math.floor(Math.random() * 120),
            timestamp
          })
        );
      }
    }
    await Promise.all(sensorDataPromises);
    console.log('📊 Created sensor data');

    // Create demo alerts
    await Alert.create([
      {
        vehicleId: vehicles[0]._id,
        userId: demoUser._id,
        type: 'warning',
        message: 'Engine temperature above normal',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        vehicleId: vehicles[1]._id,
        userId: demoUser._id,
        type: 'info',
        message: 'Service due in 500 km',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        vehicleId: vehicles[2]._id,
        userId: demoUser._id,
        type: 'critical',
        message: 'Low battery voltage detected',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ]);
    console.log('🚨 Created demo alerts');

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();