const express = require("express");
const { protect, authorize } = require("../../../middleware/auth");

const { IES_controller } = require("./../../../bootstrap.js");

const router = express.Router();

// Todas las rutas públicas
// router.get('/', getAllIES);
// router.get('/:id/careers', getIESCareers);
// router.get('/:id', getIESById);
// router.post('/', createIES);
// router.put('/:id', updateIES);
// router.delete('/:id', deleteIES);

router.route("/").get(IES_controller.getAllIES);

router.route("/:id").get(IES_controller.getIESById);

module.exports = router;
