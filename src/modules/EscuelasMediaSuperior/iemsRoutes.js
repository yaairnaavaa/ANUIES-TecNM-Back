const express = require("express");

const { protect, authorize } = require("./../../middleware/auth.js");

// const { IEMS_upload, IEMS_controller } = require("../../../bootstrap.js");
const { IEMS_controller } = require("../../../bootstrap.js");

const router = express.Router();

// Rutas públicas de consulta
router.get("/", IEMS_controller.getAllIEMS);
router.get("/:id", IEMS_controller.getIEMSById);

// Rutas protegidas - solo usuarios autenticados pueden gestionar IEMS
router.post(
  "/",
  protect,
  authorize("Admin Nacional", "Admin IEMS"),
  IEMS_controller.createIEMS,
);
router.patch(
  "/:id",
  protect,
  authorize("Admin Nacional", "Admin IEMS"),
  IEMS_controller.updateIEMS,
);
router.delete(
  "/:id",
  protect,
  authorize("Admin Nacional", "Admin IEMS"),
  IEMS_controller.deactivateIEMS,
);

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
