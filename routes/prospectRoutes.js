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
router.post("/register", registerProspect);
router.get("/", getAllProspects);
router.get("/:id", getProspectById);
router.put("/:id/profile", updateProspectProfile);
router.put("/:id/assign", assignProspect);
router.put("/:id/observations", updateObservations);
router.put("/:id/validate", validateProspect);

module.exports = router;
