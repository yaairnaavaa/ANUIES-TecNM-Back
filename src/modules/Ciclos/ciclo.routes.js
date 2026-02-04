const { Router } = require("express");
const { protect, authorize } = require("./../../middleware/auth");

const { cicloController } = require("./../../../bootstrap.js");

const router = Router();

// Rutas públicas de consulta
router.get("/", cicloController.getCiclos);
router.get("/currentActive", cicloController.getCurrentCicleActive);
router.get("/:id", cicloController.getCicloById);

// Rutas protegidas - solo usuarios autenticados pueden crear/actualizar ciclos
router.post("/", protect, authorize('Admin Nacional'), cicloController.createCiclo);
router.patch("/:id", protect, authorize('Admin Nacional'), cicloController.updateCiclo);

module.exports = router;
