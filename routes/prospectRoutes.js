const express = require('express');
const {
  registerProspect,
  updateProspectProfile,
  getAllProspects,
  getProspectById,
  assignProspect,
  updateObservations,
  validateProspect
} = require('../controllers/prospectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/register', registerProspect);
router.put('/:id/profile', updateProspectProfile);

// Rutas protegidas
router.use(protect);

router.get('/', getAllProspects);
router.get('/:id', getProspectById);

router.put(
  '/:id/assign',
  authorize('Admin Nacional', 'Admin IES', 'Operativo IES'),
  assignProspect
);

router.put(
  '/:id/observations',
  authorize('Admin Nacional', 'Admin IES', 'Operativo IES'),
  updateObservations
);

router.put(
  '/:id/validate',
  authorize('Admin Nacional', 'Admin IES', 'Operativo IES'),
  validateProspect
);

module.exports = router;
