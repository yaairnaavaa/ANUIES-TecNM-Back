const CampaignRepository = require("./src/modules/Campaigns/campaign.repository.js");
const CampaignController = require("./src/modules/Campaigns/campaignController.js");
const CampaignService = require("./src/modules/Campaigns/campaing.service.js");

const IEMS_Repository = require("./src/modules/EscuelasMediaSuperior/iems.repository.js");
const IEMS_Service = require("./src/modules/EscuelasMediaSuperior/iems.service.js");
const IEMS_Controller = require("./src/modules/EscuelasMediaSuperior/iemsController.js");

const IES_Repository = require("./src/modules/EscuelasSuperior/ies.repository.js");
const IES_Service = require("./src/modules/EscuelasSuperior/ies.service.js");
const IES_Controller = require("./src/modules/EscuelasSuperior/iesController.js");

const CicloService = require("./src/modules/Ciclos/ciclo.service.js");
const CicloRepository = require("./src/modules/Ciclos/ciclo.repository.js");
const CicloController = require("./src/modules/Ciclos/ciclo.controller.js");

const UserRepository = require("./src/modules/Users/user.repository.js");
const UserService = require("./src/modules/Users/user.service.js");
const UserController = require("./src/modules/Users/user.controller.js");

const CarrerasRepository = require("./src/modules/Carreras/carreras.repository.js");
const CarrerasService = require("./src/modules/Carreras/carreras.service.js");
const CarrerasController = require("./src/modules/Carreras/carreras.controller.js");

const NotificacionesService = require("./src/modules/Notificaciones/notificaciones.service.js");
const NotificacionesController = require("./src/modules/Notificaciones/notificaciones.controller.js");

// const FileHandler = require("./utils/fileHandler.js");
// exports.fileHandler = new FileHandler("tempFiles");

//repositories
const IEMS_repository = new IEMS_Repository();
const IES_repository = new IES_Repository();
const campaignRepository = new CampaignRepository();
const cicloRepository = new CicloRepository();
const userRepository = new UserRepository();
const carrerasRepository = new CarrerasRepository();

//IEMS BOOTSTRAP
const IEMS_service = new IEMS_Service(IEMS_repository);
exports.IEMS_controller = new IEMS_Controller(IEMS_service);

//IES BOOTRSTRAP
const IES_service = new IES_Service(IES_repository, carrerasRepository);
exports.IES_controller = new IES_Controller(IES_service);

//CAMPAINGS BOOTRAP
const campaignService = new CampaignService(
  campaignRepository,
  cicloRepository,
  IES_repository,
  IEMS_repository,
);
exports.campaignController = new CampaignController(campaignService);

//CICLOS BOOTRSTARP
const cicloService = new CicloService(cicloRepository);
exports.cicloController = new CicloController(cicloService);

//USERS BOOTSTRAP
const userService = new UserService(userRepository);
exports.userController = new UserController(userService);

//CARRERAS BOOTRSRAP
const carrerasServices = new CarrerasService(
  carrerasRepository,
  IES_repository,
);
exports.carrerasController = new CarrerasController(carrerasServices);

//NOTIFICATION BOOTRSRAP
const notificationService = new NotificacionesService();
exports.notificacionesController = new NotificacionesController(notificationService);
