const express = require('express');
const {
  getAllIEMS,
  getIEMSById,
  createIEMS,
  updateIEMS,
  deleteIEMS,
  searchIEMS
} = require('../controllers/iemsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas de consulta
router.get('/search', searchIEMS);
router.get('/', getAllIEMS);
router.get('/:id', getIEMSById);

// Rutas protegidas para modificación
router.post('/', protect, authorize('Admin Nacional', 'Admin IES'), createIEMS);
router.put('/:id', protect, authorize('Admin Nacional', 'Admin IES'), updateIEMS);
router.delete('/:id', protect, authorize('Admin Nacional'), deleteIEMS);

module.exports = router;
