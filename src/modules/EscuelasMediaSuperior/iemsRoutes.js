const express = require("express");

const { protect, authorize } = require("./../../middleware/auth.js");

// const { IEMS_upload, IEMS_controller } = require("../../../bootstrap.js");
const { IEMS_controller } = require("../../../bootstrap.js");

const router = express.Router();

// Todas las rutas públicas
// router.get("/search", searchIEMS);
router
  .route("/")
  .get(IEMS_controller.getAllIEMS)
  .post(IEMS_controller.createIEMS);
router
  .route("/:id")
  .get(IEMS_controller.getIEMSById)
  .patch(IEMS_controller.updateIEMS)
  .delete(IEMS_controller.deactivateIEMS);

// BULK IEMS
// router
//   .route("/bulkInsert/csv")
//   .post(
//     IEMS_upload.single("file"),
//     protect,
//     authorize("Admin Nacional"),
//     IEMS_controller.bulkInsertExcelIEMS,
//   );

module.exports = router;
