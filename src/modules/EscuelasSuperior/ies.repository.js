const IES = require("./IES.model");

class IES_Repository {
  async getAllIES(queryObject) {
    // const { state, active } = queryObject || undefined;

    // const state = queryObject.state;
    // const active = queryObject.active;

    let query = IES.find();
    // // Filtros opcionales
    // if (state) {
    //   query = query.where("address.state").equals(state);
    // }

    // if (active !== undefined) {
    //   query = query.where("active").equals(active === "true");
    // }

    return await query.sort({ name: 1 });
  }

  async getIESById(id) {
    return await IES.findById(id).populate(
      "linkage.directPassAgreements.ies",
      "name code",
    );
  }

  async createIES(data) {
    return await IES.create(data);
  }

  async updateIES(id, data) {
    return await IES.findByIdAndUpdate(id, data, { new: true });
  }

  async deactivateIES(id) {
    return await IES.findByIdAndUpdate(id, {
      active: false,
    });
  }
}

module.exports = IES_Repository;
