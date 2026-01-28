# ANUIES-TecNM Backend

Backend API desarrollado con Express.js, Node.js y MongoDB.

## 🚀 Características

- Arquitectura MVC (Model-View-Controller)
- Express.js para el servidor
- MongoDB con Mongoose
- Manejo de errores centralizado
- Middleware personalizado
- Variables de entorno con dotenv

## 📁 Estructura del Proyecto

```
ANUIES-TecNM-Back/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/             # Lógica de negocio
│   └── exampleController.js
├── models/                  # Modelos de Mongoose
│   └── Example.js
├── routes/                  # Definición de rutas
│   └── exampleRoutes.js
├── middleware/              # Middleware personalizado
│   ├── errorHandler.js
│   └── asyncHandler.js
├── server.js                # Punto de entrada de la aplicación
├── .env.example            # Ejemplo de variables de entorno
├── .gitignore
└── package.json
```

## 🛠️ Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus configuraciones:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/anuies-tecnm
```

5. Asegúrate de tener MongoDB corriendo en tu sistema

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📝 Uso

El servidor estará disponible en `http://localhost:3000`

### Endpoints de ejemplo

- `GET /` - Información de la API
- `GET /api/examples` - Obtener todos los ejemplos
- `GET /api/examples/:id` - Obtener un ejemplo por ID
- `POST /api/examples` - Crear un nuevo ejemplo
- `PUT /api/examples/:id` - Actualizar un ejemplo
- `DELETE /api/examples/:id` - Eliminar un ejemplo

## 🔧 Crear un nuevo módulo

Para crear un nuevo módulo (por ejemplo, "User"):

1. **Model**: Crear `models/User.js`
2. **Controller**: Crear `controllers/userController.js`
3. **Routes**: Crear `routes/userRoutes.js`
4. **Registrar rutas**: En `server.js`, agregar:
   ```javascript
   app.use('/api/users', require('./routes/userRoutes'));
   ```

## 📦 Dependencias

- **express**: Framework web para Node.js
- **mongoose**: ODM para MongoDB
- **dotenv**: Manejo de variables de entorno
- **cors**: Middleware para habilitar CORS
- **morgan**: Logger de peticiones HTTP

## 📦 Dependencias de Desarrollo

- **nodemon**: Reinicio automático del servidor en desarrollo

## 🚀 Despliegue en Vercel

El proyecto incluye `vercel.json` para funcionar como función serverless. Pasos:

1. Conectar el repositorio a Vercel y desplegar.
2. **Variables de entorno** (en el dashboard de Vercel → Settings → Environment Variables):
   - `MONGODB_URI`: URI de tu base MongoDB (obligatoria).
   - `JWT_SECRET`: secreto para los tokens (obligatoria si usas auth).
   - `ALLOWED_ORIGINS`: orígenes permitidos para CORS (opcional, por defecto `*`).
   - Las que use el módulo de notificaciones (Mailjet): `API_KEY`, `SECRET_KEY`, `MAILJET_FROM_EMAIL`, etc.

Sin `MONGODB_URI` la función arranca pero las rutas que usan base de datos devolverán error.

## 📄 Licencia

ISC

