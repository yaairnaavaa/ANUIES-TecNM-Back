const Ciclo = require("./ciclo.model.js");

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

  async updateCiclo(id, data) {
    return await Ciclo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: false,
    });
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
