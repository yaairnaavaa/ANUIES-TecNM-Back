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

// Ruta pública para búsqueda
router.get('/search', searchIEMS);

// Rutas protegidas
router.use(protect);

router.route('/')
  .get(getAllIEMS)
  .post(authorize('Admin Nacional', 'Admin IES'), createIEMS);

router.route('/:id')
  .get(getIEMSById)
  .put(authorize('Admin Nacional', 'Admin IES'), updateIEMS)
  .delete(authorize('Admin Nacional'), deleteIEMS);

module.exports = router;
