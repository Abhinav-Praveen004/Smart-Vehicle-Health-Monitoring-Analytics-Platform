import express from 'express';
import Alert from '../models/Alert.js';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get all alerts for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;
    
    const query = { userId: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const alerts = await Alert.find(query)
      .populate('vehicleId', 'model')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
});

// @route   GET /api/alerts/vehicle/:vehicleId
// @desc    Get alerts for a specific vehicle
// @access  Private
router.get('/vehicle/:vehicleId', protect, async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const alerts = await Alert.find({ vehicleId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle alerts', error: error.message });
  }
});

// @route   PUT /api/alerts/:id/read
// @desc    Mark alert as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.isRead = true;
    await alert.save();

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert', error: error.message });
  }
});

// @route   PUT /api/alerts/read-all
// @desc    Mark all alerts as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating alerts', error: error.message });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete an alert
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await alert.deleteOne();
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert', error: error.message });
  }
});

// @route   GET /api/alerts/stats/count
// @desc    Get alert count statistics
// @access  Private
router.get('/stats/count', protect, async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments({ userId: req.user._id });
    const unreadAlerts = await Alert.countDocuments({ userId: req.user._id, isRead: false });
    const criticalAlerts = await Alert.countDocuments({ userId: req.user._id, type: 'critical', isRead: false });

    res.json({
      total: totalAlerts,
      unread: unreadAlerts,
      critical: criticalAlerts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alert stats', error: error.message });
  }
});

export default router;