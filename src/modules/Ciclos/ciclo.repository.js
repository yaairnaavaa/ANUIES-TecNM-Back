const Ciclo = require("./ciclo.model.js");
const flatten = require("./../../../utils/flatten.js");

class CicloRepository {
  async getCiclos(queryObject) {
    // const query = Ciclo.find();

    // return query.find(qu)
    return await Ciclo.find();
  }

  async getCicloById(id) {
    return await Ciclo.findById(id);
  }

  async createCiclo(data, session) {
    const [ciclo] = await Ciclo.create([data], { session });
    return ciclo;
  }

  async updateCiclo(id, data, session) {
    const updateObject = flatten(data);

    return await Ciclo.findByIdAndUpdate(
      id,
      {
        $set: updateObject,
      },
      {
        session,
        new: true,
        runValidators: false,
      },
    );
  }

  async getCurrentCicleActive() {
    return await Ciclo.findOne({ active: true });
  }

  async desactivarCiclosEnInsercionNuevoCiclo(idCicloNuevo, session) {
    return await Ciclo.updateMany(
      {
        _id: { $ne: idCicloNuevo },
      },
      {
        active: false,
      },
      { session, new: true },
    );
  }
}

module.exports = CicloRepository;
