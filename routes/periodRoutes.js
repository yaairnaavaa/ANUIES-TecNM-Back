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

// Ruta para obtener periodo actual (accesible para usuarios autenticados)
router.get('/current', protect, getCurrentPeriod);

// Rutas protegidas
router.use(protect);

router.route('/')
  .get(getAllPeriods)
  .post(authorize('Admin Nacional'), createPeriod);

router.route('/:id')
  .get(getPeriodById)
  .put(authorize('Admin Nacional'), updatePeriod)
  .delete(authorize('Admin Nacional'), deletePeriod);

router.put(
  '/:id/activate',
  authorize('Admin Nacional'),
  activatePeriod
);

router.put(
  '/:id/statistics',
  authorize('Admin Nacional', 'Admin IES'),
  updatePeriodStatistics
);

module.exports = router;
