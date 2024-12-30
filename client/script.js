// URL base del servidor
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

// Agregar una nueva canción
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
      div.classList.add('cancion-card');
      div.innerHTML = `
        <div class="cancion-header">
          <h3><strong>${cancion.nombre}</strong> - ${cancion.artista}</h3>
          <div class="acciones">
            <div class="votos-contador">
              <i class="fas fa-thumbs-up"></i>
              <span>${cancion.votos}</span>
            </div>
            <button data-id="${cancion._id}" class="btn-accion btn-votar">
              <i class="fas fa-heart"></i>
              Votar
            </button>
            <a href="${cancion.urlYoutube}" target="_blank" class="btn-accion btn-youtube">
              <i class="fab fa-youtube"></i>
              Ver
            </a>
            <button data-id="${cancion._id}" class="btn-accion btn-eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="rating-section">
          ${renderEstrellas(cancion._id, cancion.valoracionPromedio || 0).outerHTML}
        </div>
        <div class="comentarios">
          <h4><i class="fas fa-comments"></i> Comentarios</h4>
          ${renderComentarios(cancion.comentarios, cancion._id).outerHTML}
        </div>
      `;

      listaCanciones.appendChild(div);
    });

    // Asignar eventos
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
      <a href="${cancion.urlYoutube}" target="_blank">Ver en YouTube</a>
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
const renderComentarios = (comentarios = [], id) => {
  const comentariosDiv = document.createElement('div');
  comentariosDiv.className = 'comentarios-container';

  comentarios.forEach((comentario) => {
    const comentarioP = document.createElement('p');
    comentarioP.innerHTML = `<i class="fas fa-comment"></i> ${comentario.texto}`;
    comentariosDiv.appendChild(comentarioP);
  });

  const formulario = document.createElement('form');
  formulario.className = 'comentario-form';
  formulario.innerHTML = `
    <input type="text" class="comentario-input" placeholder="Escribe un comentario..." required>
    <button type="submit" class="btn-accion btn-enviar">
      <i class="fas fa-paper-plane"></i>
      Enviar
    </button>
  `;

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = formulario.querySelector('input');
    agregarComentario(id, input.value);
    input.value = '';
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

  [1, 2, 3, 4, 5].forEach((estrella) => {
    const estrellaSpan = document.createElement('span');
    estrellaSpan.textContent = '★';
    estrellaSpan.style.cursor = 'pointer';

    if (estrella <= valoracionActual) {
      estrellaSpan.classList.add('active');
    }

    estrellaSpan.addEventListener('mouseover', () => {
      estrellasDiv.querySelectorAll('span').forEach((nodo, index) => {
        nodo.style.color = index < estrella ? '#FFD700' : 'gray';
      });
    });

    estrellaSpan.addEventListener('mouseout', () => {
      estrellasDiv.querySelectorAll('span').forEach((nodo, index) => {
        nodo.style.color = index < valoracionActual ? '#FFD700' : 'gray';
      });
    });

    estrellaSpan.addEventListener('click', async () => {
      try {
        await agregarValoracion(id, estrella);
        estrellasDiv.querySelectorAll('span').forEach((nodo, index) => {
          nodo.classList.toggle('active', index < estrella);
        });
      } catch (error) {
        mostrarError('Error al valorar');
      }
    });

    estrellasDiv.appendChild(estrellaSpan);
  });

  return estrellasDiv;
};

// Inicializar
obtenerCanciones();
