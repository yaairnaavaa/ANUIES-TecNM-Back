const express = require('express');
const {
  getAllMenuPermissions,
  getMenuPermissionById,
  createMenuPermission,
  updateMenuPermission,
  deleteMenuPermission
} = require('../controllers/menuPermissionController');
const { protect, authorize } = require('./../src/middleware/auth');

const router = express.Router();

// Todas las rutas públicas por ahora (agregar protect después)
router.get('/', getAllMenuPermissions);
router.get('/:id', getMenuPermissionById);
router.post('/', createMenuPermission);
router.put('/:id', updateMenuPermission);
router.delete('/:id', deleteMenuPermission);

module.exports = router;
