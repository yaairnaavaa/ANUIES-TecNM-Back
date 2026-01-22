const mongoose = require("mongoose");

class IES_Service {
  constructor(IES_repository, carrerasRepository) {
    this.IES_repository = IES_repository;
    this.carrerasRepository = carrerasRepository;
  }

  async getAllIES(queryObject) {
    // // Si es Admin IES u Operativo, solo puede ver su IES
    // if (req.user && ["Admin IES", "Operativo IES"].includes(req.user.role)) {
    //   query = query.where("_id").equals(req.user.ies);
    // }

    return await this.IES_repository.getAllIES(queryObject);
  }

  async getCarrerasDeIES(id) {
    return await this.IES_repository.getCarrerasDeIES(id);
  }

  async actualizarCarreraDeIES(iesId, carreraNombre, data) {
    if (Object.keys(data).length === 1 && typeof data.active === "boolean") {
      const estado = data.active;
      return await this.deactivateCarreraDeIES(iesId, carreraNombre, estado);
    }

    // throw new Error(
    //   "No se pudo actualizar la carrera por el momento. Intenta mas tarde",
    // );
  }

  async deactivateCarreraDeIES(iesId, carreraNombre, estado) {
    const deactivatedCareer = await this.IES_repository.deactivateCarreraDeIES(
      iesId,
      carreraNombre,
      estado,
    );

    if (deactivatedCareer) return estado;

    await this.getIESById(iesId);

    await this.getCarreraByName(iesId, carreraNombre);

    throw new Error(
      "No se pudo desactivar la carrera por el momento. Intenta mas tarde",
    );
  }

  async agregarCarreraDeIES(iesId, dataCarrera) {
    const ies = await this.IES_repository.getIESById(iesId);

    if (!ies) throw new Error(`IES con el id ${iesId} no existe`);

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const createdCareer = await this.carrerasRepository.createCarrera(
        {
          ...dataCarrera,
          ies: {
            iesId,
            iesName: ies.name,
            iesShortname: ies.shortName,
          },
        },
        session,
      );

      const updatedIES = await this.IES_repository.addCarreraIES(
        iesId,
        createdCareer,
        session,
      );

      if (!updatedIES) throw new Error("Error al insertar carrera en IES");

      await session.commitTransaction();

      return updatedIES.careers;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getCarreraById(iesId, carreraId) {
    const carrera = await this.IES_repository.getCarreraById(iesId, carreraId);

    if (!carrera)
      throw new Error(
        `Carrera para la IES: ${iesId} con el id: ${carreraId} no existe`,
      );

    return carrera;
  }

  async getCarreraByName(iesId, carreraNombre) {
    const carrera = await this.IES_repository.getCarreraByName(
      iesId,
      carreraNombre,
    );

    if (!carrera)
      throw new Error(
        `Carrera con nombre ${carreraNombre} para la IES: ${iesId} no existe`,
      );

    return carrera;
  }

  async getIESById(id) {
    const ies = await this.IES_repository.getIESById(id);

    if (!ies) throw new Error(`IES con id: ${id} no existe`);

    // Verificar permisos
    // if (["Admin IES", "Operativo IES"].includes(req.user.role)) {
    //   if (req.user.ies.toString() !== ies._id.toString()) {
    //     throw new Error("No tienes permiso para ver esta IES");
    //   }
    // }

    return ies;
  }

  async createIES(data) {
    return await this.IES_repository.createIES(data);
  }

  async updateIES(id, data) {
    // // Verificar permisos
    // if (req.user.role === 'Admin IES') {
    //   if (req.user.ies.toString() !== ies._id.toString()) {
    //     return res.status(403).json({
    //       success: false,
    //       message: 'No tienes permiso para actualizar esta IES'
    //     });
    //   }

    //   // Admin IES no puede cambiar ciertos campos críticos
    //   delete req.body.code;
    //   delete req.body.active;
    // }

    const ies = await this.IES_repository.getIESById(id);

    if (!ies) throw new Error(`IES con id: ${id} no existe`);

    const updatedIES = await this.IES_repository.updateIES(id, data);

    if (!updatedIES)
      throw new Error("No se pudo actualizar el IES. Intenta mas tarde");

    return updatedIES;
  }

  async deactivateIES(id) {
    return await this.IES_repository.deactivateIES(id);
  }
}

module.exports = IES_Service;
