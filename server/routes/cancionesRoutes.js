const express = require('express');
const {
  agregarCancion,
  obtenerCanciones,
  votarCancion,
  cancionAleatoria,
  agregarComentario,
  agregarValoracion,
  eliminarCancion,
} = require('../controllers/cancionController');

const router = express.Router();

router.post('/agregar', agregarCancion);
router.get('/', obtenerCanciones);
router.post('/:id/votar', votarCancion);
router.get('/aleatoria', cancionAleatoria);
router.post('/:id/comentarios', agregarComentario);
router.post('/:id/valoraciones', agregarValoracion);
router.delete('/:id', eliminarCancion); // Ruta para eliminar canción

module.exports = router;
