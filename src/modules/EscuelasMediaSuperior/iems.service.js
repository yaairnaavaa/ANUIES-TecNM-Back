class IEMS_Service {
  constructor(IEMS_repository) {
    this.IEMS_repository = IEMS_repository;
  }

  async getAllIEMS(queryObject) {
    return await this.IEMS_repository.getAllIEMS(queryObject);
  }

  async getIEMSById(id) {
    const iem = await this.IEMS_repository.getIEMSById(id);

    if (!iem) throw new Error("IEM no encontrado");

    return iem;
  }

  async createIEMS(data) {
    return await this.IEMS_repository.createIEMS(data);
  }

  async updateIEMS(id, data) {
    const updatedIEMS = await this.IEMS_repository.updateIEMS(id, data);

    if (updatedIEMS) {
      return updatedIEMS;
    }

    const IEMS_exists = await this.IEMS_repository.getIEMSById(id);

    if (!IEMS_exists) throw new Error(`IEMS with id: ${id} does not exists! `);

    throw new Error("Error updating. Please try again later");
  }

  async deactivateIEMS(id) {
    const deactivatedIEMS = await this.IEMS_repository.deactivateIEMS(id);

    if (deactivatedIEMS) return deactivatedIEMS;

    const existsIEMS = await this.IEMS_repository.getIEMSById(id);

    if (!existsIEMS) throw new Error(`IEMS con id: ${id} no encontrado`);

    throw new Error("Error al desactivar. Intenta mas tarde");
  }

  // async bulkInsertExcelIEMS(iems) {
  //   return await this.IEMS_repository.bulkInsertExcelIEMS(iems);
  // }
}

module.exports = IEMS_Service;
