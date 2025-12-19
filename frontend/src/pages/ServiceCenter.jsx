import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Wrench, Plus, Check, X } from 'lucide-react';
import { vehiclesAPI, appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ServiceCenter = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [vehiclesData, appointmentsData] = await Promise.all([
        vehiclesAPI.getAll(),
        appointmentsAPI.getAll()
      ]);
      setVehicles(vehiclesData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    vehicle: '',
    service: '',
    date: '',
    time: '',
    center: ''
  });

  const serviceTypes = [
    'Regular Maintenance',
    'Oil Change',
    'Brake Service',
    'Battery Replacement',
    'Tire Rotation',
    'Engine Diagnostic',
    'AC Service'
  ];

  const serviceCenters = [
    'AutoCare Plus',
    'Quick Service Hub',
    'Premium Motors',
    'City Auto Service',
    'Express Care'
  ];

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const selectedVehicle = vehicles.find(v => v.model === newAppointment.vehicle);
      const appointmentData = {
        vehicleId: selectedVehicle._id,
        ...newAppointment
      };
      
      await appointmentsAPI.create(appointmentData);
      await fetchData();
      setNewAppointment({ vehicle: '', service: '', date: '', time: '', center: '' });
      setShowBookingForm(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await appointmentsAPI.updateStatus(id, status);
      await fetchData();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await appointmentsAPI.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Service Center</h1>
        <button
          onClick={() => setShowBookingForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month Cost</p>
              <p className="text-2xl font-bold text-green-600">₹{appointments.reduce((acc, app) => acc + app.cost, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Services</p>
              <p className="text-2xl font-bold text-orange-600">{appointments.filter(a => a.status === 'Scheduled').length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Service Centers</p>
              <p className="text-2xl font-bold text-purple-600">{serviceCenters.length}</p>
            </div>
            <Wrench className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Book New Appointment</h3>
          <form onSubmit={handleBookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
              <select
                value={newAppointment.vehicle}
                onChange={(e) => setNewAppointment({...newAppointment, vehicle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle._id} value={vehicle.model}>{vehicle.model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={newAppointment.service}
                onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Service</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Center</label>
              <select
                value={newAppointment.center}
                onChange={(e) => setNewAppointment({...newAppointment, center: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Service Center</option>
                {serviceCenters.map(center => (
                  <option key={center} value={center}>{center}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Book Appointment
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading appointments...</div>
        ) : appointments.filter(a => a.status !== 'Completed').length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>No upcoming appointments</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments.filter(a => a.status !== 'Completed').map(appointment => (
            <div key={appointment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="text-lg font-medium text-gray-800">{appointment.vehicle}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4" />
                      <span>{appointment.service}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.center}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {appointment.status === 'Scheduled' && (
                    <>
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'Confirmed')}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                        title="Confirm Appointment"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment._id)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                        title="Cancel Appointment"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {appointment.status === 'Confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Mark Complete
                    </button>
                  )}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800">₹{appointment.cost.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Estimated Cost</div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Service History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Service History</h3>
        {appointments.filter(a => a.status === 'Completed').length > 0 ? (
          <div className="space-y-4">
            {appointments.filter(a => a.status === 'Completed').map(appointment => (
              <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{appointment.vehicle} - {appointment.service}</div>
                  <div className="text-sm text-gray-600">
                    {appointment.center} • {appointment.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{appointment.cost.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-4">
            <p>No service history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCenter;