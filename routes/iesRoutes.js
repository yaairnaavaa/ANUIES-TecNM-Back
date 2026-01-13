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

// Todas las rutas públicas
router.get('/', getAllIES);
router.get('/:id/careers', getIESCareers);
router.get('/:id', getIESById);
router.post('/', createIES);
router.put('/:id', updateIES);
router.delete('/:id', deleteIES);

module.exports = router;
