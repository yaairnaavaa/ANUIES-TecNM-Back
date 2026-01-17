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

  async getIESById(id) {
    return await this.IES_repository.findById(id);
  }

  async createIES(data) {
    return await this.IES_repository.create(data);
  }

  async updateIES(id, data) {
    return await this.IES_repository.updateIES(id, data);
  }

  async deactivateIES(id) {
    return await this.IES_repository.deactivateIES(id);
  }
}

module.exports = IES_Service;
