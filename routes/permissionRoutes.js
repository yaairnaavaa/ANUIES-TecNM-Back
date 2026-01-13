const express = require('express');
const {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permissionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas públicas
router.get('/', getAllPermissions);
router.get('/:id', getPermissionById);
router.post('/', createPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);

module.exports = router;
