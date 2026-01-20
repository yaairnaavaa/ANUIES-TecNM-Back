class IES_Service {
  constructor(IES_repository) {
    this.IES_repository = IES_repository;
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

    // // console.log(Object.keys(data));
    // // console.log(Object.entries(data));

    // const keys = Object.keys(data);

    // let keyObjects;

    // // keys.forEach((key) => {
    // //   //  console.log(data[key])
    // // });

    // Object.entries(data).forEach((entrie) => {
    //   console.log(entrie);
    // });

    // console.log(keyObjects);

    // Object.keys()
    // const updatedIes = await this.IES_repository.updateIES(id, data);

    // if (updatedIes) return updatedIes;

    // const iesExists = await this.IES_repository.getIESById(id);

    // if (!iesExists) throw new Error(`IES con id: ${id} no existe`);

    throw new Error("No se pudo actualizar el IES. Intenta mas tarde");
  }

  async deactivateIES(id) {
    return await this.IES_repository.deactivateIES(id);
  }
}

module.exports = IES_Service;
