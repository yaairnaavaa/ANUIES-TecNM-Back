const { Router } = require("express");
const { protect, authorize } = require("./../../middleware/auth");
const { carrerasController } = require("./../../../bootstrap");

const router = Router();

// Rutas públicas de consulta
router.get("/", carrerasController.getCarreras);
router.get("/:id", carrerasController.getCarreraById);

// Rutas protegidas - solo usuarios autenticados pueden gestionar carreras
router.post("/", protect, authorize('Admin Nacional', 'Admin IES'), carrerasController.createCarrera);
router.patch("/:id", protect, authorize('Admin Nacional', 'Admin IES'), carrerasController.updateCarrera);
router.patch("/:id/deactivate", protect, authorize('Admin Nacional', 'Admin IES'), carrerasController.deactivateCarreraById);

module.exports = router;
