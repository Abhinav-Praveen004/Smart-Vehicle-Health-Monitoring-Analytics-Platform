import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Car, AlertTriangle, Battery, Thermometer, Fuel, Gauge } from 'lucide-react';
import { vehiclesAPI, alertsAPI, sensorsAPI } from '../services/api';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sensorData, setSensorData] = useState({ temperature: [] });
  const [stats, setStats] = useState({ totalVehicles: 0, avgHealthScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vehiclesData, alertsData, statsData] = await Promise.all([
        vehiclesAPI.getAll(),
        alertsAPI.getAll(10),
        vehiclesAPI.getStats()
      ]);

      setVehicles(vehiclesData);
      setAlerts(alertsData);
      setStats(statsData);

      // Fetch sensor data for first vehicle if available
      if (vehiclesData.length > 0) {
        const sensorResponse = await sensorsAPI.getByVehicle(vehiclesData[0]._id);
        const temperatureData = sensorResponse.map((data, index) => ({
          time: `${index}:00`,
          value: data.temperature
        }));
        setSensorData({ temperature: temperatureData });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Calculate fuel efficiency data
  const getFuelEfficiencyData = () => {
    if (vehicles.length === 0) return { display: 'No Data', range: '' };
    if (vehicles.length === 1) {
      const efficiency = vehicles[0].fuelType === 'Electric' ? 'Electric' : '15.2 km/l';
      return { display: efficiency, range: vehicles[0].model };
    }
    
    // Multiple vehicles - show range
    const efficiencies = vehicles.map(v => {
      if (v.fuelType === 'Electric') return 0;
      return v.fuelType === 'Hybrid' ? 18 : v.engineCC < 1500 ? 16 : 13;
    }).filter(e => e > 0);
    
    if (efficiencies.length === 0) return { display: 'Electric', range: 'All Electric' };
    
    const min = Math.min(...efficiencies);
    const max = Math.max(...efficiencies);
    return { 
      display: min === max ? `${min} km/l` : `${min}-${max} km/l`,
      range: `${vehicles.length} vehicles`
    };
  };

  const fuelEfficiency = getFuelEfficiencyData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const totalVehicles = stats.totalVehicles;
  const avgHealthScore = stats.avgHealthScore;
  const activeAlerts = alerts.filter(a => !a.isRead).length;

  const healthDistribution = [
    { name: 'Excellent', value: stats.healthDistribution?.excellent || 0, color: '#10B981' },
    { name: 'Good', value: stats.healthDistribution?.good || 0, color: '#F59E0B' },
    { name: 'Poor', value: (stats.healthDistribution?.fair || 0) + (stats.healthDistribution?.poor || 0), color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-800">{totalVehicles}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Health Score</p>
              <p className="text-2xl font-bold text-green-600">{avgHealthScore}%</p>
            </div>
            <Gauge className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-orange-600">{activeAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fuel Efficiency</p>
              <p className="text-2xl font-bold text-blue-600">{fuelEfficiency.display}</p>
              <p className="text-xs text-gray-500">{fuelEfficiency.range}</p>
            </div>
            <Fuel className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Fuel Efficiency Details */}
      {vehicles.length > 1 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Fuel className="h-5 w-5 mr-2 text-blue-500" />
            Fuel Efficiency by Vehicle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const vehicleEfficiencies = vehicles.map(v => ({
                model: v.model,
                efficiency: v.fuelType === 'Electric' ? 0 : 
                           v.fuelType === 'Hybrid' ? 18 : 
                           v.engineCC < 1500 ? 16 : 13,
                fuelType: v.fuelType
              })).filter(v => v.efficiency > 0);
              
              if (vehicleEfficiencies.length === 0) return null;
              
              const best = vehicleEfficiencies.reduce((prev, curr) => 
                prev.efficiency > curr.efficiency ? prev : curr
              );
              const worst = vehicleEfficiencies.reduce((prev, curr) => 
                prev.efficiency < curr.efficiency ? prev : curr
              );
              
              return (
                <>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Most Efficient</p>
                        <p className="text-lg font-bold text-green-800">{best.model}</p>
                        <p className="text-sm text-green-600">{best.efficiency} km/l</p>
                      </div>
                      <div className="text-green-500">
                        <Fuel className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  
                  {best.model !== worst.model && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-600 font-medium">Least Efficient</p>
                          <p className="text-lg font-bold text-red-800">{worst.model}</p>
                          <p className="text-sm text-red-600">{worst.efficiency} km/l</p>
                        </div>
                        <div className="text-red-500">
                          <Fuel className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
            Engine Temperature (24h)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.temperature}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Health Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Vehicle Health Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({name, value}) => `${name}: ${value}`}
              >
                {healthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.slice(0, 5).map(alert => (
              <div key={alert._id} className="flex items-center p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {alert.vehicleId?.model || 'Vehicle'} • {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No alerts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;