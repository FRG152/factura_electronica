# Documentación del Módulo de Productos

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Estructura de la Entidad](#estructura-de-la-entidad)
- [Endpoints de la API](#endpoints-de-la-api)
- [DTOs y Validaciones](#dtos-y-validaciones)
- [Casos de Uso](#casos-de-uso)
- [Ejemplos de Peticiones](#ejemplos-de-peticiones)

## Descripción General

El módulo de **Productos** gestiona el catálogo completo de productos para el sistema de facturación electrónica. Este módulo permite crear, listar, actualizar, eliminar y buscar productos, además de ofrecer funcionalidades especiales como:

- Control de inventario y stock mínimo
- Múltiples precios de venta
- Venta por unidad o a granel
- Búsqueda por código de barras
- Gestión de IVA
- Alertas de productos con bajo stock

## Estructura de la Entidad

La entidad `Producto` se almacena en la tabla `productos` y contiene los siguientes campos:

| Campo | Tipo | Descripción | Requerido | Por Defecto |
|-------|------|-------------|-----------|-------------|
| `id_producto` | number | Identificador único del producto | Auto-generado | - |
| `nombre` | string(100) | Nombre del producto | Sí | - |
| `descripcion` | text | Descripción detallada | No | null |
| `created_at` | Date | Fecha de creación | Auto-generado | - |
| `imagen1` | string(255) | URL de la primera imagen | No | null |
| `imagen2` | string(255) | URL de la segunda imagen | No | null |
| `precio_compra` | decimal(10,2) | Precio de compra | Sí | 0.00 |
| `precio_compra_promedio` | decimal(10,2) | Precio de compra promedio | No | 0.00 |
| `precio_venta1` | decimal(10,2) | Precio de venta principal | Sí | 0.00 |
| `precio_venta2` | decimal(10,2) | Precio de venta alternativo 1 | No | null |
| `precio_venta3` | decimal(10,2) | Precio de venta alternativo 2 | No | null |
| `precio_minimo` | decimal(10,2) | Precio mínimo de venta | No | null |
| `iva` | number | Porcentaje de IVA (0-100) | Sí | - |
| `unidad_medida` | string(50) | Unidad de medida | No | 'Unidad' |
| `venta_granel` | tinyint | Indica si se vende a granel (0 o 1) | No | 0 |
| `precio_granel` | decimal(10,2) | Precio cuando se vende a granel | No | null |
| `codigo_barras` | string(255) | Código de barras del producto | No | null |
| `unidad_granel` | string(50) | Unidad de medida para granel | No | null |
| `equivalencia_granel` | decimal(10,2) | Equivalencia entre unidad y granel | No | 1.00 |
| `stock_minimo` | number | Stock mínimo antes de alerta | No | 0 |
| `controla_stock` | tinyint | Indica si controla inventario (0 o 1) | No | 1 |

## Endpoints de la API

Todos los endpoints requieren autenticación mediante uno de estos métodos:

1. **JWT Token** (Bearer Token): Token obtenido después del login, válido por 24 horas
2. **user_token**: Token de API estático para integraciones

Base URL: `/productos`

### Métodos de Autenticación

#### Opción 1: JWT Token (Recomendado para aplicaciones web/móvil)
```
Authorization: Bearer {tu_jwt_token}
```

#### Opción 2: user_token (Para integraciones server-to-server)
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

> 💡 **Nota:** Para más información sobre autenticación, consulta [AUTHENTICATION.md](./AUTHENTICATION.md)

### 1. Crear Producto

**POST** `/productos`

Crea un nuevo producto en el sistema.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Laptop HP Pavilion",
  "descripcion": "Laptop HP Pavilion 15.6 pulgadas, Intel Core i5, 8GB RAM, 256GB SSD",
  "precio_compra": 1500000,
  "precio_venta1": 2000000,
  "precio_venta2": 1950000,
  "precio_venta3": 1900000,
  "precio_minimo": 1850000,
  "iva": 19,
  "unidad_medida": "Unidad",
  "codigo_barras": "7891234567890",
  "stock_minimo": 5,
  "controla_stock": 1
}
```

**Respuesta exitosa (201):**
```json
{
  "id_producto": 1,
  "nombre": "Laptop HP Pavilion",
  "descripcion": "Laptop HP Pavilion 15.6 pulgadas, Intel Core i5, 8GB RAM, 256GB SSD",
  "precio_compra": 1500000,
  "precio_compra_promedio": 0,
  "precio_venta1": 2000000,
  "precio_venta2": 1950000,
  "precio_venta3": 1900000,
  "precio_minimo": 1850000,
  "iva": 19,
  "unidad_medida": "Unidad",
  "venta_granel": 0,
  "precio_granel": null,
  "codigo_barras": "7891234567890",
  "unidad_granel": null,
  "equivalencia_granel": 1,
  "stock_minimo": 5,
  "controla_stock": 1,
  "imagen1": null,
  "imagen2": null,
  "created_at": "2025-10-09T15:30:00.000Z"
}
```

### 2. Listar Todos los Productos

**GET** `/productos`

Obtiene la lista completa de productos ordenados alfabéticamente por nombre.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

**Respuesta exitosa (200):**
```json
[
  {
    "id_producto": 1,
    "nombre": "Laptop HP Pavilion",
    "descripcion": "Laptop HP Pavilion 15.6 pulgadas",
    "precio_venta1": 2000000,
    "iva": 19,
    "stock_minimo": 5,
    "controla_stock": 1,
    ...
  },
  {
    "id_producto": 2,
    "nombre": "Mouse Logitech",
    "descripcion": "Mouse inalámbrico Logitech",
    "precio_venta1": 80000,
    "iva": 19,
    ...
  }
]
```

### 3. Buscar Productos

**GET** `/productos?search={query}`

Busca productos por nombre, descripción o código de barras.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

**Parámetros de Query:**
- `search` (string): Término de búsqueda

**Ejemplo:**
```
GET /productos?search=laptop
```

**Respuesta exitosa (200):**
```json
[
  {
    "id_producto": 1,
    "nombre": "Laptop HP Pavilion",
    "descripcion": "Laptop HP Pavilion 15.6 pulgadas",
    ...
  },
  {
    "id_producto": 3,
    "nombre": "Laptop Dell Inspiron",
    "descripcion": "Laptop Dell con procesador Intel",
    ...
  }
]
```

### 4. Obtener Producto por ID

**GET** `/productos/:id`

Obtiene un producto específico por su ID.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

**Parámetros de Ruta:**
- `id` (number): ID del producto

**Ejemplo:**
```
GET /productos/1
```

**Respuesta exitosa (200):**
```json
{
  "id_producto": 1,
  "nombre": "Laptop HP Pavilion",
  "descripcion": "Laptop HP Pavilion 15.6 pulgadas",
  "precio_compra": 1500000,
  "precio_venta1": 2000000,
  "iva": 19,
  ...
}
```

**Respuesta de error (404):**
```json
{
  "statusCode": 404,
  "message": "Producto con ID 999 no encontrado",
  "error": "Not Found"
}
```

### 5. Buscar Producto por Código de Barras

**GET** `/productos/codigo-barras/:codigo`

Busca un producto específico por su código de barras.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

**Parámetros de Ruta:**
- `codigo` (string): Código de barras del producto

**Ejemplo:**
```
GET /productos/codigo-barras/7891234567890
```

**Respuesta exitosa (200):**
```json
{
  "id_producto": 1,
  "nombre": "Laptop HP Pavilion",
  "codigo_barras": "7891234567890",
  "precio_venta1": 2000000,
  ...
}
```

**Respuesta de error (404):**
```json
{
  "statusCode": 404,
  "message": "Producto con código de barras 7891234567890 no encontrado",
  "error": "Not Found"
}
```

### 6. Obtener Productos con Bajo Stock

**GET** `/productos/bajo-stock`

Obtiene la lista de productos que controlan stock y tienen definido un stock mínimo.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

**Ejemplo:**
```
GET /productos/bajo-stock
```

**Respuesta exitosa (200):**
```json
[
  {
    "id_producto": 1,
    "nombre": "Laptop HP Pavilion",
    "stock_minimo": 5,
    "controla_stock": 1,
    ...
  },
  {
    "id_producto": 5,
    "nombre": "Teclado Mecánico",
    "stock_minimo": 10,
    "controla_stock": 1,
    ...
  }
]
```

> **Nota:** Este endpoint filtra productos donde `controla_stock = 1` y `stock_minimo > 0`

### 7. Actualizar Producto

**PATCH** `/productos/:id`

Actualiza parcialmente un producto existente.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
Content-Type: application/json
```

**Parámetros de Ruta:**
- `id` (number): ID del producto a actualizar

**Body (todos los campos son opcionales):**
```json
{
  "precio_venta1": 2100000,
  "precio_venta2": 2050000,
  "stock_minimo": 3,
  "descripcion": "Descripción actualizada del producto"
}
```

**Respuesta exitosa (200):**
```json
{
  "id_producto": 1,
  "nombre": "Laptop HP Pavilion",
  "descripcion": "Descripción actualizada del producto",
  "precio_venta1": 2100000,
  "precio_venta2": 2050000,
  "stock_minimo": 3,
  ...
}
```

### 8. Eliminar Producto

**DELETE** `/productos/:id`

Elimina un producto del sistema.

**Headers (Opción 1 - JWT):**
```
Authorization: Bearer {token}
```

**Headers (Opción 2 - user_token):**
```
user_token: tu_token_secreto_aqui_cambiar_en_produccion
```

**Parámetros de Ruta:**
- `id` (number): ID del producto a eliminar

**Ejemplo:**
```
DELETE /productos/1
```

**Respuesta exitosa (204):**
Sin contenido

**Respuesta de error (404):**
```json
{
  "statusCode": 404,
  "message": "Producto con ID 999 no encontrado",
  "error": "Not Found"
}
```

## DTOs y Validaciones

### CreateProductoDto

Validaciones aplicadas al crear un producto:

| Campo | Validaciones |
|-------|--------------|
| `nombre` | Requerido, string, máximo 100 caracteres |
| `descripcion` | Opcional, string |
| `imagen1` | Opcional, string, máximo 255 caracteres |
| `imagen2` | Opcional, string, máximo 255 caracteres |
| `precio_compra` | Requerido, número, mínimo 0 |
| `precio_compra_promedio` | Opcional, número, mínimo 0 |
| `precio_venta1` | Requerido, número, mínimo 0 |
| `precio_venta2` | Opcional, número, mínimo 0 |
| `precio_venta3` | Opcional, número, mínimo 0 |
| `precio_minimo` | Opcional, número, mínimo 0 |
| `iva` | Requerido, número, entre 0 y 100 |
| `unidad_medida` | Opcional, string, máximo 50 caracteres |
| `venta_granel` | Opcional, número, entre 0 y 1 |
| `precio_granel` | Opcional, número, mínimo 0 |
| `codigo_barras` | Opcional, string, máximo 255 caracteres |
| `unidad_granel` | Opcional, string, máximo 50 caracteres |
| `equivalencia_granel` | Opcional, número, mínimo 0 |
| `stock_minimo` | Opcional, número, mínimo 0 |
| `controla_stock` | Opcional, número, entre 0 y 1 |

### UpdateProductoDto

El DTO de actualización extiende de `CreateProductoDto` haciendo todos los campos opcionales (`PartialType`).

**Ejemplo de validación de error (400):**
```json
{
  "statusCode": 400,
  "message": [
    "nombre debe ser un string",
    "nombre no debe estar vacío",
    "precio_compra debe ser un número mayor o igual a 0",
    "iva debe ser un número entre 0 y 100"
  ],
  "error": "Bad Request"
}
```

## Casos de Uso

### 1. Crear un Producto Simple

Para un producto básico sin variaciones:

**Con JWT Token:**
```bash
curl -X POST http://localhost:3000/productos \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cable HDMI",
    "descripcion": "Cable HDMI 2.0 de 2 metros",
    "precio_compra": 15000,
    "precio_venta1": 25000,
    "iva": 19,
    "codigo_barras": "7890123456789"
  }'
```

**Con user_token:**
```bash
curl -X POST http://localhost:3000/productos \
  -H "user_token: tu_token_secreto_aqui_cambiar_en_produccion" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cable HDMI",
    "descripcion": "Cable HDMI 2.0 de 2 metros",
    "precio_compra": 15000,
    "precio_venta1": 25000,
    "iva": 19,
    "codigo_barras": "7890123456789"
  }'
```

### 2. Crear un Producto con Venta a Granel

Para productos que se venden por peso o medida:

```bash
curl -X POST http://localhost:3000/productos \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Café en Grano",
    "descripcion": "Café colombiano premium",
    "precio_compra": 30000,
    "precio_venta1": 45000,
    "iva": 19,
    "unidad_medida": "Kilo",
    "venta_granel": 1,
    "precio_granel": 48,
    "unidad_granel": "Gramo",
    "equivalencia_granel": 1000,
    "controla_stock": 1,
    "stock_minimo": 10
  }'
```

### 3. Buscar Productos en Tiempo Real

Para implementar búsqueda en un punto de venta:

```bash
# Buscar por nombre
curl -X GET "http://localhost:3000/productos?search=laptop" \
  -H "Authorization: Bearer {token}"

# Buscar por código de barras específico
curl -X GET "http://localhost:3000/productos/codigo-barras/7891234567890" \
  -H "Authorization: Bearer {token}"
```

### 4. Actualizar Precios de un Producto

Para actualizar únicamente los precios:

```bash
curl -X PATCH http://localhost:3000/productos/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "precio_venta1": 2200000,
    "precio_venta2": 2150000,
    "precio_venta3": 2100000,
    "precio_minimo": 2050000
  }'
```

### 5. Monitorear Productos con Bajo Stock

Para obtener alertas de inventario:

```bash
curl -X GET http://localhost:3000/productos/bajo-stock \
  -H "Authorization: Bearer {token}"
```

### 6. Listar Todos los Productos

Para mostrar el catálogo completo:

```bash
curl -X GET http://localhost:3000/productos \
  -H "Authorization: Bearer {token}"
```

## Ejemplos de Peticiones

### Ejemplo Completo con cURL

#### Usando JWT Token

```bash
# 1. Crear producto
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/productos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Monitor Samsung 27 pulgadas",
    "descripcion": "Monitor LED Full HD con panel IPS",
    "precio_compra": 450000,
    "precio_venta1": 650000,
    "precio_venta2": 625000,
    "iva": 19,
    "unidad_medida": "Unidad",
    "codigo_barras": "8801643123456",
    "stock_minimo": 3,
    "controla_stock": 1
  }'

# 2. Listar todos
curl -X GET http://localhost:3000/productos \
  -H "Authorization: Bearer $TOKEN"

# 3. Buscar
curl -X GET "http://localhost:3000/productos?search=monitor" \
  -H "Authorization: Bearer $TOKEN"

# 4. Obtener por ID
curl -X GET http://localhost:3000/productos/1 \
  -H "Authorization: Bearer $TOKEN"

# 5. Actualizar
curl -X PATCH http://localhost:3000/productos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "precio_venta1": 680000
  }'

# 6. Eliminar
curl -X DELETE http://localhost:3000/productos/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Usando user_token

```bash
# 1. Crear producto
USER_TOKEN="tu_token_secreto_aqui_cambiar_en_produccion"

curl -X POST http://localhost:3000/productos \
  -H "user_token: $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Monitor Samsung 27 pulgadas",
    "descripcion": "Monitor LED Full HD con panel IPS",
    "precio_compra": 450000,
    "precio_venta1": 650000,
    "precio_venta2": 625000,
    "iva": 19,
    "unidad_medida": "Unidad",
    "codigo_barras": "8801643123456",
    "stock_minimo": 3,
    "controla_stock": 1
  }'

# 2. Listar todos
curl -X GET http://localhost:3000/productos \
  -H "user_token: $USER_TOKEN"

# 3. Buscar
curl -X GET "http://localhost:3000/productos?search=monitor" \
  -H "user_token: $USER_TOKEN"

# 4. Obtener por ID
curl -X GET http://localhost:3000/productos/1 \
  -H "user_token: $USER_TOKEN"

# 5. Actualizar
curl -X PATCH http://localhost:3000/productos/1 \
  -H "user_token: $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "precio_venta1": 680000
  }'

# 6. Eliminar
curl -X DELETE http://localhost:3000/productos/1 \
  -H "user_token: $USER_TOKEN"
```

### Ejemplo con JavaScript (Fetch API)

#### Opción 1: Usando JWT Token

```javascript
// Configuración base con JWT
const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('access_token');

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Crear producto
async function crearProducto() {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      nombre: 'Teclado Mecánico RGB',
      descripcion: 'Teclado mecánico con switches Cherry MX',
      precio_compra: 150000,
      precio_venta1: 250000,
      iva: 19,
      codigo_barras: '7896541230123',
      stock_minimo: 5,
      controla_stock: 1
    })
  });
  
  const producto = await response.json();
  console.log('Producto creado:', producto);
  return producto;
}

// Listar productos
async function listarProductos() {
  const response = await fetch(`${API_URL}/productos`, {
    headers: headers
  });
  
  const productos = await response.json();
  console.log('Productos:', productos);
  return productos;
}

// Buscar productos
async function buscarProductos(query) {
  const response = await fetch(`${API_URL}/productos?search=${encodeURIComponent(query)}`, {
    headers: headers
  });
  
  const productos = await response.json();
  console.log('Resultados:', productos);
  return productos;
}

// Buscar por código de barras
async function buscarPorCodigoBarras(codigo) {
  const response = await fetch(`${API_URL}/productos/codigo-barras/${codigo}`, {
    headers: headers
  });
  
  if (!response.ok) {
    throw new Error('Producto no encontrado');
  }
  
  const producto = await response.json();
  console.log('Producto encontrado:', producto);
  return producto;
}

// Obtener productos con bajo stock
async function obtenerProductosBajoStock() {
  const response = await fetch(`${API_URL}/productos/bajo-stock`, {
    headers: headers
  });
  
  const productos = await response.json();
  console.log('Productos con bajo stock:', productos);
  return productos;
}

// Actualizar producto
async function actualizarProducto(id, datos) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(datos)
  });
  
  const producto = await response.json();
  console.log('Producto actualizado:', producto);
  return producto;
}

// Eliminar producto
async function eliminarProducto(id) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE',
    headers: headers
  });
  
  if (response.ok) {
    console.log('Producto eliminado exitosamente');
  }
}
```

#### Opción 2: Usando user_token

```javascript
// Configuración base con user_token
const API_URL = 'http://localhost:3000';
const USER_TOKEN = 'tu_token_secreto_aqui_cambiar_en_produccion';

const headers = {
  'user_token': USER_TOKEN,
  'Content-Type': 'application/json'
};

// Las funciones son las mismas, solo cambian los headers
// Ejemplo: Crear producto
async function crearProducto() {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      nombre: 'Teclado Mecánico RGB',
      descripcion: 'Teclado mecánico con switches Cherry MX',
      precio_compra: 150000,
      precio_venta1: 250000,
      iva: 19,
      codigo_barras: '7896541230123',
      stock_minimo: 5,
      controla_stock: 1
    })
  });
  
  const producto = await response.json();
  console.log('Producto creado:', producto);
  return producto;
}

// Listar productos
async function listarProductos() {
  const response = await fetch(`${API_URL}/productos`, {
    headers: headers
  });
  
  const productos = await response.json();
  console.log('Productos:', productos);
  return productos;
}
```

### Ejemplo con TypeScript y Axios

```typescript
import axios, { AxiosInstance } from 'axios';

interface Producto {
  id_producto?: number;
  nombre: string;
  descripcion?: string;
  precio_compra: number;
  precio_venta1: number;
  precio_venta2?: number;
  precio_venta3?: number;
  precio_minimo?: number;
  iva: number;
  unidad_medida?: string;
  codigo_barras?: string;
  stock_minimo?: number;
  controla_stock?: number;
  venta_granel?: number;
  precio_granel?: number;
  unidad_granel?: string;
  equivalencia_granel?: number;
  created_at?: Date;
}

class ProductosService {
  private api: AxiosInstance;

  constructor(baseURL: string, token: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async crear(producto: Producto): Promise<Producto> {
    const { data } = await this.api.post<Producto>('/productos', producto);
    return data;
  }

  async listarTodos(): Promise<Producto[]> {
    const { data } = await this.api.get<Producto[]>('/productos');
    return data;
  }

  async buscar(query: string): Promise<Producto[]> {
    const { data } = await this.api.get<Producto[]>('/productos', {
      params: { search: query }
    });
    return data;
  }

  async obtenerPorId(id: number): Promise<Producto> {
    const { data } = await this.api.get<Producto>(`/productos/${id}`);
    return data;
  }

  async buscarPorCodigoBarras(codigo: string): Promise<Producto> {
    const { data } = await this.api.get<Producto>(`/productos/codigo-barras/${codigo}`);
    return data;
  }

  async obtenerBajoStock(): Promise<Producto[]> {
    const { data } = await this.api.get<Producto[]>('/productos/bajo-stock');
    return data;
  }

  async actualizar(id: number, producto: Partial<Producto>): Promise<Producto> {
    const { data } = await this.api.patch<Producto>(`/productos/${id}`, producto);
    return data;
  }

  async eliminar(id: number): Promise<void> {
    await this.api.delete(`/productos/${id}`);
  }
}

// Uso
const productosService = new ProductosService(
  'http://localhost:3000',
  'tu-token-jwt'
);

// Ejemplo de uso
async function ejemploUso() {
  try {
    // Crear producto
    const nuevoProducto = await productosService.crear({
      nombre: 'Mouse Gamer',
      descripcion: 'Mouse gamer con RGB',
      precio_compra: 80000,
      precio_venta1: 120000,
      iva: 19,
      codigo_barras: '7896321456789',
      stock_minimo: 10,
      controla_stock: 1
    });
    console.log('Producto creado:', nuevoProducto);

    // Buscar productos
    const resultados = await productosService.buscar('mouse');
    console.log('Resultados de búsqueda:', resultados);

    // Obtener productos con bajo stock
    const bajoStock = await productosService.obtenerBajoStock();
    console.log('Productos con bajo stock:', bajoStock);

  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Autenticación

### Métodos Disponibles

Todos los endpoints soportan **dos métodos de autenticación**:

| Método | Header | Uso Recomendado | Expiración | Requiere Login |
|--------|--------|-----------------|------------|----------------|
| **JWT Token** | `Authorization: Bearer {token}` | Aplicaciones web/móvil | 24 horas | ✅ Sí |
| **user_token** | `user_token: {token}` | Integraciones server-to-server | No expira | ❌ No |

### ¿Cuál método usar?

- **Usa JWT Token** si estás desarrollando:
  - Aplicación web frontend (React, Vue, Angular)
  - Aplicación móvil (iOS, Android)
  - Necesitas identificar usuarios individuales
  - Quieres mayor seguridad con expiración automática

- **Usa user_token** si estás:
  - Integrando sistemas backend (server-to-server)
  - Creando scripts automatizados
  - Desarrollando servicios que no tienen usuarios finales
  - Necesitas un token que no expire

> 💡 **Para más información sobre autenticación, consulta [AUTHENTICATION.md](./AUTHENTICATION.md)**

## Notas Importantes

1. **Autenticación:** Todos los endpoints requieren autenticación mediante JWT Token o user_token (ver sección de Autenticación arriba).

2. **Ordenamiento:** Los listados de productos se ordenan alfabéticamente por nombre de forma ascendente.

3. **Búsqueda:** La búsqueda es case-insensitive y busca coincidencias parciales en nombre, descripción y código de barras.

4. **Control de Stock:** Los productos pueden controlar inventario (`controla_stock = 1`) o no (`controla_stock = 0`). El endpoint de bajo stock solo retorna productos que controlan inventario.

5. **Precios:** El sistema soporta hasta 3 precios de venta diferentes más un precio mínimo, útil para diferentes tipos de clientes o promociones.

6. **IVA:** El porcentaje de IVA debe estar entre 0 y 100.

7. **Venta a Granel:** Para productos vendidos a granel, configure `venta_granel = 1` y defina `precio_granel`, `unidad_granel` y `equivalencia_granel`.

8. **Códigos de Barras:** Los códigos de barras deben ser únicos en el sistema.

## Estructura de Archivos

```
src/productos/
├── dto/
│   ├── create-producto.dto.ts    # DTO para crear productos
│   └── update-producto.dto.ts    # DTO para actualizar productos
├── entities/
│   └── producto.entity.ts        # Entidad TypeORM
├── productos.controller.ts       # Controlador con endpoints
├── productos.service.ts          # Lógica de negocio
├── productos.module.ts           # Módulo NestJS
├── productos.controller.spec.ts # Tests del controlador
└── productos.service.spec.ts    # Tests del servicio
```

## Próximas Funcionalidades

- [ ] Categorías de productos
- [ ] Imágenes de productos con upload
- [ ] Historial de cambios de precios
- [ ] Control de stock en tiempo real
- [ ] Productos compuestos o kits
- [ ] Descuentos por volumen
- [ ] Integración con código de barras generado automáticamente

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 9, 2025

