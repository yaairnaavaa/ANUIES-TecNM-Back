const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/database");
const errorHandler = require("./src/middleware/errorHandler");

// Conectar a la base de datos
connectDB();

const app = express();

// Seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por ventana
  message:
    "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.",
});
app.use("/api/", limiter);

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true,
};
app.use(cors(corsOptions));

// Logging
app.use(morgan("dev"));

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API ANUIES-TecNM Backend",
    status: "running",
    version: "1.0.0",
  });
});

// Rutas de la API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));
app.use("/api/menupermissions", require("./routes/menuPermissionRoutes"));
app.use("/api/periods", require("./routes/periodRoutes"));
app.use("/api/ies", require("./src/modules/EscuelasSuperior/iesRoutes"));
app.use("/api/iems", require("./src/modules/EscuelasMediaSuperior/iemsRoutes"));
//app.use("/api/campaigns", require("./src/modules/Campaigns/campaignRoutes"));
//app.use("/api/cycles", require("./src/modules/Ciclos/ciclo.routes"));
//app.use("/api/prospects", require("./routes/prospectRoutes"));
//app.use("/api/users", require("./src/modules/Users/user.routes"));
//app.use("/api/careers", require("./src/modules/Carreras/carreras.routes"));
app.use("/api/notifications",require("./src/modules/Notificaciones/notificaciones.routes"),);
app.use('/api/examples', require('./routes/exampleRoutes'));

// === REGISTRO GLOBAL DE MODELOS ===
require("./models/MenuPermission");
// require("./models/Role");
// require("./models/User");
// require("./models/Period"); // si existe
require("./models/Prospect"); // si existe

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`URL Base API: http://localhost:${PORT}/api`);
});

module.exports = app;
