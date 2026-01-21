const Carrera = require("./carreras.model");

class CarrerasRepository {
  async getCarreras(queryObject) {
    return await Carrera.find();
  }

  async getCarreraById(id) {
    return await Carrera.findById(id);
  }

  async createCarrera(data, session) {
    const [carrera] = await Carrera.create([data], { session });
    return carrera;
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
