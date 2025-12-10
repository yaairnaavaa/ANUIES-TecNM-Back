const express = require('express');
const router = express.Router();
const {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample
} = require('../controllers/exampleController');

// Rutas para ejemplos
router.route('/')
  .get(getAllExamples)
  .post(createExample);

router.route('/:id')
  .get(getExampleById)
  .put(updateExample)
  .delete(deleteExample);

module.exports = router;

