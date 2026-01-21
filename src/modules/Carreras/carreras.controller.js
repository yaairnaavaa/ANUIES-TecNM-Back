const asyncHandler = require("./../../middleware/asyncHandler");

class CarrerasController {
  constructor(carrerasService) {
    this.carrerasService = carrerasService;
  }

  getCarreras = asyncHandler(async (req, res) => {
    const queryObject = req.query;

    const carreras = await this.carrerasService.getCarreras(queryObject);

    res.status(200).json({
      status: "success",
      results: carreras.length,
      data: carreras,
    });
  });

  async getCarreraById(id) {
    const { id } = req.params;

    const carrera = await this.carrerasService.getCarreraById(id);

    res.status(200).json({
      status: "success",
      data: carrera,
    });
  }

  async createCarrera(data) {
    const data = req.body;

    const createdCarrera = await this.carrerasService.createCarrera(data);

    res.status(201).json({
      status: "success",
      data: createdCarrera,
    });
  }

  async deactivateCarreraById(id) {
    const { id } = req.params;

    const deactivatedCarrera =
      await this.carrerasService.deactivateCarreraById(id);

    res.status(200).json({
      status: "success",
      message: `Carrera: {${deactivatedCarrera.name}} con el id: ${id} desactivada correctamente`,
    });
  }
}

module.exports = CarrerasController;
