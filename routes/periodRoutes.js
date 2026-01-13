const express = require('express');
const {
  getAllPeriods,
  getCurrentPeriod,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
  activatePeriod,
  updatePeriodStatistics
} = require('../controllers/periodController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas públicas
router.get('/current', getCurrentPeriod);
router.get('/', getAllPeriods);
router.get('/:id', getPeriodById);
router.post('/', createPeriod);
router.put('/:id', updatePeriod);
router.delete('/:id', deletePeriod);
router.put('/:id/activate', activatePeriod);
router.put('/:id/statistics', updatePeriodStatistics);

module.exports = router;
