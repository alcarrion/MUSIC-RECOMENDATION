let Cancion = require('../models/cancion');

exports.obtenerCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.find();
    res.json(canciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las canciones.' });
  }
};


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
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar el comentario.' });
  }
};


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
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar la valoración.' });
  }
};


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
    console.error(error);
    res.status(500).json({ mensaje: 'Error al votar por la canción.' });
  }
};


exports.cancionAleatoria = async (req, res) => {
  try {
    const canciones = await Cancion.find();
    if (canciones.length === 0) {
      return res.status(404).json({ mensaje: 'No hay canciones disponibles.' });
    }

    const indiceAleatorio = Math.floor(Math.random() * canciones.length);
    res.json(canciones[indiceAleatorio]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener una canción aleatoria.' });
  }
};


exports.eliminarCancion = async (req, res) => {
  const { id } = req.params;

  try {
    const cancion = await Cancion.findByIdAndDelete(id);
    if (!cancion) {
      return res.status(404).json({ mensaje: 'Canción no encontrada.' });
    }

    res.status(200).json({ mensaje: 'Canción eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la canción.' });
  }
};
