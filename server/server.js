let express = require('express');
let mongoose = require('mongoose');
let cancionesRoutes = require('./routes/cancionesRoutes');
let cors = require('cors');
let path = require('path');

let app = express();
let port = 3000;


async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/musica', {
    });
    console.log('Conectado exitosamente a MongoDB');
  } catch (err) {
    console.error('Error en la conexión a la base de datos:', err);
    process.exit(1); 
  }
}


connectDB();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client'))); // Servir archivos estáticos del cliente


app.use('/api/canciones', cancionesRoutes);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(`Server is up http://localhost:${port}`);
});

