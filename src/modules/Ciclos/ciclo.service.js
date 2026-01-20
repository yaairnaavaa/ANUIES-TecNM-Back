const mongoose = require("mongoose");

class CicloService {
  constructor(cicloRepository) {
    this.cicloRepository = cicloRepository;
  }

  async getCiclos(queryObject) {
    return await this.cicloRepository.getCiclos(queryObject);
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
        { ...data, active: true },
        session,
      );

      if (!createdCiclo) throw new Error("Error al crear ciclo");

      await this.cicloRepository.desactivarCiclosEnInsercionNuevoCiclo(
        createdCiclo._id,
        session,
      );

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
    const updatedCiclo = await this.cicloRepository.updateCiclo(id, data);

    if (!updatedCiclo) throw new Error("Error al actualizar ciclo");

    return updatedCiclo;
  }
}

module.exports = CicloService;
