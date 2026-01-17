const IEMS = require("./IEMS.model");

class IEMS_Repository {
  async getAllIEMS(queryObject) {
    const { state, municipality, type, active } = queryObject || null;

    let query = IEMS.find();

    // Filtros opcionales
    if (state) {
      query = query.where("address.state").equals(state);
    }

    if (municipality) {
      query = query
        .where("address.municipality")
        .regex(new RegExp(municipality, "i"));
    }

    if (type) {
      query = query.where("type").equals(type);
    }

    if (active !== undefined) {
      query = query.where("active").equals(active === "true");
    }

    return await query.sort({ name: 1 });
  }

  async getIEMSById(id) {
    return await IEMS.findById(id).populate(
      "linkage.directPassAgreements.ies",
      "name code",
    );
  }

  async createIEMS(data) {
    return await IEMS.create(data);
  }

  async updateIEMS(id, data) {
    return await IEMS.findByIdAndUpdate(id, data, { new: true });
  }

  async deactivateIEMS(id) {
    return await IEMS.findByIdAndUpdate(id, {
      active: false,
    });
  }
}

module.exports = IEMS_Repository;
