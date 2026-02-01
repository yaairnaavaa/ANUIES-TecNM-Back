const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("./../controllers/authController");

const { protect, authorize } = require("./../src/middleware/auth");

const router = express.Router();

// Rutas públicas
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Rutas protegidas
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/updatepassword", protect, updatePassword);

// Solo Admin Nacional y Admin IES pueden registrar usuarios
router.post(
  "/register",
  protect,
  authorize("Admin Nacional", "Admin IES"),
  register,
);

module.exports = router;
