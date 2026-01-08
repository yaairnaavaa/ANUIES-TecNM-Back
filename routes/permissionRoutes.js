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

// Todas las rutas están protegidas y solo para Admin Nacional
router.use(protect);
router.use(authorize('Admin Nacional'));

router.route('/')
  .get(getAllPermissions)
  .post(createPermission);

router.route('/:id')
  .get(getPermissionById)
  .put(updatePermission)
  .delete(deletePermission);

module.exports = router;
