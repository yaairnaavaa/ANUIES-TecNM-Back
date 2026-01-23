const Carrera = require("./carreras.model");
const flatten = require("./../../../utils/flatten");

class CarrerasRepository {
  async getCarreras(queryObject) {
    return await Carrera.find(queryObject).select('-__v');
  }

  async getCarreraById(id) {
    return await Carrera.findById(id);
  }

  async createCarrera(data, session) {
    const [carrera] = await Carrera.create([data], { session });
    return carrera;
  }

  async updateCarrera(idCarrera, data, session) {
    const updateObject = flatten(data);

    return Carrera.findByIdAndUpdate(
      idCarrera,
      {
        $set: updateObject,
      },
      { session, new: true },
    );
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
