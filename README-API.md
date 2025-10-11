# API de Clientes - Sistema de Facturación

API REST para la gestión de clientes de empresas, con soporte para personas físicas y jurídicas.

## 🚀 Instalación

```bash
# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

## 🗄️ Base de Datos

### Configuración

Edita el archivo `.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=facturacion_db
```

### Estructura de la Tabla

La aplicación creará automáticamente la tabla `clientes` con la siguiente estructura:

```sql
CREATE TABLE clientes (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre varchar(255) NOT NULL,
  tipo_persona enum('fisica','juridica') NOT NULL DEFAULT 'fisica',
  ci varchar(20) DEFAULT NULL,
  fecha_nacimiento date DEFAULT NULL,
  tiene_ruc tinyint(1) DEFAULT 0,
  ruc varchar(50) DEFAULT NULL,
  telefono varchar(50) DEFAULT NULL,
  pais_telefono char(2) DEFAULT 'PY',
  telefono_normalizado varchar(20) DEFAULT NULL,
  telefono_whatsapp varchar(20) DEFAULT NULL,
  direccion varchar(255) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  eliminado tinyint(4) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  id_departamento int(11) DEFAULT NULL,
  id_distrito int(11) DEFAULT NULL,
  id_ciudad int(11) DEFAULT NULL,
  id_barrio int(11) DEFAULT NULL,
  empresa_id int(11) DEFAULT NULL
);
```

## 🏃 Ejecutar la Aplicación

```bash
# Modo desarrollo
bun run start:dev

# Modo producción
bun run build
bun run start:prod
```

La API estará disponible en: `http://localhost:3000/api`

## 📚 Endpoints

### 1. Crear Cliente

**POST** `/api/clientes`

**Body (Persona Física):**
```json
{
  "nombre": "Juan Pérez",
  "tipo_persona": "fisica",
  "ci": "12345678",
  "fecha_nacimiento": "1990-01-15",
  "tiene_ruc": 0,
  "telefono": "0981123456",
  "pais_telefono": "PY",
  "direccion": "Avda. España 123",
  "email": "juan.perez@example.com",
  "id_departamento": 1,
  "id_distrito": 5,
  "id_ciudad": 10,
  "id_barrio": 50,
  "empresa_id": 1
}
```

**Body (Persona Jurídica):**
```json
{
  "nombre": "Empresa S.A.",
  "tipo_persona": "juridica",
  "ruc": "80012345-6",
  "telefono": "021123456",
  "pais_telefono": "PY",
  "direccion": "Avda. Mariscal López 1234",
  "email": "contacto@empresa.com.py",
  "empresa_id": 1
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cliente creado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "tipo_persona": "fisica",
    "ci": "12345678",
    "telefono_normalizado": "595981123456",
    "telefono_whatsapp": "595981123456",
    ...
  }
}
```

### 2. Listar Clientes (con paginación y filtros)

**GET** `/api/clientes`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 10)
- `search` (opcional): Buscar por nombre, CI, RUC o email
- `empresa_id` (opcional): Filtrar por empresa
- `tipo_persona` (opcional): `fisica` o `juridica`
- `eliminado` (opcional): 0 (activos) o 1 (eliminados)

**Ejemplos:**
```
GET /api/clientes?page=1&limit=20
GET /api/clientes?search=Juan
GET /api/clientes?empresa_id=1&tipo_persona=fisica
GET /api/clientes?eliminado=0
```

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

### 3. Obtener Cliente por ID

**GET** `/api/clientes/:id`

**Query Parameters:**
- `empresa_id` (opcional): Validar que el cliente pertenezca a la empresa

**Ejemplo:**
```
GET /api/clientes/1?empresa_id=1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    ...
  }
}
```

### 4. Actualizar Cliente

**PATCH** `/api/clientes/:id`

**Query Parameters:**
- `empresa_id` (opcional): Validar que el cliente pertenezca a la empresa

**Body (campos opcionales):**
```json
{
  "nombre": "Juan Carlos Pérez",
  "telefono": "0981987654",
  "email": "nuevo.email@example.com"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cliente actualizado exitosamente",
  "data": {
    ...
  }
}
```

### 5. Eliminar Cliente (Soft Delete)

**DELETE** `/api/clientes/:id`

Marca el cliente como eliminado (`eliminado = 1`) sin borrarlo de la base de datos.

**Query Parameters:**
- `empresa_id` (opcional): Validar que el cliente pertenezca a la empresa

**Respuesta:**
```json
{
  "success": true,
  "message": "Cliente marcado como eliminado (soft delete)"
}
```

### 6. Restaurar Cliente

**PATCH** `/api/clientes/:id/restore`

Restaura un cliente previamente eliminado.

**Respuesta:**
```json
{
  "success": true,
  "message": "Cliente restaurado exitosamente",
  "data": {
    ...
  }
}
```

### 7. Eliminar Permanentemente (Hard Delete)

**DELETE** `/api/clientes/:id/hard`

Elimina permanentemente el cliente de la base de datos.

⚠️ **Esta acción no se puede deshacer**

**Respuesta:**
```json
{
  "success": true,
  "message": "Cliente eliminado permanentemente"
}
```

### 8. Listar Clientes por Empresa

**GET** `/api/clientes/empresa/:empresa_id`

Obtiene todos los clientes activos de una empresa específica.

**Ejemplo:**
```
GET /api/clientes/empresa/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "total": 50
}
```

## 🔒 Validaciones

### Personas Físicas
- ✅ La cédula (`ci`) es **obligatoria**
- ✅ El formato de la cédula debe ser válido (solo números, max 8 dígitos)
- ✅ No pueden existir dos clientes con la misma cédula (en la misma empresa si se usa `empresa_id`)
- ✅ Si `tiene_ruc = 1`, el RUC es obligatorio

### Personas Jurídicas
- ✅ El RUC es **obligatorio**
- ✅ El formato del RUC debe ser válido (ejemplo: `80012345-6`)
- ✅ No pueden existir dos clientes con el mismo RUC

### Teléfonos
- 📞 Los teléfonos se normalizan automáticamente al formato E.164
- 📞 Ejemplo: `0981123456` → `595981123456`
- 📞 Se genera automáticamente `telefono_normalizado` y `telefono_whatsapp`

## 📝 Campos Obligatorios

| Campo | Persona Física | Persona Jurídica |
|-------|----------------|------------------|
| nombre | ✅ Obligatorio | ✅ Obligatorio |
| ci | ✅ Obligatorio | ❌ No aplica |
| ruc | ⚠️ Si tiene_ruc=1 | ✅ Obligatorio |

## 🌐 Multi-empresa

El sistema soporta multi-empresa mediante el campo `empresa_id`:

```json
{
  "nombre": "Juan Pérez",
  "tipo_persona": "fisica",
  "ci": "12345678",
  "empresa_id": 1
}
```

Al incluir `empresa_id` en las peticiones:
- Las validaciones de duplicados (CI, RUC) se aplican solo dentro de esa empresa
- Los listados y búsquedas se filtran por empresa
- Cada empresa mantiene su propia base de clientes

## 🛠️ Tecnologías

- **NestJS** - Framework backend
- **TypeORM** - ORM para base de datos
- **MySQL** - Base de datos
- **class-validator** - Validaciones de DTOs
- **class-transformer** - Transformación de objetos

## 📦 Scripts Disponibles

```bash
# Desarrollo
bun run start:dev

# Producción
bun run build
bun run start:prod

# Tests
bun run test
bun run test:e2e

# Linting
bun run lint
```

## 🐛 Manejo de Errores

La API devuelve códigos HTTP estándar:

- `200` - OK
- `201` - Creado
- `400` - Bad Request (validación fallida)
- `404` - Not Found
- `409` - Conflict (CI o RUC duplicado)
- `500` - Internal Server Error

**Formato de error:**
```json
{
  "statusCode": 400,
  "message": ["La cédula es obligatoria para personas físicas"],
  "error": "Bad Request"
}
```

## 💡 Ejemplos con cURL

### Crear cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "tipo_persona": "fisica",
    "ci": "12345678",
    "telefono": "0981123456",
    "empresa_id": 1
  }'
```

### Listar clientes
```bash
curl http://localhost:3000/api/clientes?page=1&limit=10
```

### Buscar clientes
```bash
curl "http://localhost:3000/api/clientes?search=Juan&empresa_id=1"
```

---

**Desarrollado con ❤️ para el sistema de facturación**

