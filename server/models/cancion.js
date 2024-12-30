const mongoose = require('mongoose');

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

module.exports = mongoose.model('Cancion', cancionSchema);
