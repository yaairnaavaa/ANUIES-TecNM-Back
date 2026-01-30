const express = require("express");

const { protect, authorize } = require("./../../middleware/auth.js");

const { IEMS_upload, IEMS_controller } = require("../../../bootstrap.js");

const router = express.Router();

// Todas las rutas públicas
// router.get("/search", searchIEMS);
router
  .route("/")
  .get(protect, IEMS_controller.getAllIEMS)
  .post(protect, IEMS_controller.createIEMS);
router
  .route("/:id")
  .get(protect, IEMS_controller.getIEMSById)
  .patch(protect, IEMS_controller.updateIEMS)
  .delete(protect, IEMS_controller.deactivateIEMS);

// BULK IEMS
router
  .route("/bulkInsert/csv")
  .post(
    IEMS_upload.single("file"),
    protect,
    authorize("Admin Nacional"),
    IEMS_controller.bulkInsertExcelIEMS,
  );

module.exports = router;
