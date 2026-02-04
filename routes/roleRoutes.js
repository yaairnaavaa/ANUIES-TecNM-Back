const express = require('express');
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');
const { protect, authorize } = require('./../src//middleware/auth');

const router = express.Router();

// Todas las rutas protegidas - solo usuarios autenticados pueden gestionar roles
router.get('/', protect, getAllRoles);
router.get('/:id', protect, getRoleById);
router.post('/', protect, authorize('Admin Nacional'), createRole);
router.put('/:id', protect, authorize('Admin Nacional'), updateRole);
router.delete('/:id', protect, authorize('Admin Nacional'), deleteRole);

module.exports = router;
