const mongoose = require('mongoose');

// Definición del esquema de la canción
const cancionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  artista: { type: String, required: true },
  urlYoutube: { type: String, required: true },
  votos: { type: Number, default: 0 },
  comentarios: [
    {
      texto: { type: String, required: true },
      fecha: { type: Date, default: Date.now },
    },
  ],
  valoraciones: { type: [Number], default: [] }, // Para las estrellas
});

const Cancion = mongoose.model('Cancion', cancionSchema); // Modelo de canción

// Obtener todas las canciones
exports.obtenerCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.find();
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las canciones.', error });
  }
};

// Agregar un comentario
exports.agregarComentario = async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ mensaje: 'El comentario no puede estar vacío.' });
  }

  try {
    const cancion = await Cancion.findById(id);
    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada.' });
    }

    cancion.comentarios.push({ texto });
    await cancion.save();

    res.status(201).json(cancion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar el comentario.', error });
  }
};

// Agregar valoración
exports.agregarValoracion = async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;

  if (valor < 1 || valor > 5) {
    return res.status(400).json({ mensaje: 'La valoración debe estar entre 1 y 5 estrellas.' });
  }

  try {
    const cancion = await Cancion.findById(id);
    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada.' });
    }

    cancion.valoraciones.push(valor);
    await cancion.save();

    res.status(200).json(cancion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar la valoración.', error });
  }
};

// Agregar una nueva canción
exports.agregarCancion = async (req, res) => {
  const { nombre, artista, urlYoutube } = req.body;

  try {
    const nuevaCancion = new Cancion({ nombre, artista, urlYoutube });
    const cancionGuardada = await nuevaCancion.save();
    res.status(201).json(cancionGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar la canción.', error });
  }
};

// Votar por una canción
exports.votarCancion = async (req, res) => {
  const { id } = req.params;

  try {
    const cancion = await Cancion.findById(id);
    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada.' });
    }

    cancion.votos += 1;
    await cancion.save();
    res.status(200).json(cancion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al votar por la canción.', error });
  }
};

// Obtener una canción aleatoria
exports.cancionAleatoria = async (req, res) => {
  try {
    const canciones = await Cancion.find();
    if (canciones.length === 0) {
      return res.status(404).json({ mensaje: 'No hay canciones disponibles.' });
    }

    const indiceAleatorio = Math.floor(Math.random() * canciones.length);
    res.json(canciones[indiceAleatorio]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener una canción aleatoria.', error });
  }
};

// Eliminar una canción
exports.eliminarCancion = async (req, res) => {
  const { id } = req.params;

  try {
    const cancion = await Cancion.findByIdAndDelete(id);
    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada.' });
    }

    res.status(200).json({ mensaje: 'Canción eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la canción.', error });
  }
};
