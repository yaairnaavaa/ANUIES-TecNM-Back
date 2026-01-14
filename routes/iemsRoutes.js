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

// Todas las rutas públicas
router.get('/search', searchIEMS);
router.get('/', getAllIEMS);
router.get('/:id', getIEMSById);
router.post('/', createIEMS);
router.put('/:id', updateIEMS);
router.delete('/:id', deleteIEMS);

module.exports = router;
