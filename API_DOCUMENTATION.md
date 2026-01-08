# 📚 Documentación API - ANUIES-TecNM (Fase 1)

## 🔐 Base URL
```
http://localhost:5000/api
```

## Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer {tu_token_jwt}
```

---

## 🔑 AUTH `/api/auth`

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@tecnm.mx",
  "password": "Admin123!"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "...",
    "firstName": "Administrador",
    "lastName": "Nacional",
    "email": "admin@tecnm.mx",
    "role": "Admin Nacional",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Obtener perfil actual
```http
GET /api/auth/me
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": { ... }
}
```

### Registrar usuario
```http
POST /api/auth/register
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "Password123!",
  "role": "Admin IES",
  "ies": "{ies_id}",
  "phone": "4431234567"
}
```

### Actualizar contraseña
```http
PUT /api/auth/updatepassword
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "Admin123!",
  "newPassword": "NewPassword123!"
}
```

---

## 🏫 IES `/api/ies`

### Listar todas las IES
```http
GET /api/ies
Authorization: Bearer {token}

Query params opcionales:
  ?state=Michoacán
  ?active=true

Response 200:
{
  "success": true,
  "count": 1,
  "data": [ ... ]
}
```

### Obtener IES por ID
```http
GET /api/ies/:id
Authorization: Bearer {token}
```

### Crear IES (Solo Admin Nacional)
```http
POST /api/ies
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "ITGDL",
  "name": "Instituto Tecnológico de Guadalajara",
  "shortName": "IT Guadalajara",
  "address": {
    "street": "Av. Revolución",
    "number": "1500",
    "neighborhood": "Centro",
    "municipality": "Guadalajara",
    "state": "Jalisco",
    "postalCode": "44100"
  },
  "contact": {
    "generalPhone": "3312345678",
    "email": "contacto@itgdl.edu.mx",
    "website": "https://www.itgdl.edu.mx"
  },
  "careers": [
    {
      "name": "Ingeniería en Sistemas Computacionales",
      "code": "ISC",
      "capacityPerSemester": 80,
      "shift": ["Matutino", "Vespertino"]
    }
  ]
}
```

### Actualizar IES
```http
PUT /api/ies/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "contact": {
    "generalPhone": "3387654321"
  }
}
```

### Obtener carreras de una IES (Público)
```http
GET /api/ies/:id/careers

Response 200:
{
  "success": true,
  "data": {
    "iesName": "Instituto Tecnológico de Morelia",
    "careers": [ ... ]
  }
}
```

---

## 🎓 IEMS `/api/iems`

### Buscar IEMS (Público)
```http
GET /api/iems/search?state=Michoacán&type=CBTis

Response 200:
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

### Listar IEMS
```http
GET /api/iems
Authorization: Bearer {token}

Query params:
  ?state=Jalisco
  ?municipality=Guadalajara
  ?type=CBTis
  ?active=true
```

### Crear IEMS
```http
POST /api/iems
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "CBTIS123",
  "name": "CBTis 123",
  "type": "CBTis",
  "address": {
    "municipality": "Morelia",
    "state": "Michoacán"
  },
  "contact": {
    "email": "cbtis123@example.com"
  },
  "educationalOffer": [
    {
      "career": "Técnico en Programación",
      "tecNMAlignment": "Alta"
    }
  ]
}
```

---

## 📣 CAMPAÑAS `/api/campaigns`

### Listar campañas
```http
GET /api/campaigns
Authorization: Bearer {token}

Query params:
  ?ies={ies_id}
  ?type=Digital
  ?status=En curso
```

### Crear campaña
```http
POST /api/campaigns
Authorization: Bearer {token}
Content-Type: application/json

{
  "ies": "{ies_id}",
  "name": "Campaña Facebook Enero 2026",
  "type": "Digital",
  "specificModality": "Facebook",
  "period": {
    "startDate": "2026-01-15",
    "endDate": "2026-02-15"
  },
  "reach": {
    "estimated": 5000,
    "unit": "Impresiones"
  },
  "costs": {
    "total": 10000
  },
  "promotedCareers": ["Ingeniería en Sistemas"],
  "targetedIEMS": ["{iems_id}"]
}
```

### Actualizar resultados
```http
PUT /api/campaigns/:id/results
Authorization: Bearer {token}
Content-Type: application/json

{
  "reach": {
    "actual": 6500
  },
  "results": {
    "generatedLeads": 150,
    "activeApplicants": 45
  }
}
```

---

## 👥 INTERESADOS `/api/prospects`

### Registro público
```http
POST /api/prospects/register
Content-Type: application/json

{
  "firstName": "María",
  "lastName": "González",
  "secondLastName": "López",
  "email": "maria.gonzalez@example.com",
  "phone": {
    "mobile": "4431234567"
  },
  "address": {
    "municipality": "Morelia",
    "state": "Michoacán",
    "postalCode": "58000"
  },
  "originIEMS": "{iems_id}",
  "firstChoiceIES": "{ies_id}",
  "careerInterests": [
    {
      "career": "Ingeniería en Sistemas Computacionales",
      "priority": 1
    }
  ],
  "contactChannel": "Facebook"
}

Response 201:
{
  "success": true,
  "message": "Registro exitoso...",
  "data": {
    "id": "...",
    "email": "maria.gonzalez@example.com",
    "fullName": "María González López",
    "classification": "Curioso",
    "registrationComplete": false
  }
}
```

### Actualizar perfil (Público con ID)
```http
PUT /api/prospects/:id/profile
Content-Type: application/json

{
  "iemsCareer": "Programación",
  "iemsAverage": 9.2,
  "currentSemester": 6,
  "personalInterests": ["Tecnología", "Videojuegos", "IA"]
}
```

### Listar interesados (Requiere auth)
```http
GET /api/prospects
Authorization: Bearer {token}

Query params:
  ?classification=Prospecto
  ?firstChoiceIES={ies_id}
  ?originIEMS={iems_id}
  ?contactChannel=Facebook
  ?active=true
```

### Asignar a operativo
```http
PUT /api/prospects/:id/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "assignedTo": "{user_id}"
}
```

### Validar perfil
```http
PUT /api/prospects/:id/validate
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Perfil validado correctamente",
  "data": {
    "classification": "Aspirante Activo",
    "profileValidated": true
  }
}
```

### Actualizar observaciones
```http
PUT /api/prospects/:id/observations
Authorization: Bearer {token}
Content-Type: application/json

{
  "observations": "Interesado en Ingeniería en Sistemas. Tiene buen promedio."
}
```

---

## 📊 Estados de Clasificación de Interesados

1. **Curioso**: Registro inicial sin completar
2. **Prospecto**: Registro completo
3. **Aspirante Activo**: Perfil validado por operativo

---

## 🔒 Matriz de Permisos

| Endpoint | Admin Nacional | Admin IES | Operativo IES | Público |
|----------|---------------|-----------|---------------|---------|
| POST /auth/register | ✅ | ✅* | ❌ | ❌ |
| IES - Ver todas | ✅ | ❌** | ❌** | ❌ |
| IES - Crear | ✅ | ❌ | ❌ | ❌ |
| IES - Actualizar | ✅ | ✅** | ❌ | ❌ |
| IEMS - CRUD | ✅ | ✅ | ❌ | ❌ |
| IEMS - Búsqueda | ✅ | ✅ | ✅ | ✅ |
| Campañas - CRUD | ✅ | ✅** | ✅** | ❌ |
| Prospects - Ver | ✅ | ✅** | ✅** | ❌ |
| Prospects - Registro | ✅ | ✅ | ✅ | ✅ |
| Prospects - Asignar | ✅ | ✅** | ✅** | ❌ |

*Solo puede crear operativos de su IES  
**Solo puede acceder a recursos de su IES

---

## 🧪 Testing

### 1. Obtener token
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tecnm.mx","password":"Admin123!"}'
```

### 2. Usar el token
```bash
# Guardar token
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Hacer request autenticado
curl http://localhost:5000/api/ies \
  -H "Authorization: Bearer $TOKEN"
```

---

## ❌ Códigos de Error

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `423` - Locked (cuenta bloqueada)
- `500` - Internal Server Error

---

## 📝 Notas Importantes

1. Los passwords deben tener al menos 6 caracteres
2. Después de 5 intentos fallidos de login, la cuenta se bloquea por 30 minutos
3. Los IDs en los ejemplos deben reemplazarse con IDs reales de MongoDB
4. Las fechas deben estar en formato ISO 8601
5. Los tokens JWT expiran según JWT_EXPIRE en .env (default: 30 días)
