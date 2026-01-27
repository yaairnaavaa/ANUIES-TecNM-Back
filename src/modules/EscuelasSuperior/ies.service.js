const mongoose = require("mongoose");
const {
  scopeIESbyUser,
  haveAccessToIES,
  parseEditableFieldsForAdminIes,
} = require("./../../policies/ies.policies");

class IES_Service {
  constructor(IES_repository, carrerasRepository) {
    this.IES_repository = IES_repository;
    this.carrerasRepository = carrerasRepository;
  }

  async getAllIES(user, queryObject) {
    const queryScope = scopeIESbyUser(user);

    return await this.IES_repository.getAllIES(queryScope);
  }

  async getCarrerasDeIES(user, id) {
    if (!haveAccessToIES(user, id))
      throw new Error(`No tienes acceso a esta ies`);

    const ies = await this.IES_repository.getIESById(id);

    if (!ies) throw new Error(`IES con el id: ${id} no existe`);

    const carrerasSnapshot = await this.IES_repository.getCarrerasDeIES(id);

    const ids = carrerasSnapshot.careers.map((c) => c.carreraId);

    return await this.carrerasRepository.getCarreras({ _id: { $in: ids } });
  }

  async agregarCarreraDeIES(user, iesId, dataCarrera) {
    if (!haveAccessToIES(user, iesId))
      throw new Error(`No tienes acceso a esta ies`);

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

  async getIESById(user, id) {
    if (!haveAccessToIES(user, id))
      throw new Error(`No tienes acceso a esta ies`);

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

  async updateIES(user, id, data) {
    if (!haveAccessToIES(user, id))
      throw new Error(`No tienes acceso a esta ies`);

    const ies = await this.IES_repository.getIESById(id);

    if (!ies) throw new Error(`IES con id: ${id} no existe`);

    const parsedData = parseEditableFieldsForAdminIes(user, data);

    const updatedIES = await this.IES_repository.updateIES(id, parsedData);

    if (!updatedIES)
      throw new Error("No se pudo actualizar el IES. Intenta mas tarde");

    return updatedIES;
  }

  async deactivateIES(id) {
    return await this.IES_repository.deactivateIES(id);
  }
}

module.exports = IES_Service;
