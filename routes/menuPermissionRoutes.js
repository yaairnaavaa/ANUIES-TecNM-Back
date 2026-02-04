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

// Todas las rutas protegidas - solo usuarios autenticados pueden gestionar menú-permisos
router.get('/', protect, getAllMenuPermissions);
router.get('/:id', protect, getMenuPermissionById);
router.post('/', protect, authorize('Admin Nacional'), createMenuPermission);
router.put('/:id', protect, authorize('Admin Nacional'), updateMenuPermission);
router.delete('/:id', protect, authorize('Admin Nacional'), deleteMenuPermission);

module.exports = router;
