const IEMS = require("../models/IEMS");
const asyncHandler = require("../middleware/asyncHandler.js");
const { fileHandler } = require("../bootstrap.js");

const path = require("path");
const fs = require("fs");

// @desc    Obtener todas las IEMS
// @route   GET /api/iems
// @access  Private
exports.getAllIEMS = asyncHandler(async (req, res) => {
  let query = IEMS.find();

  // Filtros opcionales
  if (req.query.state) {
    query = query.where("address.state").equals(req.query.state);
  }

  if (req.query.municipality) {
    query = query
      .where("address.municipality")
      .regex(new RegExp(req.query.municipality, "i"));
  }

  if (req.query.type) {
    query = query.where("type").equals(req.query.type);
  }

  if (req.query.active !== undefined) {
    query = query.where("active").equals(req.query.active === "true");
  }

  const iems = await query.sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: iems.length,
    data: iems,
  });
});

// @desc    Obtener una IEMS por ID
// @route   GET /api/iems/:id
// @access  Private
exports.getIEMSById = asyncHandler(async (req, res) => {
  const iems = await IEMS.findById(req.params.id).populate(
    "linkage.directPassAgreements.ies",
    "name code"
  );

  if (!iems) {
    return res.status(404).json({
      success: false,
      message: "IEMS no encontrada",
    });
  }

  res.status(200).json({
    success: true,
    data: iems,
  });
});

// @desc    Crear nueva IEMS
// @route   POST /api/iems
// @access  Private (Admin Nacional y Admin IES)
exports.createIEMS = asyncHandler(async (req, res) => {
  const iems = await IEMS.create(req.body);

  res.status(201).json({
    success: true,
    data: iems,
  });
});

// @desc    Actualizar IEMS
// @route   PUT /api/iems/:id
// @access  Private (Admin Nacional y Admin IES)
exports.updateIEMS = asyncHandler(async (req, res) => {
  let iems = await IEMS.findById(req.params.id);

  if (!iems) {
    return res.status(404).json({
      success: false,
      message: "IEMS no encontrada",
    });
  }

  iems = await IEMS.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: iems,
  });
});

// @desc    Eliminar (desactivar) IEMS
// @route   DELETE /api/iems/:id
// @access  Private (Admin Nacional)
exports.deleteIEMS = asyncHandler(async (req, res) => {
  const iems = await IEMS.findById(req.params.id);

  if (!iems) {
    return res.status(404).json({
      success: false,
      message: "IEMS no encontrada",
    });
  }

  // Desactivar en lugar de eliminar
  iems.active = false;
  await iems.save();

  res.status(200).json({
    success: true,
    message: "IEMS desactivada correctamente",
    data: {},
  });
});

// @desc    Buscar IEMS por estado y municipio
// @route   GET /api/iems/search
// @access  Public
exports.searchIEMS = asyncHandler(async (req, res) => {
  const { state, municipality, type } = req.query;

  let query = IEMS.find({ active: true });

  if (state) {
    query = query.where("address.state").equals(state);
  }

  if (municipality) {
    query = query
      .where("address.municipality")
      .regex(new RegExp(municipality, "i"));
  }

  if (type) {
    query = query.where("type").equals(type);
  }

  const iems = await query.select(
    "name type address.municipality address.state contact.email"
  );

  res.status(200).json({
    success: true,
    count: iems.length,
    data: iems,
  });
});

// @desc Bulk instert IEMS desde excel
// @route POST /api/
// @access Private (Admin Nacional)
exports.bulkInsertExcelIEMS = asyncHandler(async (req, res) => {
  //1) Recibir excel
  const file = req.file;

  if (!file) {
    return res.status(500).json({});
  }

  try {
    const data = await fileHandler.CSVtoJson(file.path);

    const restructuredData = data.map((d) => ({
      code: d.CCT,
      name: d.NOMBRE_DEL_PLANTEL,
      type: d.SUBSISTEMA || "Otro",
      address: {
        state: d.ENTIDAD,
        municipality: d.MUNICIPIO,
        locality: d.LOCALIDAD,
      },
      cct: d.CCT,
    }));

    const IEMSInsertados = await IEMS.insertMany(restructuredData, {
      ordered: false,
    });

    res.status(201).json({
      status: "sucess",
      data: {
        IEMSInsertados,
        duplicados: [],
      },
    });
  } catch (error) {
    const duplicados = [];
    const IEMSInsertados = error.insertedDocs || [];

    if (error.writeErrors) {
      for (const e of error.writeErrors) {
        if (e.err.code === 11000) {
          duplicados.push({
            name: e.err.op.name,
            code: e.err.op.cct,
          });
        }
      }
    }

    res.status(201).json({
      status: "sucess",
      data: {
        IEMSInsertados,
        duplicados,
      },
    });
  }
  //2) Guardarlo en tempFiles/
  //3) Verificar contenido
  //4) Obtener contenido
  //5) Transction mongoose
  //6) Summary (cuantos ingresó y cuantos no)
  //7) Mandar respuesta
});
