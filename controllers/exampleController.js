const Example = require('../models/Example');

// @desc    Obtener todos los ejemplos
// @route   GET /api/examples
// @access  Public
const getAllExamples = async (req, res) => {
  try {
    const examples = await Example.find();
    
    res.status(200).json({
      success: true,
      count: examples.length,
      data: examples
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los ejemplos',
      error: error.message
    });
  }
};

// @desc    Obtener un ejemplo por ID
// @route   GET /api/examples/:id
// @access  Public
const getExampleById = async (req, res) => {
  try {
    const example = await Example.findById(req.params.id);
    
    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Ejemplo no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: example
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el ejemplo',
      error: error.message
    });
  }
};

// @desc    Crear un nuevo ejemplo
// @route   POST /api/examples
// @access  Public
const createExample = async (req, res) => {
  try {
    const example = await Example.create(req.body);
    
    res.status(201).json({
      success: true,
      data: example
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el ejemplo',
      error: error.message
    });
  }
};

// @desc    Actualizar un ejemplo
// @route   PUT /api/examples/:id
// @access  Public
const updateExample = async (req, res) => {
  try {
    const example = await Example.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Ejemplo no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: example
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el ejemplo',
      error: error.message
    });
  }
};

// @desc    Eliminar un ejemplo
// @route   DELETE /api/examples/:id
// @access  Public
const deleteExample = async (req, res) => {
  try {
    const example = await Example.findByIdAndDelete(req.params.id);
    
    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Ejemplo no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Ejemplo eliminado exitosamente',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el ejemplo',
      error: error.message
    });
  }
};

module.exports = {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample
};

