import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Zap, Droplets } from 'lucide-react';
import { vehiclesAPI, sensorsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [sensorData, setSensorData] = useState({ rpm: [], battery: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    avgRpm: 0,
    batteryHealth: 0,
    fuelEfficiency: 0,
    totalDistance: 0
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setError(null);
      const vehiclesData = await vehiclesAPI.getAll();
      setVehicles(vehiclesData);

      if (vehiclesData.length > 0) {
        // Get sensor data for the first vehicle
        const firstVehicle = vehiclesData[0];
        const sensors = await sensorsAPI.getByVehicle(firstVehicle._id, 24);
        
        if (sensors && sensors.length > 0) {
          // Transform sensor data for charts
          const rpmData = sensors.map((reading) => ({
            time: new Date(reading.timestamp).getHours() + ':00',
            value: reading.rpm
          }));
          
          const batteryData = sensors.map((reading) => ({
            time: new Date(reading.timestamp).getHours() + ':00',
            value: reading.battery
          }));

          setSensorData({ rpm: rpmData, battery: batteryData });

          // Calculate stats
          const avgRpm = sensors.reduce((acc, curr) => acc + curr.rpm, 0) / sensors.length;
          const avgBattery = sensors.reduce((acc, curr) => acc + curr.battery, 0) / sensors.length;
          const avgFuelEff = sensors.reduce((acc, curr) => acc + curr.fuelEfficiency, 0) / sensors.length;
          const totalOdometer = vehiclesData.reduce((acc, curr) => acc + curr.odometer, 0);

          setStats({
            avgRpm: Math.round(avgRpm),
            batteryHealth: Math.round((avgBattery / 14) * 100),
            fuelEfficiency: avgFuelEff.toFixed(1),
            totalDistance: totalOdometer
          });
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Add a vehicle to start seeing analytics data.</p>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stats.avgRpm ? 'Avg RPM' : 'Vehicles'}</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgRpm || vehicles.length}</p>
              <p className="text-xs text-green-600">{stats.avgRpm ? 'Engine performance' : 'Active vehicles'}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Health Score</p>
              <p className="text-2xl font-bold text-green-600">{stats.batteryHealth}%</p>
              <p className="text-xs text-green-600">Overall condition</p>
            </div>
            <Zap className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fuel Efficiency</p>
              <p className="text-2xl font-bold text-orange-600">{stats.fuelEfficiency} km/l</p>
              <p className="text-xs text-gray-600">Estimated average</p>
            </div>
            <Droplets className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalDistance.toLocaleString()} km</p>
              <p className="text-xs text-green-600">Combined odometer</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Vehicles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(vehicle => (
            <div key={vehicle._id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800">{vehicle.model}</h4>
              <div className="text-sm text-gray-600 mt-2">
                <p>Engine: {vehicle.engineCC}cc</p>
                <p>Fuel: {vehicle.fuelType}</p>
                <p>Odometer: {vehicle.odometer?.toLocaleString()} km</p>
                <p>Health Score: <span className="font-medium text-green-600">{vehicle.healthScore}%</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      {sensorData.rpm.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">RPM Trends (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData.rpm}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Battery Voltage (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sensorData.battery}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;