const asyncHandler = require("../../middleware/asyncHandler.js");
// const IEMS = require("./IEMS.model.js");
// const { fileHandler } = require("./../../../bootstrap.js");

class IEMS_Controller {
  constructor(IEMS_service, fileHandler) {
    this.IEMS_service = IEMS_service;
    this.fileHandler = fileHandler;
  }

  // // @desc    Obtener todas las IEMS
  // // @route   GET /api/iems
  // // @access  Private
  getAllIEMS = asyncHandler(async (req, res) => {
    const iems = await this.IEMS_service.getAllIEMS(req.query);

    res.status(200).json({
      success: true,
      count: iems.length,
      data: iems,
    });
  });

  // // @desc    Obtener una IEMS por ID
  // // @route   GET /api/iems/:id
  // // @access  Private
  getIEMSById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const iems = await this.IEMS_service.getIEMSById(id);

    res.status(200).json({
      success: true,
      data: iems,
    });
  });

  // // @desc    Crear nueva IEMS
  // // @route   POST /api/iems
  // // @access  Private (Admin Nacional y Admin IES)
  createIEMS = asyncHandler(async (req, res) => {
    const data = req.body;
    const iems = await this.IEMS_service.createIEMS(data);

    res.status(201).json({
      success: true,
      data: iems,
    });
  });

  // // @desc    Actualizar IEMS
  // // @route   PUT /api/iems/:id
  // // @access  Private (Admin Nacional y Admin IES)
  updateIEMS = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    let UpdatedIEMS = await this.IEMS_service.updateIEMS(id, data);

    res.status(200).json({
      success: true,
      data: UpdatedIEMS,
    });
  });

  // // @desc    Eliminar (desactivar) IEMS
  // // @route   DELETE /api/iems/:id
  // // @access  Private (Admin Nacional)
  deactivateIEMS = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await this.IEMS_service.deactivateIEMS(id);

    res.status(200).json({
      success: true,
      message: "IEMS desactivada correctamente",
    });
  });

  bulkInsertExcelIEMS = asyncHandler(async (req, res) => {
    //1) Recibir csv
    const file = req.file;

    // console.log("fileHandler:", fileHandler);
    // console.log("CSVtoJson:", fileHandler.CSVtoJson);

    if (!file) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid csv file",
      });
    }

    const data = await this.fileHandler.CSVtoJson(file.path);

    const restructuredData = data.map((row) => {
      const values = Object.values(row);

      return {
        address: {
          state: values[0], // ENTIDAD
          municipality: values[1], // MUNICIPIO
          locality: values[2], // LOCALIDAD
        },
        name: values[3], // NOMBRE_DEL_PLANTEL
        type: values[4] ?? "Otro", // SUBSISTEMA
        code: values[5], // CCT
      };
    });

    let IEMSInsertados = [];
    let IEMSDuplicados = [];

    const result =
      await this.IEMS_service.bulkInsertExcelIEMS(restructuredData);

    IEMSInsertados = result.IEMSInsertados;
    IEMSDuplicados = result.IEMSDuplicados;

    res.status(201).json({
      status: "sucess",
      data: {
        IEMSInsertados,
        IEMSDuplicados,
      },
    });
  });
}

module.exports = IEMS_Controller;

// // @desc Bulk instert IEMS desde excel
// // @route POST /api/
// // @access Private (Admin Nacional)
