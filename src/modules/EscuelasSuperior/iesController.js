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
}

module.exports = IES_Controller;