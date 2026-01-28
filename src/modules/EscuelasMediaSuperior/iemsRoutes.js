const express = require("express");

const { protect, authorize } = require("../../middleware/auth.js");

const { fileHandler, IEMS_controller } = require("../../../bootstrap.js");

const router = express.Router();

// Todas las rutas públicas
// router.get("/search", searchIEMS);
router
  .route("/")
  .get(protect, IEMS_controller.getAllIEMS)
  .post(protect, authorize("Admin Nacional"), IEMS_controller.createIEMS);
router
  .route("/:id")
  .get(protect, IEMS_controller.getIEMSById)
  .patch(protect, IEMS_controller.updateIEMS)
  .delete(protect, authorize("Admin Nacional"), IEMS_controller.deactivateIEMS);

// router
//   .route("/bulkInsert/excel")
//   .post(fileHandler.upload.single("file"), bulkInsertExcelIEMS);

module.exports = router;
