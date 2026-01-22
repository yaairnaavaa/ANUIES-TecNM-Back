const mongoose = require("mongoose");

class CarrerasService {
  constructor(carrerasRepository, iesRepository) {
    this.carrerasRepository = carrerasRepository;
    this.iesRepository = iesRepository;
  }

  async getCarreras(queryObject) {
    return await this.carrerasRepository.getCarreras(queryObject);
  }

  async getCarreraById(id) {
    const carrera = await this.carrerasRepository.getCarreraById(id);

    if (!carrera) throw new Error(`Carrera con el id: ${id} no existe`);

    return carrera;
  }

  async createCarrera(data) {
    const createdCarrera = await this.carrerasRepository.createCarrera(data);

    if (!createdCarrera)
      throw new Error(`Error al crear Carrera. Intenta mas tarde `);

    return createdCarrera;
  }

  async updateCarrera(idCarrera, data) {
    const carrera = this.carrerasRepository.getCarreraById(idCarrera);

    if (!carrera) throw new Error(`Carrera con el id: ${id} no existe`);
  }

  async deactivateCarreraById(id) {
    const deactivatedCarrera =
      await this.carrerasRepository.deactivateCarreraById(id);

    if (!deactivatedCarrera)
      throw new Error(`Error al desactivar carrera con id: ${id}`);

    //comenzar transaccion
    const session = await mongoose.startSession();

    //actualizar carrera para traer todos sus datos

    //buscar y actualizar en todas las ies que hay esa carrera

    return deactivatedCarrera;
  }
}

module.exports = CarrerasService;
