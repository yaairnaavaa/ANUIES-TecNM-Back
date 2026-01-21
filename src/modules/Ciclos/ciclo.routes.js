const { Router } = require("express");

const { cicloController } = require("./../../../bootstrap.js");

const router = Router();

router
  .route("/")
  .get(cicloController.getCiclos)
  .post(cicloController.createCiclo);

router.get("/currentActive", cicloController.getCurrentCicleActive);

router.route("/:id").get(cicloController.getCicloById);

module.exports = router;
