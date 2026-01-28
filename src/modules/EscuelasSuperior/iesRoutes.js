const express = require("express");
const { protect, authorize } = require("./../../middleware/auth.js");

const { IES_controller } = require("./../../../bootstrap.js");

const router = express.Router();

// Todas las rutas públicas
// router.get('/', getAllIES);
// router.get('/:id/careers', getIESCareers);
// router.get('/:id', getIESById);
// router.post('/', createIES);
// router.put('/:id', updateIES);
// router.delete('/:id', deleteIES);

router
  .route("/")
  .get(protect, IES_controller.getAllIES)
  .post(protect, authorize("Admin Nacional"), IES_controller.createIES);

router
  .route("/:id")
  .get(protect, IES_controller.getIESById)
  .patch(protect, IES_controller.updateIES)
  .delete(protect, IES_controller.deactivateIES);

//CUSTOM ROUTES
router
  .route("/:id/carreras")
  .get(protect, IES_controller.getCarrerasDeIES)
  .post(protect, IES_controller.agregarCarreraDeIES);

router.route("/:id/htmlPage").get(protect, IES_controller.getHTMLpage).post(IES_controller.addHTMLpage);

module.exports = router;
