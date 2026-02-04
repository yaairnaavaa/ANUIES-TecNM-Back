const express = require('express');
const {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permissionController');
const { protect, authorize } = require('./../src/middleware/auth');

const router = express.Router();

// Todas las rutas protegidas - solo usuarios autenticados pueden gestionar permisos
router.get('/', protect, getAllPermissions);
router.get('/:id', protect, getPermissionById);
router.post('/', protect, authorize('Admin Nacional'), createPermission);
router.put('/:id', protect, authorize('Admin Nacional'), updatePermission);
router.delete('/:id', protect, authorize('Admin Nacional'), deletePermission);

module.exports = router;
