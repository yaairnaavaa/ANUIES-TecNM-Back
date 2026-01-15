const express = require("express");

const {
  getAllIEMS,
  getIEMSById,
  createIEMS,
  updateIEMS,
  deleteIEMS,
  searchIEMS,
  bulkInsertExcelIEMS,
} = require("../controllers/iemsController");
const { protect, authorize } = require("../middleware/auth");

const { fileHandler } = require("./../bootstrap.js");

const router = express.Router();

// Todas las rutas públicas
router.get("/search", searchIEMS);
router.get("/", getAllIEMS);
router.get("/:id", getIEMSById);
router.post("/", createIEMS);
router.put("/:id", updateIEMS);
router.delete("/:id", deleteIEMS);

router
  .route("/bulkInsert/excel")
  .post(fileHandler.upload.single("file"), bulkInsertExcelIEMS);

module.exports = router;
