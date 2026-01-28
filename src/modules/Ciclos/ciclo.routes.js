const { Router } = require("express");
const { protect, authorize } = require("./../../middleware/auth");

const { cicloController } = require("./../../../bootstrap.js");

const router = Router();

router
  .route("/")
  .get(cicloController.getCiclos)
  .post(cicloController.createCiclo);

router.get("/currentActive", cicloController.getCurrentCicleActive);

router
  .route("/:id")
  .get(cicloController.getCicloById)
  .patch(cicloController.updateCiclo);

module.exports = router;
