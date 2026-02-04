const express = require("express");
const { protect, authorize } = require("../../middleware/auth.js");

const { userController } = require("../../../bootstrap.js");

const router = express.Router();

// Rutas protegidas - solo usuarios autenticados pueden gestionar usuarios
router
  .route("/")
  .get(protect, userController.getAllUsers)
  .post(protect, authorize('Admin Nacional', 'Admin IES'), userController.createUser);

router
  .route("/:id")
  .get(protect, userController.getUserById)
  .patch(protect, userController.updateUser)
  .delete(protect, authorize('Admin Nacional', 'Admin IES'), userController.deleteUser);

module.exports = router;
