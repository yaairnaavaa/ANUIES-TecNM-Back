const asyncHandler = require("./../../middleware/asyncHandler");

class CicloController {
  constructor(cicloService) {
    this.cicloService = cicloService;
  }

  getCiclos = asyncHandler(async (req, res) => {
    const queryObject = req.query;

    const ciclos = await this.cicloService.getCiclos(queryObject);

    res.status(200).json({
      status: "success",
      results: ciclos.length,
      data: ciclos,
    });
  });

  getCicloById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ciclo = await this.cicloService.getCicloById(id);

    res.status(200).json({
      status: "success",
      data: ciclo,
    });
  });

  createCiclo = asyncHandler(async (req, res) => {
    const data = req.body;

    const createdCiclo = await this.cicloService.createCiclo(data);

    res.status(201).json({
      status: "success",
      message: "Ciclo creado satisfactoriamente",
      data: createdCiclo,
    });
  });

  updateCiclo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const updatedCiclo = await this.cicloService.updateCiclo(id, data);
    res.status(200).json({
      status: "success",
      data: updatedCiclo,
    });
  });
}

module.exports = CicloController;
