import { useState, useEffect } from 'react';
import { Plus, Car, Calendar, Gauge, Fuel, Trash2 } from 'lucide-react';
import { vehiclesAPI } from '../services/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    model: '',
    engineCC: '',
    fuelType: 'Petrol',
    odometer: '',
    lastService: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehiclesAPI.getAll();
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const vehicleData = {
        ...newVehicle,
        engineCC: parseInt(newVehicle.engineCC),
        odometer: parseInt(newVehicle.odometer)
      };
      await vehiclesAPI.create(vehicleData);
      setNewVehicle({ model: '', engineCC: '', fuelType: 'Petrol', odometer: '', lastService: '' });
      setShowAddForm(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehiclesAPI.delete(id);
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading vehicles...</div>
      </div>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Vehicles</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
              <input
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engine CC</label>
              <input
                type="number"
                value={newVehicle.engineCC}
                onChange={(e) => setNewVehicle({...newVehicle, engineCC: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select
                value={newVehicle.fuelType}
                onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Odometer (km)</label>
              <input
                type="number"
                value={newVehicle.odometer}
                onChange={(e) => setNewVehicle({...newVehicle, odometer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Service Date</label>
              <input
                type="date"
                value={newVehicle.lastService}
                onChange={(e) => setNewVehicle({...newVehicle, lastService: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Vehicle
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length > 0 ? (
          vehicles.map(vehicle => (
            <div key={vehicle._id} className="bg-white p-6 rounded-lg shadow-md relative">
            <button
              onClick={() => handleDeleteVehicle(vehicle._id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete vehicle"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Car className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">{vehicle.model}</h3>
                  <p className="text-sm text-gray-500">{vehicle.engineCC}cc • {vehicle.fuelType}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(vehicle.healthScore)}`}>
                {vehicle.healthScore}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Odometer</span>
                </div>
                <span className="text-sm font-medium">{vehicle.odometer.toLocaleString()} km</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last Service</span>
                </div>
                <span className="text-sm font-medium">
                  {new Date(vehicle.lastService).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Status</span>
                </div>
                <span className="text-sm font-medium text-green-600">{vehicle.status}</span>
              </div>
            </div>

            <button className="w-full mt-4 bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 transition-colors">
              View Details
            </button>
          </div>
        ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No vehicles added yet</p>
            <p className="text-gray-400 text-sm">Click "Add Vehicle" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;