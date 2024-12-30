const express = require('express');
const mongoose = require('mongoose');
const cancionesRoutes = require('./routes/cancionesRoutes');
const cors = require('cors');
const path = require('path'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../client')));

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/musica', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


// Rutas
app.use('/api/canciones', cancionesRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });



// Puerto
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
