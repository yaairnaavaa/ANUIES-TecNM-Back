const { Router } = require("express");
const { protect, authorize } = require("./../../middleware/auth");
const { carrerasController } = require("./../../../bootstrap");

const router = Router();

router
  .route("/")
  .get(protect, carrerasController.getCarreras)
  .post(protect, authorize("Admin Nacional"), carrerasController.createCarrera);

router
  .route("/:id")
  .get(protect, carrerasController.getCarreraById)
  .patch(protect, authorize("Admin Nacional"), carrerasController.updateCarrera);

router.route("/:id/deactivate").patch(protect, authorize("Admin Nacional"), carrerasController.deactivateCarreraById);

module.exports = router;
