const asyncHandler = require("../../../middleware/asyncHandler.js");
// const IEMS = require("./IEMS.model.js");
// const { fileHandler } = require("../../../bootstrap.js");

class IEMS_Controller {
  constructor(IEMS_service) {
    this.IEMS_service = IEMS_service;
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
}

module.exports = IEMS_Controller;

// // @desc    Eliminar (desactivar) IEMS
// // @route   DELETE /api/iems/:id
// // @access  Private (Admin Nacional)
// exports.deleteIEMS = asyncHandler(async (req, res) => {
//   const iems = await IEMS.findById(req.params.id);

//   if (!iems) {
//     return res.status(404).json({
//       success: false,
//       message: "IEMS no encontrada",
//     });
//   }

//   // Desactivar en lugar de eliminar
//   iems.active = false;
//   await iems.save();

//   res.status(200).json({
//     success: true,
//     message: "IEMS desactivada correctamente",
//     data: {},
//   });
// });

// // @desc    Buscar IEMS por estado y municipio
// // @route   GET /api/iems/search
// // @access  Public
// exports.searchIEMS = asyncHandler(async (req, res) => {
//   const { state, municipality, type } = req.query;

//   let query = IEMS.find({ active: true });

//   if (state) {
//     query = query.where("address.state").equals(state);
//   }

//   if (municipality) {
//     query = query
//       .where("address.municipality")
//       .regex(new RegExp(municipality, "i"));
//   }

//   if (type) {
//     query = query.where("type").equals(type);
//   }

//   const iems = await query.select(
//     "name type address.municipality address.state contact.email"
//   );

//   res.status(200).json({
//     success: true,
//     count: iems.length,
//     data: iems,
//   });
// });

// // @desc Bulk instert IEMS desde excel
// // @route POST /api/
// // @access Private (Admin Nacional)
// exports.bulkInsertExcelIEMS = asyncHandler(async (req, res) => {
//   //1) Recibir excel
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Invalid csv file",
//     });
//   }

//   const data = await fileHandler.CSVtoJson(file.path);

//   const restructuredData = data.map((d) => ({
//     code: d.CCT,
//     name: d.NOMBRE_DEL_PLANTEL,
//     type: d.SUBSISTEMA ?? "Otro",
//     address: {
//       state: d.ENTIDAD,
//       municipality: d.MUNICIPIO,
//       locality: d.LOCALIDAD,
//     },
//     cct: d.CCT,
//   }));

//   let IEMSInsertados = [];
//   let IEMSDuplicados = [];

//   try {
//     IEMSInsertados = await IEMS.insertMany(restructuredData, {
//       ordered: false,
//     });
//   } catch (error) {
//     IEMSInsertados = error.insertedDocs || [];

//     if (error.writeErrors) {
//       for (const e of error.writeErrors) {
//         if (e.err.code === 11000) {
//           IEMSDuplicados.push({
//             name: e.err.op.name,
//             code: e.err.op.cct,
//           });
//         }
//       }
//     }
//   }
//   res.status(201).json({
//     status: "sucess",
//     data: {
//       IEMSInsertados,
//       IEMSDuplicados,
//     },
//   });
// });
