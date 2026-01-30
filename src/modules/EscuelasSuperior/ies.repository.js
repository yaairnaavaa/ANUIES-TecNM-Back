const IES = require("./IES.model");
const flatten = require("./../../../utils/flatten");

class IES_Repository {
  async getAllIES(queryObject, session) {
    // const { state, active } = queryObject || undefined;

    // const state = queryObject.state;
    // const active = queryObject.active;

    let query = IES.find(queryObject);
    // // Filtros opcionales
    // if (state) {
    //   query = query.where("address.state").equals(state);
    // }

    // if (active !== undefined) {
    //   query = query.where("active").equals(active === "true");
    // }

    //   // Si es Admin IES u Operativo, solo puede ver su IES
    //   if (req.user && ['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    //     query = query.where('_id').equals(req.user.ies);
    //   }

    return await query.sort({ name: 1 }, session);
  }

  async getCarrerasDeIES(id) {
    return await IES.findById(id).select("careers -_id");
  }

  async getCarreraById(iesId, carreraId) {
    return await IES.findOne({
      _id: iesId,
      "careers._id": `${carreraId}`,
    });
  }

  async updateCareerName(iesId, carreraId, name, session) {
    return await IES.findOneAndUpdate(
      {
        _id: iesId,
        "careers.carreraId": carreraId,
      },
      {
        $set: {
          "careers.$.carreraName": name,
        },
      },
      {
        new: true,
        session,
      },
    );
  }

  async addCarreraIES(iesId, carrera, session) {
    return await IES.findByIdAndUpdate(
      iesId,
      {
        $push: {
          careers: {
            carreraId: carrera._id,
            carreraName: carrera.name,
          },
        },
      },
      { session, new: true },
    );
  }

  async removeCarreraIES(iesId, carreraId, session) {
    return await IES.findByIdAndUpdate(
      iesId,
      {
        $pull: {
          careers: {
            carreraId: carreraId,
          },
        },
      },
      { session, new: true },
    );
  }

  async getCarreraByName(iesId, carreraNombre) {
    return await IES.findOne({
      _id: iesId,
      "careers.name": `${carreraNombre}`,
    });
  }

  async getIESById(id) {
    return await IES.findById(id);
  }

  async createIES(data) {
    return await IES.create(data);
  }

  async updateIES(id, data, session) {
    const updateObject = flatten(data);

    return await IES.findByIdAndUpdate(
      id,
      {
        $set: updateObject,
      },
      { session, new: true },
    );
  }

  async deactivateIES(id) {
    return await IES.findByIdAndUpdate(id, {
      active: false,
    });
  }

  async getHTMLpage(id) {
    return await IES.findOne(
      {
        _id: id,
      },
      { "branding.htmlPage": 1, _id: 0 },
    );
  }

  async addHTMLpage(id, data) {
    return await IES.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: { "branding.htmlPage": data },
      },
      { new: true },
    );
  }
}

module.exports = IES_Repository;
