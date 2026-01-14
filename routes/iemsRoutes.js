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

<<<<<<< Updated upstream
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
=======
// Todas las rutas públicas
router.get('/search', searchIEMS);
router.get('/', getAllIEMS);
router.get('/:id', getIEMSById);
router.post('/', createIEMS);
router.put('/:id', updateIEMS);
router.delete('/:id', deleteIEMS);
>>>>>>> Stashed changes

module.exports = router;
