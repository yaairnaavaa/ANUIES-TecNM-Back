const express = require("express");

// const {
//   getAllIEMS,
//   getIEMSById,
//   createIEMS,
//   updateIEMS,
//   deleteIEMS,
//   searchIEMS,
//   bulkInsertExcelIEMS,
// } = require("../controllers/iemsController");
const { protect, authorize } = require("../middleware/auth");

const { fileHandler, IEMS_controller } = require("./../bootstrap.js");

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
// router.post("/", createIEMS);
// router.put("/:id", updateIEMS);
// router.delete("/:id", deleteIEMS);

// router
//   .route("/bulkInsert/excel")
//   .post(fileHandler.upload.single("file"), bulkInsertExcelIEMS);

module.exports = router;
