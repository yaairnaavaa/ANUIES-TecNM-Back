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

router.route("/").get(IES_controller.getAllIES).post(IES_controller.createIES);

router
  .route("/:id")
  .get(IES_controller.getIESById)
  .patch(IES_controller.updateIES)
  .delete(IES_controller.deactivateIES);

//CUSTOM ROUTES
router.route("/:id/carreras").get(IES_controller.getCarrerasDeIES);
router
  .route("/:iesId/carreras/:carreraId")
  .delete(IES_controller.deactivateCarreraDeIES);

module.exports = router;
