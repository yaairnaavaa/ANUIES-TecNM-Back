const { Router } = require("express");
const { carrerasController } = require("./../../../bootstrap");

const router = Router();

router
  .route("/")
  .get(carrerasController.getCarreras)
  .post(carrerasController.createCarrera);

router.route("/:id").get(carrerasController.getCarreraById);

router.route("/:id/deactivate").patch(carrerasController.deactivateCarreraById);

module.exports = router;
