# MUSIC-RECOMMENDATION 

Esta aplicación web permite gestionar canciones, donde los usuarios pueden agregar, votar (dar "likes"), comentar, eliminar, calificar canciones y obtener una recomendación aleatoria.  

La aplicación utiliza **Node.js**, **Express** y **MongoDB** para el backend, mientras que el frontend está construido con **HTML**, **CSS**, y **JavaScript**.  

---

## **Características**

La aplicación ofrece las siguientes funcionalidades:

- **Agregar canciones**: Registra canciones especificando su nombre, artista y un enlace a YouTube.  
- **Votar canciones**: Cada canción tiene un contador de "likes" que los usuarios pueden incrementar.  
- **Comentar canciones**: Añade comentarios personalizados a las canciones.  
- **Eliminar canciones**: Opción para borrar canciones específicas.  
- **Calificar canciones**: Los usuarios pueden asignar una puntuación a cada canción.  
- **Obtener una canción aleatoria**: Explora canciones al azar de la lista registrada.  
- **Ver lista de canciones**: Todas las canciones añadidas se muestran con sus detalles y acciones correspondientes.  

---

## **Requisitos previos**

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/)  
- [MongoDB](https://www.mongodb.com/)  

---

## **Instalación y ejecución local**

Sigue estos pasos para ejecutar el proyecto en tu máquina:

1. **Clonar el repositorio**  
   Clona el repositorio en tu máquina local usando el siguiente comando:  

   ```bash
   git clone https://github.com/alcarrion/MUSIC-RECOMMENDATION.git

2. **Dirígete a la ruta**  
   ```bash
   cd .\MUSIC-RECOMENDATION\server\

3. **Instalar dependencias**
    Instala los paquetes necesarios ejecutando:
    ```bash
    npm install

4. **Revisa la conexión a la base de datos**
    Asegúrate de que tu servidor MongoDB esté corriendo localmente

5. **Ejecuta la aplicación**
    ```bash
    npm run dev

6. **Abrir en el navegador**
    Para abrir en el navegador puedes dar ctrl+click en http://localhost:3000 
    

