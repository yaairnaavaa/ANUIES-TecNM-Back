const path = require("path");
const fs = require("fs");
const multer = require("multer");
const csv = require("csvtojson");

class FileHandler {
  constructor(rutaRelativaDesdeRoot) {
    this.rutaAbsoluta = path.resolve(process.cwd(), rutaRelativaDesdeRoot);

    if (!fs.existsSync(this.rutaAbsoluta)) {
      throw new Error(`Directorio de subida no existe: ${this.rutaAbsoluta}`);
    }

    this.upload = multer({
      storage: this.#generateStorageOption(this.rutaAbsoluta),
    });
  }

  #generateStorageOption(ruta) {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, ruta);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    return storage;
  }

  async CSVtoJson(rutaArchivo) {
    const json = await csv().fromFile(rutaArchivo);
    console.log(json)
    return json;
  }
}

module.exports = FileHandler;
