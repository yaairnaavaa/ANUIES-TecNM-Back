const asyncHandler = require("../../middleware/asyncHandler");

class IES_Controller {
  constructor(IES_service) {
    this.IES_service = IES_service;
  }

  // // @desc    Obtener todas las IES
  // // @route   GET /api/ies
  // // @access  Public (con filtros si está autenticado)
  getAllIES = asyncHandler(async (req, res) => {
    const allIES = await this.IES_service.getAllIES();

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
    const carreras = await this.IES_service.getCarrerasDeIES(id);

    res.status(200).json({
      success: true,
      count: carreras.length,
      data: carreras,
    });
  });

  // // @desc    Actualizar una carreras de una IES
  // // @route   patch /api/ies:iesId/carreras/:carreraNombre
  // // @access  Public (con filtros si está autenticado)
  actualizarCarreraDeIES = asyncHandler(async (req, res) => {
    const { iesId, carreraNombre } = req.params;
    const data = req.body;

    const updatedCarrera = await this.IES_service.actualizarCarreraDeIES(
      iesId,
      carreraNombre,
      data,
    );

    res.status(200).json({
      success: true,
      message: `Carrera actualizada`,
      data: updatedCarrera,
    });
  });

  // // @desc    Obtener una IES por ID
  // // @route   GET /api/ies/:id
  // // @access  Private
  getIESById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ies = await this.IES_service.getIESById(id);

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
  // // @route   PUT /api/ies/:id
  // // @access  Private (Admin Nacional o Admin IES de esa IES)
  updateIES = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let updatedIes = await this.IES_service.updateIES(id, data);

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

// // @desc    Obtener carreras de una IES
// // @route   GET /api/ies/:id/careers
// // @access  Public
// exports.getIESCareers = asyncHandler(async (req, res) => {
//   const ies = await IES.findById(req.params.id).select('name careers');

//   if (!ies) {
//     return res.status(404).json({
//       success: false,
//       message: 'IES no encontrada'
//     });
//   }

//   // Filtrar solo carreras activas
//   const activeCareers = ies.careers.filter(career => career.active);

//   res.status(200).json({
//     success: true,
//     data: {
//       iesName: ies.name,
//       careers: activeCareers
//     }
//   });
// });
