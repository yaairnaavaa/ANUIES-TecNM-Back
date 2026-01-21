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

    //   // Si es Admin IES u Operativo, solo puede ver su IES
    //   if (req.user && ['Admin IES', 'Operativo IES'].includes(req.user.role)) {
    //     query = query.where('_id').equals(req.user.ies);
    //   }

    return await query.sort({ name: 1 });
  }

  async getCarrerasDeIES(id) {
    return await IES.findById(id).select("careers -_id");
  }

  async deactivateCarreraDeIES(iesId, carreraNombre, estado) {
    return await IES.findOneAndUpdate(
      {
        _id: iesId,
        "careers.name": `${carreraNombre}`,
      },
      {
        $set: {
          "careers.$.active": estado,
        },
      },
      {
        new: true,
        runValidators: false,
      },
    );
  }

  async getCarreraById(iesId, carreraId) {
    return await IES.findOne({
      _id: iesId,
      "careers._id": `${carreraId}`,
    });
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
