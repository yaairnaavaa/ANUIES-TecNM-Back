const express = require('express');
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas están protegidas y solo para Admin Nacional
router.use(protect);
router.use(authorize('Admin Nacional'));

router.route('/')
  .get(getAllRoles)
  .post(createRole);

router.route('/:id')
  .get(getRoleById)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
