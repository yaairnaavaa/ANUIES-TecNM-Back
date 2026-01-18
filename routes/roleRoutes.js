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

// Todas las rutas públicas
router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
