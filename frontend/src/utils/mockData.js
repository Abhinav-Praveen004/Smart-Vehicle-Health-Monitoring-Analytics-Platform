// Mock data for demonstration
export const mockVehicles = [
  {
    id: 1,
    model: 'Honda Civic',
    engineCC: 1500,
    fuelType: 'Petrol',
    odometer: 45000,
    lastService: '2024-10-15',
    healthScore: 85,
    status: 'Good'
  },
  {
    id: 2,
    model: 'Toyota Camry',
    engineCC: 2000,
    fuelType: 'Hybrid',
    odometer: 32000,
    lastService: '2024-11-20',
    healthScore: 92,
    status: 'Excellent'
  }
];

export const mockSensorData = {
  rpm: Array.from({length: 24}, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 3000) + 1000
  })),
  temperature: Array.from({length: 24}, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 40) + 70
  })),
  battery: Array.from({length: 24}, (_, i) => ({
    time: `${i}:00`,
    value: Math.random() * 2 + 12
  })),
  fuel: Array.from({length: 24}, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 100)
  }))
};

export const mockAlerts = [
  {
    id: 1,
    type: 'warning',
    message: 'Engine temperature above normal',
    timestamp: '2024-12-12 09:30',
    vehicle: 'Honda Civic'
  },
  {
    id: 2,
    type: 'info',
    message: 'Service due in 500 km',
    timestamp: '2024-12-11 14:20',
    vehicle: 'Toyota Camry'
  }
];

export const calculateHealthScore = (vehicle, sensorData) => {
  const engineHealth = sensorData.temperature.reduce((acc, curr) => acc + (curr.value < 100 ? 1 : 0), 0) / sensorData.temperature.length * 100;
  const batteryHealth = sensorData.battery.reduce((acc, curr) => acc + (curr.value > 12 ? 1 : 0), 0) / sensorData.battery.length * 100;
  const fuelEfficiency = 85; // Mock calculation
  
  return Math.round((engineHealth * 0.4 + batteryHealth * 0.3 + fuelEfficiency * 0.3));
};