const IEMS = require("./IEMS.model");
const flatten = require("./../../../utils/flatten");

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
    const updateObject = flatten(data);

    return await IEMS.findByIdAndUpdate(id, updateObject, { new: true });
  }

  async deactivateIEMS(id) {
    return await IEMS.findByIdAndUpdate(id, {
      active: false,
    });
  }

  async bulkInsertExcelIEMS(data) {
    
    let IEMSInsertados = [];
    let IEMSDuplicados = [];
    try {
      IEMSInsertados = await IEMS.insertMany(data, {
        ordered: false,
      });
    } catch (error) {
      IEMSInsertados = error.insertedDocs || [];

      if (error.writeErrors) {
        for (const e of error.writeErrors) {
          if (e.err.code === 11000) {
            IEMSDuplicados.push({
              name: e.err.op.name,
              code: e.err.op.cct,
            });
          }
        }
      }
    } finally {
      return {
        IEMSInsertados,
        IEMSDuplicados,
      };
    }
  }
}

module.exports = IEMS_Repository;
