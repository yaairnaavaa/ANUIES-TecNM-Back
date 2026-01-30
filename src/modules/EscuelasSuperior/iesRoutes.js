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
  .get(IES_controller.getAllIES)
  .post(protect, IES_controller.createIES);

router
  .route("/:id")
  .get(IES_controller.getIESById)
  .patch(protect, IES_controller.updateIES)
  .delete(protect, IES_controller.deactivateIES);

//CUSTOM ROUTES
router
  .route("/:id/carreras")
  .get(IES_controller.getCarrerasDeIES)
  .post(protect, IES_controller.agregarCarreraDeIES);

router
  .route("/:id/carreras/:carreraId")
  .delete(protect, IES_controller.eliminarCarreraDeIES);

router.route("/:id/htmlPage").get(IES_controller.getHTMLpage).post(protect, IES_controller.addHTMLpage);

// Rutas específicas para edición por secciones (requieren autenticación)
router.route("/:id/filosofia").patch(protect, IES_controller.updateFilosofia);
router.route("/:id/identidad-visual").patch(protect, IES_controller.updateIdentidadVisual);
router.route("/:id/canales-digitales").patch(protect, IES_controller.updateCanalesDigitales);

// Rutas para uploads de imágenes (requieren autenticación, preparadas para Cloudinary)
router.route("/:id/upload-logo").post(protect, IES_controller.uploadLogo);
router.route("/:id/upload-banner").post(protect, IES_controller.uploadBanner);
router.route("/:id/upload-gallery").post(protect, IES_controller.uploadGalleryImage);

module.exports = router;
