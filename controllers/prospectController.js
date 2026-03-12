const Prospect = require("../models/Prospect");
const asyncHandler = require("./../src/middleware/asyncHandler");
const { validateCURP } = require("./../utils/curpValidator");
const IES = require("./../src/modules/EscuelasSuperior/IES.model");
const Camp = require("./../src/modules/Campaigns/campaign.model");

const { scopeCampaignByUser } = require("./../src/policies/campaign.policies");

// @desc    Registrar nuevo interesado (público)
// @route   POST /api/prospects/register
// @access  Public
exports.registerProspect = asyncHandler(async (req, res) => {
  // Verificar si el email ya existe
  const existingProspect = await Prospect.findOne({ email: req.body.email });

  if (existingProspect) {
    return res.status(400).json({
      success: false,
      message: "El email ya está registrado",
    });
  }

  // Validar CURP si se proporciona
  if (req.body.curp && !validateCURP(req.body.curp)) {
    return res.status(400).json({
      success: false,
      message: "El formato de la CURP no es válido",
    });
  }

  const prospect = await Prospect.create(req.body);

  // Verificar si el registro está completo
  prospect.verifyRegistrationComplete();
  await prospect.save();

  res.status(201).json({
    success: true,
    message: "Registro exitoso. Por favor completa tu perfil para continuar.",
    data: {
      id: prospect._id,
      email: prospect.email,
      fullName: prospect.fullName,
      classification: prospect.classification,
      registrationComplete: prospect.processStatus.registrationComplete,
    },
  });
});

// @desc    Actualizar perfil de interesado
// @route   PUT /api/prospects/:id/profile
// @access  Public (con el ID del interesado)
exports.updateProspectProfile = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: "Interesado no encontrado",
    });
  }

  // const allowedFields = [
  //   "name",
  //   "fatherLastName",
  //   "motherLastName",
  //   "curp",
  //   "birthDate",
  //   "gender",
  //   "email",
  //   "phone.mobile",
  //   "address.street",
  //   "address.number",
  //   "address.neighborhood",
  //   "address.municipality",
  //   "address.state",
  //   "address.postalCode",
  //   "originIEMSName",
  //   "technicalMajor",
  //   "processStatus.lastInteraction",
  // ];

  // if (req.body.curp && !validateCURP(req.body.curp)) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "El formato de la CURP no es válido",
  //   });
  // }

  // const update = {};
  // for (const key in req.body) {
  //   if (allowedFields.includes(key)) {
  //     update[key] = req.body[key];
  //   }
  // }
  const data = req.body;

  if (data.observations) {
    await Prospect.findByIdAndUpdate(
      req.params.id,
      { observations: data.observations },
      {
        new: true,
      },
    );

    delete data.observations;
  }

  prospect.set(data);

  // prospect.processStatus.registrationComplete =
  //   prospect.verifyRegistrationComplete();

  await prospect.save();

  const originCampaign = prospect.originCampaign;

  let IESdelProspecto =
    await Camp.findById(originCampaign).select("ies.iesId -_id");

  IESdelProspecto = IESdelProspecto.ies.iesId;

  const IEShtml = await IES.findOne(IESdelProspecto).select(
    "branding.htmlPage -_id",
  );

  res.status(200).json({
    success: true,
    message: "Perfil actualizado correctamente",
    data: {
      page: IEShtml.branding?.htmlPage,
    },
  });
});

// @desc    Obtener todos los interesados
// @route   GET /api/prospects
// @access  Public (temporalmente para Vercel)
exports.getAllProspects = asyncHandler(async (req, res) => {
  const filters = {};
  let campaigns = [];

  // Filtrar por todas las campañas asociadas a la IES del usuario
  if (req.user && ["Admin IES", "Operativo IES"].includes(req.user.role.name)) {
    campaigns = await Camp.find(scopeCampaignByUser(req.user))
      .select("_id name type specificModality status cycle")
      .sort({ createdAt: -1 });

    filters.originCampaign = {
      $in: campaigns.map((campaign) => campaign._id),
    };
  }

  if (req.query.classification) {
    filters.classification = req.query.classification;
  }

  if (req.query.firstChoiceIES) {
    filters.firstChoiceIES = req.query.firstChoiceIES;
  }

  if (req.query.contactChannel) {
    filters.contactChannel = req.query.contactChannel;
  }

  if (req.query.active !== undefined) {
    filters.active = req.query.active === "true";
  }

  const prospects = await Prospect.find(filters)
    .populate("firstChoiceIES", "name code")
    .populate("originIEMS", "name code")
    .populate("originCampaign", "name type specificModality status cycle")
    // .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: -1 });

  const campaignsMap = new Map(
    campaigns.map((campaign) => [
      campaign._id.toString(),
      {
        id: campaign._id,
        nombre: campaign.name,
        tipo: campaign.type,
        modalidadEspecifica: campaign.specificModality,
        estatus: campaign.status,
        ciclo: campaign.cycle,
        prospectos: [],
      },
    ]),
  );

  prospects.forEach((prospect) => {
    if (!prospect.originCampaign) return;

    const campaignId = prospect.originCampaign._id.toString();

    if (!campaignsMap.has(campaignId)) {
      campaignsMap.set(campaignId, {
        id: prospect.originCampaign._id,
        nombre: prospect.originCampaign.name,
        tipo: prospect.originCampaign.type,
        modalidadEspecifica: prospect.originCampaign.specificModality,
        prospectos: [],
      });
    }

    campaignsMap.get(campaignId).prospectos.push(prospect);
  });

  res.status(200).json({
    success: true,
    count: prospects.length,
    data: prospects,
    campaigns: Array.from(campaignsMap.values()),
  });
});

// @desc    Obtener interesado por ID
// @route   GET /api/prospects/:id
// @access  Public (temporalmente para Vercel)
exports.getProspectById = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id)
    .populate("firstChoiceIES", "name code careers contact")
    .populate("originIEMS", "name code")
    .populate("originCampaign", "name type specificModality");
  // .populate('assignedTo', 'firstName lastName email phone');

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: "Interesado no encontrado",
    });
  }

  // Verificar permisos solo si está autenticado
  if (req.user && ["Admin IES", "Operativo IES"].includes(req.user.role.name)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este interesado",
      });
    }
  }

  res.status(200).json({
    success: true,
    data: prospect,
  });
});

// @desc    Asignar interesado a operativo
// @route   PUT /api/prospects/:id/assign
// @access  Private (Admin IES y Operativo IES)
exports.assignProspect = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: "Interesado no encontrado",
    });
  }

  // Verificar permisos
  if (["Admin IES", "Operativo IES"].includes(req.user.role.name)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para asignar este interesado",
      });
    }
  }

  // prospect.assignedTo = req.body.assignedTo || req.user.id;
  await prospect.save();

  res.status(200).json({
    success: true,
    message: "Interesado asignado correctamente",
    data: prospect,
  });
});

// @desc    Actualizar observaciones de interesado
// @route   PUT /api/prospects/:id/observations
// @access  Private (Admin IES y Operativo IES)
exports.updateObservations = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: "Interesado no encontrado",
    });
  }

  // Verificar permisos
  if (["Admin IES", "Operativo IES"].includes(req.user.role.name)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar este interesado",
      });
    }
  }

  prospect.observations = req.body.observations;
  await prospect.save();

  res.status(200).json({
    success: true,
    message: "Observaciones actualizadas",
    data: prospect,
  });
});

// @desc    Validar perfil de interesado
// @route   PUT /api/prospects/:id/validate
// @access  Private (Admin IES y Operativo IES)
exports.validateProspect = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    return res.status(404).json({
      success: false,
      message: "Interesado no encontrado",
    });
  }

  // Verificar permisos
  if (["Admin IES", "Operativo IES"].includes(req.user.role.name)) {
    if (req.user.ies.toString() !== prospect.firstChoiceIES.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para validar este interesado",
      });
    }
  }

  prospect.processStatus.profileValidated = true;
  prospect.promoteClassification();
  await prospect.save();

  res.status(200).json({
    success: true,
    message: "Perfil validado correctamente",
    data: {
      id: prospect._id,
      fullName: prospect.fullName,
      classification: prospect.classification,
      profileValidated: prospect.processStatus.profileValidated,
    },
  });
});
