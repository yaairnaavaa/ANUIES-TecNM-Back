const express = require("express");
const { protect, authorize } = require("../../middleware/auth.js");

const { userController } = require("../../../bootstrap.js");

const router = express.Router();

// Rutas para gestión de usuarios
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
