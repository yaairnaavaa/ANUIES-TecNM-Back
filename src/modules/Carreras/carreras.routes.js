const { Router } = require("express");
const { protect, authorize } = require("./../../middleware/auth");
const { carrerasController } = require("./../../../bootstrap");

const router = Router();

router
  .route("/")
  .get(carrerasController.getCarreras)
  .post(carrerasController.createCarrera);

router
  .route("/:id")
  .get(carrerasController.getCarreraById)
  .patch(carrerasController.updateCarrera);

router.route("/:id/deactivate").patch(carrerasController.deactivateCarreraById);

module.exports = router;
