const express = require("express");
const {
  registerProspect,
  updateProspectProfile,
  getAllProspects,
  getProspectById,
  assignProspect,
  updateObservations,
  validateProspect,
} = require("../controllers/prospectController");
const { protect, authorize } = require("./../src/middleware/auth");

const router = express.Router();

// Todas las rutas públicas
// Rutas públicas
router.post("/register", registerProspect);
router.patch("/:id/profile", updateProspectProfile);
router.patch("/:id", updateProspectProfile);
router.get("/", getAllProspects); // Temporalmente pública para Vercel
router.get("/:id", getProspectById); // Temporalmente pública para Vercel

// Rutas protegidas
router.put("/:id/assign", protect, assignProspect);
router.put("/:id/observations", protect, updateObservations);
router.put("/:id/validate", protect, validateProspect);

module.exports = router;
