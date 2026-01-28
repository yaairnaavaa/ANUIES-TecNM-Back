const { Router } = require("express");
const { protect, authorize } = require("./../../middleware/auth");

const { cicloController } = require("./../../../bootstrap.js");

const router = Router();

router
  .route("/")
  .get(protect, cicloController.getCiclos)
  .post(protect, authorize("Admin Nacional"), cicloController.createCiclo);

router.get("/currentActive", cicloController.getCurrentCicleActive);

router
  .route("/:id")
  .get(protect, cicloController.getCicloById)
  .patch(protect, authorize("Admin Nacional"), cicloController.updateCiclo);

module.exports = router;
