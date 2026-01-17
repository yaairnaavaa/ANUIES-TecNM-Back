const IEMS_Repository = require("./src/modules/EscuelasMediaSuperior/iems.repository.js");
const IEMS_Service = require("./src/modules/EscuelasMediaSuperior/iems.service.js");
const IEMS_Controller = require("./src/modules/EscuelasMediaSuperior/iemsController.js");

// const FileHandler = require("./utils/fileHandler.js");
// exports.fileHandler = new FileHandler("tempFiles");

//repositories
const IEMS_repository = new IEMS_Repository();

//IEMS BOOTSTRAP
const IEMS_service = new IEMS_Service(IEMS_repository);
exports.IEMS_controller = new IEMS_Controller(IEMS_service);
