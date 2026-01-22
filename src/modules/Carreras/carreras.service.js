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
    const carrera = await this.carrerasRepository.getCarreraById(idCarrera);

    if (!carrera) throw new Error(`Carrera con el id: ${idCarrera} no existe`);

    //comenzar transaccion
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      //actualizar carrera para traer todos sus datos
      const updatedCareer = await this.carrerasRepository.updateCarrera(
        idCarrera,
        data,
        session,
      );

      if (!updatedCareer)
        throw new Error(`Error al editar carrera con id:${idCarrera}`);

      if (data.name) {
        const IESconMateria = await this.iesRepository.getAllIES(
          {
            careers: { $elemMatch: { carreraId: carrera._id } },
          },
          session,
        );

        if (IESconMateria.length) {
          await Promise.all(
            IESconMateria.map((ies) =>
              this.iesRepository.updateCareerName(
                ies._id,
                idCarrera,
                updatedCareer.name,
                session,
              ),
            ),
          );
        }
      }

      await session.commitTransaction();

      return updatedCareer;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      await session.endSession();
    }
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
