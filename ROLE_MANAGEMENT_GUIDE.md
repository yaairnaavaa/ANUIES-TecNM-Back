# Módulo de Gestión de Roles y Permisos

## 📋 Descripción

Este módulo permite al **Admin Nacional** gestionar roles y permisos del sistema mediante una interfaz completa con operaciones CRUD.

## 🏗️ Archivos Creados

### Backend

1. **Controllers:**
   - `controllers/menuPermissionController.js` - Controlador para MenuPermissions

2. **Routes:**
   - `routes/menuPermissionRoutes.js` - Rutas para MenuPermissions

3. **Scripts:**
   - `scripts/addRoleManagementPermission.js` - Script para agregar el permiso al Admin Nacional

### Frontend

1. **Componentes:**
   - `src/app/pages/role-management/role-management.ts` - Componente principal
   - `src/app/pages/role-management/role-management.html` - Template
   - `src/app/pages/role-management/role-management.css` - Estilos

2. **Servicios:**
   - `src/app/services/role.service.ts` - Servicio actualizado con CRUD completo

3. **Rutas:**
   - `src/app/app.routes.ts` - Ruta `/admin/roles` agregada

## 🚀 Instalación y Configuración

### Paso 1: Agregar la ruta al servidor (Backend)

La ruta ya fue agregada en `server.js`:
```javascript
app.use("/api/menupermissions", require("./routes/menuPermissionRoutes"));
```

### Paso 2: Ejecutar el script para agregar el permiso

Desde el directorio del backend, ejecuta:

```bash
node scripts/addRoleManagementPermission.js
```

Este script:
- ✅ Crea el permiso "Roles y Permisos" en la colección `menupermissions`
- ✅ Lo asocia automáticamente al rol "Admin Nacional"
- ✅ Muestra todos los permisos actuales del Admin Nacional

**Salida esperada:**
```
✅ Conectado a MongoDB
📝 Creando permiso de Gestión de Roles...
✅ Permiso creado exitosamente
   ID: 507f1f77bcf86cd799439011
   Etiqueta: Roles y Permisos
   Ruta: /admin/roles

🔍 Buscando rol Admin Nacional...
✅ Rol encontrado: Administrador Nacional
   ID: 695f62053780190e30a74dcd
   Permisos actuales: 6

✅ Permiso agregado exitosamente al Admin Nacional
   Total de permisos: 7

📋 Permisos del Admin Nacional:
   1. Inicio (/admin/home)
   2. IES (/admin/ies-gestion)
   3. IEMS (/admin/iems)
   4. Campañas (/admin/campaigns)
   5. Aspirantes (/admin/aspirant)
   6. Ciclos (/admin/ciclos)
   7. Roles y Permisos (/admin/roles)

✨ Proceso completado exitosamente
```

### Paso 3: Reiniciar el servidor

```bash
# Backend
npm run dev

# Frontend  
npm start
```

### Paso 4: Volver a iniciar sesión

El Admin Nacional debe cerrar sesión y volver a iniciar para que se cargue el nuevo menú con el permiso de "Roles y Permisos".

## 🎯 Funcionalidades

### Vista Principal
- ✅ Tabla con todos los roles del sistema
- ✅ Búsqueda por nombre, displayName o scope
- ✅ Paginación configurable (5, 10, 20, 50 items)
- ✅ Filtros visuales por ámbito (Nacional, IES, IEMS, General)
- ✅ Indicadores de estado (Activo/Inactivo)

### Crear Rol
- ✅ Formulario completo con validaciones
- ✅ Selección múltiple de permisos agrupados por categoría
- ✅ Campos: nombre técnico, nombre para mostrar, descripción, nivel, ámbito
- ✅ Opciones: requiresIES, active

### Editar Rol
- ✅ Carga automática de datos del rol
- ✅ Permisos actuales pre-seleccionados
- ✅ Validación de campos requeridos

### Eliminar Rol
- ✅ Confirmación antes de eliminar
- ✅ Mensajes de éxito/error

### Permisos
- ✅ Visualización agrupada por categoría
- ✅ Selección/deselección individual
- ✅ Iconos y rutas visibles

## 📡 Endpoints del Backend

### Roles
- `GET /api/roles` - Obtener todos los roles
- `GET /api/roles/:id` - Obtener rol por ID
- `POST /api/roles` - Crear nuevo rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol

### MenuPermissions
- `GET /api/menupermissions` - Obtener todos los permisos
- `GET /api/menupermissions/:id` - Obtener permiso por ID
- `POST /api/menupermissions` - Crear nuevo permiso
- `PUT /api/menupermissions/:id` - Actualizar permiso
- `DELETE /api/menupermissions/:id` - Eliminar permiso

## 🎨 Acceso al Módulo

Una vez configurado, el Admin Nacional verá en su sidebar:

```
📊 Administración
  ├── 🏠 Inicio
  ├── 🎓 IES
  ├── 🏫 IEMS
  ├── 📢 Campañas
  ├── 👥 Aspirantes
  ├── 📅 Ciclos
  └── 🛡️ Roles y Permisos  ← NUEVO
```

Acceso directo: `http://localhost:4200/admin/roles`

## 📝 Notas Importantes

1. **Seguridad:** Los endpoints deberían protegerse con middleware de autenticación y autorización en producción
2. **Roles del sistema:** Ten cuidado al eliminar roles que están en uso por usuarios activos
3. **Permisos:** Los permisos se cargan desde la colección `menupermissions`
4. **Ámbitos disponibles:** Nacional, IES, IEMS, General
5. **Niveles:** De 1 a 10 (1 = mayor autoridad)

## 🐛 Troubleshooting

**Problema:** No aparece el menú de "Roles y Permisos"
- ✅ Verifica que se ejecutó el script correctamente
- ✅ Cierra sesión y vuelve a iniciar como Admin Nacional
- ✅ Verifica en MongoDB que el permiso existe y está asociado al rol

**Problema:** Error al cargar permisos
- ✅ Verifica que la ruta `/api/menupermissions` está configurada en `server.js`
- ✅ Revisa que el backend esté corriendo
- ✅ Verifica la consola del navegador para errores de CORS

**Problema:** Error al guardar rol
- ✅ Verifica que todos los campos requeridos estén completos
- ✅ Revisa que el nombre del rol sea único
- ✅ Verifica la consola del navegador y servidor para más detalles

## 🔄 Próximos Pasos (Opcional)

1. Agregar middleware de protección en las rutas del backend
2. Implementar auditoría de cambios en roles
3. Agregar validación de permisos en cascada
4. Crear tests unitarios y de integración
5. Agregar exportación de roles a JSON/CSV

---

**Desarrollado para:** ANUIES-TecNM  
**Última actualización:** Enero 2026
