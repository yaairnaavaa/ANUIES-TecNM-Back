const asyncHandler = require("../../middleware/asyncHandler");

class IES_Controller {
  constructor(IES_service) {
    this.IES_service = IES_service;
  }

  // // @desc    Obtener todas las IES
  // // @route   GET /api/ies
  // // @access  Public (con filtros si está autenticado)
  getAllIES = asyncHandler(async (req, res) => {
    const loggedUser = req.user;
    const allIES = await this.IES_service.getAllIES(loggedUser);

    res.status(200).json({
      success: true,
      count: allIES.length,
      data: allIES,
    });
  });

  // // @desc    Obtener todas las carreras de una IES
  // // @route   GET /api/ies:id/carreras
  // // @access  Public (con filtros si está autenticado)
  getCarrerasDeIES = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { user } = req;
    const carreras = await this.IES_service.getCarrerasDeIES(user, id);

    res.status(200).json({
      success: true,
      results: carreras.length,
      data: carreras,
    });
  });

  // // @desc   Insertar carreras a una IES
  // // @route   get /api/ies:id/htmlPage
  // // @access  Public (con filtros si está autenticado)
  getHTMLpage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = await this.IES_service.getHTMLpage(id);

    // res.status(200).set("Content-type", "text/html").send(`${page}`);
    res.status(200).json({
      page,
    });
  });

  // // @desc   Insertar carreras a una IES
  // // @route   post /api/ies:id/htmlPage
  // // @access  Private (con filtros si está autenticado)
  addHTMLpage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    console.log(data);

    await this.IES_service.addHTMLpage(id, data.html);

    res.status(200).json({ status: "success" });
  });

  // // @desc   Insertar carreras a una IES
  // // @route   POST /api/ies:id/carreras
  // // @access  Public (con filtros si está autenticado)
  agregarCarreraDeIES = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const dataCarrera = req.body;
    const { user } = req;

    const createdCareer = await this.IES_service.agregarCarreraDeIES(
      user,
      id,
      dataCarrera,
    );

    res.status(201).json({
      success: true,
      data: createdCareer,
    });
  });

  // @desc    Eliminar una carrera de una IES
  // @route   DELETE /api/ies/:id/carreras/:carreraId
  // @access  Private
  eliminarCarreraDeIES = asyncHandler(async (req, res) => {
    const { id, carreraId } = req.params;
    const { user } = req;

    const careers = await this.IES_service.eliminarCarreraDeIES(
      user,
      id,
      carreraId,
    );

    res.status(200).json({
      success: true,
      data: careers,
    });
  });

  // // @desc    Obtener una IES por ID
  // // @route   GET /api/ies/:id
  // // @access  Private
  getIESById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    const ies = await this.IES_service.getIESById(user, id);

    res.status(200).json({
      success: true,
      data: ies,
    });
  });

  // // @desc    Crear nueva IES
  // // @route   POST /api/ies
  // // @access  Private (Solo Admin Nacional)
  createIES = asyncHandler(async (req, res) => {
    const data = req.body;

    const createdIes = await this.IES_service.createIES(data);

    res.status(201).json({
      success: true,
      data: createdIes,
    });
  });

  // // @desc    Actualizar IES
  // // @route   PATCH /api/ies/:id
  // // @access  Private (Admin Nacional o Admin IES de esa IES)
  updateIES = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { user } = req;

    let updatedIes = await this.IES_service.updateIES(user, id, data);

    res.status(200).json({
      success: true,
      data: updatedIes,
    });
  });

  // // @desc    Eliminar (desactivar) IES
  // // @route   DELETE /api/ies/:id
  // // @access  Private (Solo Admin Nacional)
  deactivateIES = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await this.IES_service.deactivateIES(id);

    res.status(200).json({
      success: true,
      message: "IES desactivada correctamente",
    });
  });

  // // @desc    Actualizar filosofía institucional (misión y visión)
  // // @route   PATCH /api/ies/:id/filosofia
  // // @access  Private (Admin IES, Operativo IES)
  updateFilosofia = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { mision, vision } = req.body;
    const { user } = req;

    const updatedIes = await this.IES_service.updateFilosofia(user, id, { mision, vision });

    res.status(200).json({
      success: true,
      data: updatedIes,
    });
  });

  // // @desc    Actualizar identidad visual (logo, colores, banner)
  // // @route   PATCH /api/ies/:id/identidad-visual
  // // @access  Private (Admin IES, Operativo IES)
  updateIdentidadVisual = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { user } = req;

    const updatedIes = await this.IES_service.updateIdentidadVisual(user, id, data);

    res.status(200).json({
      success: true,
      data: updatedIes,
    });
  });

  // // @desc    Actualizar canales digitales (redes sociales, sitio web)
  // // @route   PATCH /api/ies/:id/canales-digitales
  // // @access  Private (Admin IES, Operativo IES)
  updateCanalesDigitales = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { user } = req;

    const updatedIes = await this.IES_service.updateCanalesDigitales(user, id, data);

    res.status(200).json({
      success: true,
      data: updatedIes,
    });
  });

  // // @desc    Subir logo institucional
  // // @route   POST /api/ies/:id/upload-logo
  // // @access  Private (Admin IES, Operativo IES)
  uploadLogo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    
    // TODO: Implementar upload con Cloudinary
    // const file = req.file;
    // const uploadedImage = await cloudinaryService.uploadImage(file);

    // Por ahora, placeholder para la configuración pendiente
    res.status(501).json({
      success: false,
      message: "Configuración de Cloudinary pendiente. Agrega las credenciales y carpeta en la próxima iteración.",
      // Estructura esperada cuando esté configurado:
      // data: {
      //   url: uploadedImage.secure_url,
      //   publicId: uploadedImage.public_id
      // }
    });
  });

  // // @desc    Subir banner institucional
  // // @route   POST /api/ies/:id/upload-banner
  // // @access  Private (Admin IES, Operativo IES)
  uploadBanner = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    
    // TODO: Implementar upload con Cloudinary
    res.status(501).json({
      success: false,
      message: "Configuración de Cloudinary pendiente.",
    });
  });

  // // @desc    Agregar imagen a galería institucional
  // // @route   POST /api/ies/:id/upload-gallery
  // // @access  Private (Admin IES, Operativo IES)
  uploadGalleryImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    
    // TODO: Implementar upload con Cloudinary
    res.status(501).json({
      success: false,
      message: "Configuración de Cloudinary pendiente.",
    });
  });
}

module.exports = IES_Controller;
