const mongoose = require("mongoose");

class CicloService {
  constructor(cicloRepository) {
    this.cicloRepository = cicloRepository;
  }

  async getCiclos(queryObject) {
    return await this.cicloRepository.getCiclos(queryObject);
  }

  async getCurrentCicleActive() {
    return await this.cicloRepository.getCurrentCicleActive();
  }

  async getCicloById(id) {
    const ciclo = await this.cicloRepository.getCicloById(id);

    if (!ciclo) throw new Error(`Ciclo con el id: ${id} no existe`);

    return ciclo;
  }

  async createCiclo(data) {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const createdCiclo = await this.cicloRepository.createCiclo(
        { ...data },
        session,
      );

      if (!createdCiclo) throw new Error("Error al crear ciclo");

      //solo si se especifica que está activo, cambiar las demás

      if (data.activo) {
        await this.cicloRepository.desactivarCiclosEnInsercionNuevoCiclo(
          createdCiclo._id,
          session,
        );
      }

      await session.commitTransaction();

      session.endSession();

      return createdCiclo;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  }

  async updateCiclo(id, data) {
    const ciclo = await this.cicloRepository.getCicloById(id);

    if (!ciclo) throw new Error(`Ciclo con el id ${id} no existe`);

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      if (data.active) {
        await this.cicloRepository.desactivarCiclosEnInsercionNuevoCiclo(
          ciclo._id,
          session,
        );
      }

      const updatedCiclo = await this.cicloRepository.updateCiclo(
        id,
        data,
        session,
      );

      if (!updatedCiclo) throw new Error("Error al actualizar ciclo");

      await session.commitTransaction();

      return updatedCiclo;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

module.exports = CicloService;
