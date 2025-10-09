 # 🔐 Documentación de Autenticación

## Descripción General

El sistema de facturación electrónica soporta **dos métodos de autenticación**:

1. **JWT (JSON Web Token)** - Para usuarios registrados
2. **user_token** - Token de API para acceso directo

---
  
## 📋 Tabla de Contenidos

- [Registro de Usuario](#registro-de-usuario)
- [Login de Usuario](#login-de-usuario)
- [Uso del JWT Token](#uso-del-jwt-token)
- [Uso del user_token](#uso-del-user_token)
- [Endpoints Protegidos](#endpoints-protegidos)
- [Endpoints Públicos](#endpoints-públicos)
- [Ejemplos con cURL](#ejemplos-con-curl)
- [Ejemplos con Postman](#ejemplos-con-postman)
- [Manejo de Errores](#manejo-de-errores)

---

## 🆕 Registro de Usuario

### Endpoint
```
POST /users/register
```

### Descripción
Crea una nueva cuenta de usuario en el sistema.

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "username": "string (requerido, único)",
  "email": "string (requerido, formato email)",
  "password": "string (requerido, mínimo 6 caracteres)"
}
```

### Respuesta Exitosa (201)
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "isActive": true,
  "createdAt": "2025-10-04T14:30:00.000Z",
  "updatedAt": "2025-10-04T14:30:00.000Z"
}
```

### Errores Comunes
- **409 Conflict**: Usuario o email ya existe
- **400 Bad Request**: Datos inválidos (email mal formado, contraseña muy corta, etc.)

### Ejemplo cURL
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "miusuario",
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

---

## 🔑 Login de Usuario

### Endpoint
```
POST /users/login
```

### Descripción
Autentica un usuario y devuelve un JWT token válido por 24 horas.

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "username": "string (requerido)",
  "password": "string (requerido)"
}
```

### Respuesta Exitosa (200)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "isActive": true
  }
}
```

### Detalles del Token
- **Algoritmo**: HS256
- **Expiración**: 24 horas
- **Payload**: 
  ```json
  {
    "username": "testuser",
    "sub": 1,
    "iat": 1759605141,
    "exp": 1759691541
  }
  ```

### Errores Comunes
- **401 Unauthorized**: Credenciales inválidas
- **400 Bad Request**: Datos faltantes o mal formados

### Ejemplo cURL
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "miusuario",
    "password": "password123"
  }'
```

---

## 🎫 Uso del JWT Token

### Método 1: Header Authorization (Recomendado)

Agrega el token en el header `authorization` con el prefijo `Bearer`:

```
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo cURL
```bash
curl -X GET http://localhost:3000/documentos \
  -H "authorization: Bearer TU_JWT_TOKEN_AQUI"
```

### Ejemplo JavaScript (Fetch)
```javascript
fetch('http://localhost:3000/documentos', {
  method: 'GET',
  headers: {
    'authorization': 'Bearer ' + token
  }
})
```

### Ejemplo Axios
```javascript
axios.get('http://localhost:3000/documentos', {
  headers: {
    'authorization': `Bearer ${token}`
  }
})
```

---

## 🔑 Uso del user_token

### Descripción
Token de API estático para acceso directo sin necesidad de login.

### Configuración
El token se configura en el archivo `.env`:
```env
USER_API_KEY=tu_token_secreto_aqui_cambiar_en_produccion
```

### Uso
Agrega el token en el header `user_token`:

```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

### Ejemplo cURL
```bash
curl -X GET http://localhost:3000/documentos \
  -H "user_token: tu_token_secreto_aqui_cambiar_en_produccion"
```

### Ventajas
- ✅ No requiere login
- ✅ No expira
- ✅ Ideal para integraciones server-to-server

### Desventajas
- ⚠️ Menos seguro que JWT
- ⚠️ No tiene información de usuario
- ⚠️ Compartido por toda la organización

---

## 🔒 Endpoints Protegidos

Los siguientes endpoints **requieren autenticación** (JWT o user_token):

### Documentos
- `GET /documentos` - Listar documentos
- `POST /documentos` - Crear documento
- `GET /documentos/:id` - Obtener documento
- `PATCH /documentos/:id` - Actualizar documento
- `DELETE /documentos/:id` - Eliminar documento

### Emisor
- `GET /emisor` - Listar emisores
- `POST /emisor` - Crear emisor
- `GET /emisor/:id` - Obtener emisor
- `PATCH /emisor/:id` - Actualizar emisor
- `DELETE /emisor/:id` - Eliminar emisor

### Certificados
- `GET /certificado-emisor` - Listar certificados
- `POST /certificado-emisor` - Subir certificado
- `GET /certificado-emisor/:id` - Obtener certificado
- `DELETE /certificado-emisor/:id` - Eliminar certificado

### Lotes
- `GET /lote` - Listar lotes
- `GET /lote/:id` - Obtener lote

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

---

## 🌐 Endpoints Públicos

Los siguientes endpoints **NO requieren autenticación**:

- `POST /users/register` - Registro de usuario
- `POST /users/login` - Login de usuario
- `GET /` - Health check

---

## 📝 Ejemplos con cURL

### 1. Flujo Completo de Autenticación

#### Paso 1: Registrar Usuario
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "email": "juan@empresa.com",
    "password": "mipassword123"
  }'
```

#### Paso 2: Hacer Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "password": "mipassword123"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1YW4iLCJzdWIiOjEsImlhdCI6MTc1OTYwNTE0MSwiZXhwIjoxNzU5NjkxNTQxfQ.xyz123",
  "user": {
    "id": 1,
    "username": "juan",
    "email": "juan@empresa.com",
    "isActive": true
  }
}
```

#### Paso 3: Usar el Token
```bash
# Guarda el token en una variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1YW4iLCJzdWIiOjEsImlhdCI6MTc1OTYwNTE0MSwiZXhwIjoxNzU5NjkxNTQxfQ.xyz123"

# Usa el token para acceder a endpoints protegidos
curl -X GET http://localhost:3000/documentos \
  -H "authorization: Bearer $TOKEN"
```

### 2. Usando user_token

```bash
curl -X GET http://localhost:3000/documentos \
  -H "user_token: tu_token_secreto_aqui_cambiar_en_produccion"
```

### 3. Crear Documento con JWT

```bash
curl -X POST http://localhost:3000/documentos \
  -H "authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoDocumento": 1,
    "cliente": {
      "ruc": "80012345-6",
      "razonSocial": "Cliente SA"
    }
  }'
```

---

## 🔧 Ejemplos con Postman

### Configuración de JWT en Postman

#### Opción 1: Pestaña Authorization (Recomendado)
1. Abre tu request en Postman
2. Ve a la pestaña **"Authorization"**
3. En **Type**, selecciona: `Bearer Token`
4. En **Token**, pega tu JWT token
5. Postman agregará automáticamente el header `authorization: Bearer TOKEN`

#### Opción 2: Headers Manuales
1. Ve a la pestaña **"Headers"**
2. Agrega:
   - **Key**: `authorization`
   - **Value**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Configuración de user_token en Postman

1. Ve a la pestaña **"Headers"**
2. Agrega:
   - **Key**: `user_token`
   - **Value**: `tu_token_secreto_aqui_cambiar_en_produccion`

### Variables de Entorno en Postman

Para facilitar el uso, crea variables de entorno:

1. Click en el ícono de ⚙️ (Settings)
2. Ve a **"Environments"**
3. Crea un nuevo environment llamado "Facturación"
4. Agrega las siguientes variables:
   - `base_url`: `http://localhost:3000`
   - `jwt_token`: (se llenará después del login)
   - `user_token`: `tu_token_secreto_aqui_cambiar_en_produccion`

5. En tus requests usa:
   - URL: `{{base_url}}/documentos`
   - Authorization: `Bearer {{jwt_token}}`

### Script Post-Login para Guardar Token

En el endpoint de login, ve a la pestaña **"Tests"** y agrega:

```javascript
// Guardar el token automáticamente después del login
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("jwt_token", response.access_token);
    console.log("Token guardado:", response.access_token);
}
```

Ahora cada vez que hagas login, el token se guardará automáticamente.

---

## ⚠️ Manejo de Errores

### Error 401 - Unauthorized

**Causas comunes:**
- Token JWT expirado (más de 24 horas)
- Token JWT inválido o malformado
- user_token incorrecto
- No se proporcionó ningún método de autenticación

**Solución:**
```bash
# Hacer login nuevamente para obtener un nuevo token
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "miusuario",
    "password": "mipassword"
  }'
```

### Error 400 - Bad Request

**Causas comunes:**
- Datos faltantes en el body
- Formato de email inválido
- Contraseña muy corta (menos de 6 caracteres)

**Ejemplo de error:**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### Error 409 - Conflict

**Causa:**
- Usuario o email ya existe en el sistema

**Solución:**
- Usar un username o email diferente
- Si olvidaste tu contraseña, contacta al administrador

---

## 🔐 Seguridad

### Buenas Prácticas

1. **Nunca expongas el JWT_SECRET**
   - Mantén el secreto en variables de entorno
   - No lo incluyas en el código fuente
   - Usa secretos diferentes para desarrollo y producción

2. **Protege el user_token**
   - Cámbialo en producción
   - No lo compartas públicamente
   - Rótalo periódicamente

3. **Manejo de Tokens en el Frontend**
   ```javascript
   // ✅ Bueno: Guardar en memoria o sessionStorage
   sessionStorage.setItem('jwt_token', token);
   
   // ⚠️ Evitar: localStorage (vulnerable a XSS)
   // localStorage.setItem('jwt_token', token);
   ```

4. **HTTPS en Producción**
   - Siempre usa HTTPS en producción
   - Los tokens pueden ser interceptados en HTTP

5. **Expiración de Tokens**
   - Los JWT expiran en 24 horas
   - Implementa refresh tokens si necesitas sesiones más largas

---

## 🛠️ Configuración

### Variables de Entorno (.env)

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=facturacion_db

# Autenticación
USER_API_KEY=tu_token_secreto_aqui_cambiar_en_produccion
JWT_SECRET=45d66cf836b5d041130fbfbfc5bbe21f4f4d79f6

# Entorno
SET_ENV=prod
```

### Cambiar el JWT_SECRET

1. Genera un nuevo secreto:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Actualiza el `.env`:
   ```env
   JWT_SECRET=tu_nuevo_secreto_generado
   ```

3. Reinicia el servidor

---

## 📊 Comparación de Métodos

| Característica | JWT Token | user_token |
|---------------|-----------|------------|
| **Requiere Login** | ✅ Sí | ❌ No |
| **Expiración** | ✅ 24 horas | ❌ No expira |
| **Información de Usuario** | ✅ Sí | ❌ No |
| **Seguridad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Uso Recomendado** | Aplicaciones web/móvil | Integraciones server-to-server |
| **Rotación** | Automática (re-login) | Manual |

---

## 🆘 Soporte

Si tienes problemas con la autenticación:

1. Verifica que el servidor esté corriendo
2. Revisa que las variables de entorno estén configuradas
3. Asegúrate de usar el formato correcto del header
4. Verifica que el token no haya expirado
5. Revisa los logs del servidor para más detalles

---

## 📝 Changelog

### v1.0.0 (2025-10-04)
- ✅ Sistema de autenticación dual (JWT + user_token)
- ✅ Registro y login de usuarios
- ✅ Tokens JWT con expiración de 24 horas
- ✅ Protección de endpoints con AuthGuard
- ✅ Encriptación de contraseñas con bcrypt

