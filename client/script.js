
const API_URL = 'http://localhost:3000/api/canciones';

// Referencias a elementos del DOM
const formAgregar = document.getElementById('form-agregar-cancion');
const listaCanciones = document.getElementById('lista-canciones');
const btnAleatoria = document.getElementById('btn-aleatoria');
const cancionAleatoria = document.getElementById('cancion-aleatoria');

// Validar si una URL es válida de YouTube
const esURLValidaYoutube = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
};

// Función para mostrar mensajes de error
const mostrarError = (mensaje) => {
  alert(mensaje);
};

// Función para agregar una nueva canción
formAgregar.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const artista = document.getElementById('artista').value.trim();
  const urlYoutube = document.getElementById('urlYoutube').value.trim();

  // Validaciones
  if (!nombre || !artista || !urlYoutube) {
    mostrarError('Por favor, completa todos los campos.');
    return;
  }

  if (!esURLValidaYoutube(urlYoutube)) {
    mostrarError('Por favor, proporciona una URL válida de YouTube.');
    return;
  }

  // Enviar datos al servidor
  try {
    const response = await fetch(`${API_URL}/agregar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, artista, urlYoutube }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || 'Error al agregar la canción.');
    }

    alert('Canción agregada exitosamente.');
    formAgregar.reset();
    obtenerCanciones(); // Actualizar la lista de canciones
  } catch (error) {
    mostrarError(error.message);
  }
});

// Obtener todas las canciones y mostrarlas
const obtenerCanciones = async () => {
  try {
    const response = await fetch(API_URL);
    const canciones = await response.json();

    listaCanciones.innerHTML = '';
    canciones.forEach((cancion) => {
      const div = document.createElement('div');
      div.classList.add('cancion');
      div.innerHTML = `
        <div class="card">
          <h3 class="song-title">${cancion.nombre} - ${cancion.artista}</h3>
          <div class="song-actions">
            <button data-id="${cancion._id}" class="btn-votar btn-primary">
              <i class="fas fa-heart"></i> Votar
            </button>
            <span class="votos">Votos: ${cancion.votos || 0}</span>
            <a href="${cancion.urlYoutube}" target="_blank" class="btn-ver btn-danger">
              <i class="fab fa-youtube"></i> Ver
            </a>
            <button data-id="${cancion._id}" class="btn-eliminar btn-secondary">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;

      // Agregar secciones de comentarios y valoraciones
      div.appendChild(renderComentarios(cancion.comentarios, cancion._id));
      div.appendChild(renderEstrellas(cancion._id, cancion.valoracionPromedio || 0));

      listaCanciones.appendChild(div);
    });

    // Asignar eventos a los botones de votar y eliminar
    document.querySelectorAll('.btn-votar').forEach((button) => {
      button.addEventListener('click', () => votarCancion(button.dataset.id));
    });

    document.querySelectorAll('.btn-eliminar').forEach((button) => {
      button.addEventListener('click', () => eliminarCancion(button.dataset.id));
    });
  } catch (error) {
    mostrarError('Error al obtener las canciones.');
  }
};


// Votar por una canción
const votarCancion = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/votar`, { method: 'POST' });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || 'Error al votar por la canción.');
    }

    obtenerCanciones(); // Actualizar la lista de canciones
  } catch (error) {
    mostrarError(error.message);
  }
};

// Eliminar una canción
const eliminarCancion = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta canción?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || 'Error al eliminar la canción.');
    }

    obtenerCanciones(); // Actualizar la lista de canciones
  } catch (error) {
    mostrarError(error.message);
  }
};

// Obtener una canción aleatoria
btnAleatoria.addEventListener('click', async () => {
  try {
    const response = await fetch(`${API_URL}/aleatoria`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || 'Error al obtener la canción aleatoria.');
    }

    const cancion = await response.json();
    cancionAleatoria.innerHTML = `
      <p><strong>${cancion.nombre}</strong> - ${cancion.artista}</p>
      <a href="${cancion.urlYoutube}" target="_blank">
      <i class="fab fa-youtube"></i> Ver</a>
    `;
  } catch (error) {
    mostrarError(error.message);
  }
});

// Función para agregar un comentario
const agregarComentario = async (id, texto) => {
  try {
    const response = await fetch(`${API_URL}/${id}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || 'Error al agregar el comentario.');
    }

    obtenerCanciones(); // Refresca la lista de canciones
  } catch (error) {
    alert(error.message);
  }
};

// Añadir un formulario para comentarios
const renderComentarios = (comentarios, id) => {
  const comentariosDiv = document.createElement('div');
  comentariosDiv.className = 'comentarios';

  // Título de la sección de comentarios con icono
  const comentariosTitulo = document.createElement('div'); // Usamos un div para el flexbox
  comentariosTitulo.className = 'comentarios-titulo'; // Clase para estilos
  comentariosTitulo.innerHTML = `<h4><i class="fas fa-comments"></i> Comentarios</h4>`; // Icono y título
  comentariosDiv.appendChild(comentariosTitulo);

  if (comentarios && comentarios.length > 0) { // Comprobar si hay comentarios
      comentarios.forEach((comentario) => {
          const comentarioDiv = document.createElement('div'); // Div para cada comentario
          comentarioDiv.className = 'comentario-individual';
          comentarioDiv.innerHTML = `<p><i class="fa fa-comment"></i> ${comentario.texto}</p>`; // Icono de respuesta
          comentariosDiv.appendChild(comentarioDiv);
      });
  } else {
      const sinComentarios = document.createElement('p');
      sinComentarios.textContent = 'Aún no hay comentarios. ¡Sé el primero!';
      comentariosDiv.appendChild(sinComentarios);
  }

  const formulario = document.createElement('form');
  formulario.className = 'comentario-form'; // Clase para estilos
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Escribe un comentario...';
  input.className = 'comentario-input'; // Clase para estilos

  const boton = document.createElement('button');
  boton.textContent = 'Enviar';
  boton.className = 'comentario-boton'; // Clase para estilos

  formulario.appendChild(input);
  formulario.appendChild(boton);

  formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim() !== "") { // Evitar comentarios vacíos
          agregarComentario(id, input.value);
          input.value = '';
      } else {
          alert("Por favor, escribe un comentario antes de enviar.");
      }
  });

  comentariosDiv.appendChild(formulario);

  return comentariosDiv;
};

// Función para agregar una valoración
const agregarValoracion = async (id, valor) => {
  try {
    const response = await fetch(`${API_URL}/${id}/valoraciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || 'Error al agregar valoración.');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Añadir la sección de valoraciones
const renderEstrellas = (id, valoracionActual) => {
  const estrellasDiv = document.createElement('div');
  estrellasDiv.className = 'rating';

  const ratingContainer = document.createElement('div');
  ratingContainer.style.display = 'flex';
  ratingContainer.style.alignItems = 'center';

  const valorSpan = document.createElement('span');
  valorSpan.className = 'rating-value';
  valorSpan.textContent = valoracionActual ? `${valoracionActual.toFixed(1)}/5` : '';

  const estrellas = [];

  [1, 2, 3, 4, 5].forEach((estrella) => {
    const estrellaSpan = document.createElement('span');
    estrellaSpan.textContent = '★';
    estrellas.push(estrellaSpan);

    if (estrella <= valoracionActual) {
      estrellaSpan.classList.add('active');
    }

    // Efecto hover
    estrellaSpan.addEventListener('mouseover', () => {
      estrellas.forEach((e, index) => {
        if (index < estrella) {
          e.classList.add('hover');
        }
      });
    });

    estrellaSpan.addEventListener('mouseout', () => {
      estrellas.forEach(e => {
        e.classList.remove('hover');
      });
    });

    estrellaSpan.addEventListener('click', async () => {
      try {
        await agregarValoracion(id, estrella);
        estrellas.forEach((e, index) => {
          if (index < estrella) {
            e.classList.add('active');
          } else {
            e.classList.remove('active');
          }
        });
        valorSpan.textContent = `${estrella}/5`;
        
        // Añadir un pequeño efecto de confirmación
        estrellaSpan.style.transform = 'scale(1.2)';
        setTimeout(() => {
          estrellaSpan.style.transform = '';
        }, 200);
      } catch (error) {
        mostrarError('Error al valorar');
      }
    });

    estrellasDiv.appendChild(estrellaSpan);
  });

  ratingContainer.appendChild(estrellasDiv);
  ratingContainer.appendChild(valorSpan);

  return ratingContainer;
};
// Inicializar
obtenerCanciones();
