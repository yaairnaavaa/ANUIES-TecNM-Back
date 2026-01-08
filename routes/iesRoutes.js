const express = require('express');
const {
  getAllIES,
  getIESById,
  createIES,
  updateIES,
  deleteIES,
  getIESCareers
} = require('../controllers/iesController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Ruta pública para ver carreras
router.get('/:id/careers', getIESCareers);

// Rutas protegidas
router.use(protect);

router.route('/')
  .get(getAllIES)
  .post(authorize('Admin Nacional'), createIES);

router.route('/:id')
  .get(getIESById)
  .put(authorize('Admin Nacional', 'Admin IES'), updateIES)
  .delete(authorize('Admin Nacional'), deleteIES);

module.exports = router;
