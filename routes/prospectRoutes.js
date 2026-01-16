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

// Todas las rutas públicas
// Rutas públicas
router.post('/register', registerProspect);
router.put('/:id/profile', updateProspectProfile);

// Rutas protegidas
router.get('/', protect, getAllProspects);
router.get('/:id', protect, getProspectById);
router.put('/:id/assign', protect, assignProspect);
router.put('/:id/observations', protect, updateObservations);
router.put('/:id/validate', protect, validateProspect);

module.exports = router;
