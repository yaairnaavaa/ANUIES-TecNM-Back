class CarrerasService {
  constructor(carrerasRepository) {
    this.carrerasRepository = carrerasRepository;
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

  async deactivateCarreraById(id) {
    const deactivatedCarrera =
      await this.carrerasRepository.deactivateCarreraById(id);

    if (!deactivatedCarrera)
      throw new Error(`Error al desactivar carrera con id: ${id}`);

    return deactivatedCarrera;
  }
}

module.exports = CarrerasService;
