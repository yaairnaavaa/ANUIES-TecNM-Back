const Carrera = require("./carreras.model");

class CarrerasRepository {
  async getCarreras(queryObject) {
    return await Carrera.find();
  }

  async getCarreraById(id) {
    return await Carrera.findById(id);
  }

  async createCarrera(data) {
    return await Carrera.create(data);
  }

  async deactivateCarreraById(id) {
    return await Carrera.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );
  }
}

module.exports = CarrerasRepository;
