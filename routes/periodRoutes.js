const express = require("express");
const {
  getAllPeriods,
  getCurrentPeriod,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
  activatePeriod,
  updatePeriodStatistics,
} = require("../controllers/periodController");
const { protect, authorize } = require("./../src/middleware/auth");

const router = express.Router();

// Rutas públicas de consulta
router.get("/current", getCurrentPeriod);
router.get("/", getAllPeriods);
router.get("/:id", getPeriodById);

// Rutas protegidas - solo usuarios autenticados pueden gestionar períodos
router.post("/", protect, authorize('Admin Nacional'), createPeriod);
router.put("/:id", protect, authorize('Admin Nacional'), updatePeriod);
router.delete("/:id", protect, authorize('Admin Nacional'), deletePeriod);
router.put("/:id/activate", protect, authorize('Admin Nacional'), activatePeriod);
router.put("/:id/statistics", protect, authorize('Admin Nacional'), updatePeriodStatistics);

module.exports = router;
