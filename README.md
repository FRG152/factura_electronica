# 🧾 Sistema de Facturación Electrónica

## 📋 Descripción General

Sistema de facturación electrónica desarrollado con React + TypeScript + Redux Toolkit para la gestión de documentos fiscales, clientes y configuración de emisores.

## 🛠️ Stack Tecnológico

### Frontend

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Redux Toolkit** - Estado global
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend

- **API REST** - [https://carlos-benitez.tecasispy.com](https://carlos-benitez.tecasispy.com)
- **Autenticación JWT** - Tokens de 24 horas
- **user_token** - Token de API para acceso directo

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd facturacion_electronica

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

Crear archivo `.env` basado en `env.example`:

```env
# API Configuration
VITE_API_URL_AUTH=https://carlos-benitez.tecasispy.com
VITE_API_URL=https://carlos-benitez.tecasispy.com

# Environment
VITE_NODE_ENV=development
```

## 🔐 Sistema de Autenticación

### Métodos Soportados

1. **JWT Token** - Para usuarios registrados
2. **user_token** - Token de API para acceso directo

### Endpoints de Autenticación

- `POST /users/register` - Registro de usuario
- `POST /users/login` - Login de usuario
- `POST /users/logout` - Logout
- `GET /users/validate` - Validar token

### Configuración del Proxy

El proyecto usa proxy de Vite para evitar problemas de CORS:

```typescript
// vite.config.ts
server: {
  proxy: {
    "/api": {
      target: "https://carlos-benitez.tecasispy.com",
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
}
```

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Servicios de API
│   ├── auth.ts            # Autenticación
│   ├── documentos.ts      # Gestión de documentos
│   ├── productos.ts       # Gestión de productos
│   └── index.ts           # Exports
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── Modals/           # Componentes modales
│   │   ├── ProductSearchModal.tsx    # Búsqueda de productos
│   │   ├── CustomerSearchModal.tsx   # Búsqueda de clientes
│   │   └── ConfirmInvoiceModal.tsx   # Confirmación de factura
│   ├── LoginForm.tsx     # Formulario de login
│   ├── ProductosList.tsx # Lista de productos
│   ├── ProductoForm.tsx  # Formulario de productos (con Select)
│   ├── ProtectedRoute.tsx # Ruta protegida
│   ├── Sidebar.tsx       # Barra lateral
│   ├── Input.tsx         # Input personalizado
│   └── Select.tsx        # Select personalizado
├── constants/            # Constantes
│   ├── invoice.ts       # Constantes de facturación
│   ├── sidebar.ts       # Configuración del sidebar
│   └── configuracion.ts # Configuración general
├── contexts/             # Contextos (DEPRECATED - Migrado a Redux)
├── hooks/                # Custom hooks
│   └── useConfiguracion.ts # Hook de configuración
├── interfaces/           # Tipos TypeScript
│   ├── index.ts         # Interfaces generales (facturas, clientes)
│   └── productos.ts     # Interfaces de productos
├── lib/                  # Librerías y utilidades compartidas
│   └── utils.ts         # Funciones de utilidad
│       ├── cn()         # Combinar clases Tailwind
│       ├── mapUnidadMedida() # Mapear unidades de medida
│       └── convertIvaToType() # Convertir IVA a tipo
├── pages/                # Páginas principales
│   ├── Login.tsx         # Página de login
│   ├── Dashboard.tsx     # Panel principal
│   ├── Invoice.tsx       # Lista de facturas
│   ├── GenerateInvoice.tsx # Crear factura (con modal de búsqueda)
│   ├── Productos.tsx     # Lista de productos
│   ├── CrearProducto.tsx # Crear producto
│   ├── EditarProducto.tsx # Editar producto
│   ├── Clients.tsx       # Gestión de clientes
│   └── Configuration.tsx # Configuración
├── schemas/              # Validaciones Zod
│   ├── auth/            # Esquemas de autenticación
│   │   └── login.ts     # Validación de login
│   ├── productos.ts     # Validaciones de productos
│   └── configuracion.ts # Validaciones de configuración
├── store/               # Redux Store
│   ├── slices/          # Redux slices
│   │   ├── authSlice.ts # Slice de autenticación
│   │   └── productosSlice.ts # Slice de productos
│   ├── hooks.ts         # Hooks tipados de Redux
│   └── index.ts         # Configuración del store
└── utils/               # Utilidades específicas
    ├── invoiceTransformer.ts # Transformar datos de factura
    └── pdfGenerator.ts      # Generar PDF de factura
```

## 🔄 Estado Global (Redux)

### Auth Slice

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Acciones Disponibles:**

- `loginUser` - Iniciar sesión
- `logoutUser` - Cerrar sesión
- `checkAuth` - Validar token al cargar
- `clearError` - Limpiar errores

### Productos Slice

```typescript
interface ProductosState {
  productos: Producto[];
  productoActual: Producto | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  searchQuery: string;
}
```

**Acciones Disponibles:**

- `fetchProductos` - Obtener todos los productos
- `fetchProductoPorId` - Obtener producto por ID
- `searchProductos` - Buscar productos
- `createProducto` - Crear nuevo producto
- `updateProducto` - Actualizar producto existente
- `deleteProducto` - Eliminar producto
- `clearError` - Limpiar errores
- `clearProductoActual` - Limpiar producto actual

### Uso en Componentes

```typescript
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";
import { fetchProductos, createProducto } from "../store/slices/productosSlice";

const dispatch = useAppDispatch();

// Auth
const { user, isAuthenticated, isLoading, error } = useAppSelector(
  (state) => state.auth
);
dispatch(loginUser({ username, password }));

// Productos
const { productos, isLoading } = useAppSelector((state) => state.productos);

// Listar productos
dispatch(fetchProductos());

// Buscar productos
dispatch(searchProductos({ search: "laptop" }));

// Crear producto
dispatch(
  createProducto({
    nombre: "Laptop HP",
    precio_compra: 1500000,
    precio_venta1: 2000000,
    iva: 19,
    unidad_medida: "UNI",
  })
);

// Actualizar producto
dispatch(
  updateProducto({
    id: 1,
    producto: {
      precio_venta1: 2100000,
    },
  })
);

// Eliminar producto
dispatch(deleteProducto(1));
```

## 📱 Páginas y Funcionalidades

### 🔑 Login

- Formulario con validación Zod
- Campos: username, password
- Manejo de errores
- Redirección automática después del login

### 📊 Dashboard

- Panel principal con estadísticas
- Acceso a todas las funcionalidades

### 🧾 Gestión de Facturas

- Listar documentos
- Crear nuevas facturas
- Filtros y búsqueda
- Generación de PDF

### 📦 Gestión de Productos

- **Lista completa de productos** con tabla responsive
- **Crear/editar productos** con formulario completo
- **Búsqueda avanzada** por nombre, descripción o código de barras
- **Modal de búsqueda** integrado en la generación de facturas
- **Unidades de medida estandarizadas** con Select (UNI, KG, L, M, M2, M3)
- **Múltiples precios de venta** (3 precios + precio mínimo)
- **Venta a granel** con equivalencias y unidades
- **Control de stock** opcional con alertas de mínimo
- **Códigos de barras** únicos
- **IVA configurable** (0-100%) con conversión automática
- **Imágenes** (URLs)
- **Eliminación con confirmación**
- **Selección rápida** desde modal en facturación
- **Conversión automática** de unidades y tipos de IVA

### 👥 Clientes

- **CRUD completo** de clientes con Redux
- **Soporte para personas físicas y jurídicas**
- **Búsqueda avanzada** por nombre, CI, RUC o email
- **Búsqueda en tiempo real** con debounce
- **Filtros** por tipo de persona y estado (activos/eliminados)
- **Paginación** de resultados
- **Soft delete y restauración** de clientes
- **Validaciones completas** (CI, RUC, email)
- **Modal de búsqueda** integrado en facturación
- **Normalización automática** de teléfonos
- **Multi-empresa** mediante empresa_id

### 🏢 Empresas

- **CRUD completo** de empresas
- **Datos de facturación** (timbrado, vigencia, establecimiento)
- **Activar/Desactivar** empresas
- **Logo y branding** de la empresa
- **Búsqueda** por razón social, RUC o nombre comercial
- **Filtros** por estado (activos/inactivos)
- **Paginación** de resultados
- **Sistema multi-empresa** preparado

### ⚙️ Configuración

- Configuración de emisor
- Gestión de certificados
- Configuración general

## 🔧 API Endpoints

### Documentos (Facturación Electrónica)

- `GET /generar-documento/listar` - Listar documentos con filtros y paginación
- `POST /generar-documento/crear` - Crear documento (factura electrónica)
  - Body: Estructura compatible con `final_structure.json`
  - Response: `{ success: boolean, message: string, documento: {...} }`
- `GET /documentos/:id` - Obtener documento
- `PATCH /documentos/:id` - Actualizar documento
- `DELETE /documentos/:id` - Eliminar documento

### Productos

- `GET /productos` - Listar todos los productos
- `POST /productos` - Crear producto
- `GET /productos/:id` - Obtener producto por ID
- `PATCH /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto
- `GET /productos?search={query}` - Buscar productos
- `GET /productos/codigo-barras/:codigo` - Buscar por código de barras
- `GET /productos/bajo-stock` - Productos con bajo stock

### Clientes

- `GET /clientes` - Listar clientes con paginación y filtros
  - Query params: `page`, `limit`, `search`, `empresa_id`, `tipo_persona`, `eliminado`
- `POST /clientes` - Crear cliente (persona física o jurídica)
- `GET /clientes/:id` - Obtener cliente por ID
- `PATCH /clientes/:id` - Actualizar cliente
- `DELETE /clientes/:id` - Eliminar cliente (soft delete)
- `PATCH /clientes/:id/restore` - Restaurar cliente eliminado
- `DELETE /clientes/:id/hard` - Eliminar cliente permanentemente
- `GET /clientes/empresa/:empresa_id` - Listar clientes por empresa

### Empresas

- `GET /empresas` - Listar empresas con paginación y filtros
  - Query params: `page`, `limit`, `search`, `activo`
- `POST /empresas` - Crear empresa
- `GET /empresas/:id` - Obtener empresa por ID
- `PATCH /empresas/:id` - Actualizar empresa
- `DELETE /empresas/:id` - Eliminar empresa
- `PATCH /empresas/:id/toggle-status` - Activar/desactivar empresa

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

## 🛠️ Funciones de Utilidad

### `lib/utils.ts`

#### `mapUnidadMedida(unidad?: string): string`

Convierte nombres de unidades de medida a códigos estándar.

```typescript
// Ejemplos de uso
mapUnidadMedida("Kilogramo"); // returns "KG"
mapUnidadMedida("Unidad"); // returns "UNI"
mapUnidadMedida("Metro cuadrado"); // returns "M2"
```

**Códigos soportados:**

- `UNI` - Unidad
- `KG` - Kilogramo
- `L` - Litro
- `M` - Metro
- `M2` - Metro cuadrado
- `M3` - Metro cúbico

#### `convertIvaToType(iva: number): "exentas" | "iva5" | "iva10"`

Convierte porcentaje de IVA a tipo de facturación.

```typescript
// Ejemplos de uso
convertIvaToType(0); // returns "exentas"
convertIvaToType(5); // returns "iva5"
convertIvaToType(10); // returns "iva10"
convertIvaToType(19); // returns "iva10"
```

**Uso en componentes:**

```typescript
import { mapUnidadMedida, convertIvaToType } from "@/lib/utils";

// En ProductSearchModal
const productData = {
  unidad: mapUnidadMedida(product.unidad_medida),
  tipoIva: convertIvaToType(product.iva),
  // ...
};

// En ProductoForm
unidad_medida: mapUnidadMedida(productoActual.unidad_medida);
```

## 🎨 UI/UX

### Componentes Base

- Sistema de diseño basado en shadcn/ui
- Componentes: Button, Input, Card, Dialog, Select, etc.
- Tema oscuro/claro (configurable)
- Modales con Dialog component

### Componentes Modales

#### ProductSearchModal

Modal de búsqueda de productos con:

- Búsqueda en tiempo real
- Filtrado por nombre, descripción y código de barras
- Vista de card con información completa
- Selección con un clic
- Integración con generación de facturas

```typescript
<ProductSearchModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSelectProduct={(product) => {
    // product se agrega automáticamente a la factura
    setItems([...items, product]);
  }}
/>
```

#### CustomerSearchModal

Modal de búsqueda de clientes (por implementar completamente)

#### ConfirmInvoiceModal

Modal de confirmación antes de emitir factura con:

- Resumen de datos del cliente
- Resumen de items
- Totales calculados
- Confirmación de emisión

### Responsive Design

- Mobile-first approach
- Breakpoints de Tailwind CSS
- Sidebar colapsible
- Tablas responsive con scroll horizontal
- Modales adaptables a diferentes tamaños de pantalla

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter
npm run type-check   # Verificación de tipos
```

## 🔒 Seguridad

### Autenticación

- Tokens JWT con expiración de 24 horas
- Validación de tokens en cada request
- Logout automático en caso de token inválido

### Almacenamiento

- Tokens en localStorage
- Datos sensibles no se almacenan en el estado global

## 🚨 Manejo de Errores

### Tipos de Errores

- **401 Unauthorized** - Token expirado/inválido
- **400 Bad Request** - Datos inválidos
- **409 Conflict** - Usuario/email ya existe
- **500 Internal Server Error** - Error del servidor

### Manejo en Frontend

- Redux maneja errores globalmente
- Componentes muestran mensajes específicos
- Fallbacks para errores de red

## 📝 Changelog

### v2.5.0 - Módulo de Empresas y Sistema Multi-Empresa

- ✅ **Módulo completo de empresas** con Redux
- ✅ **CRUD completo** de empresas
- ✅ **Datos de facturación** (timbrado, establecimiento, punto expedición)
- ✅ **Activar/desactivar** empresas
- ✅ **Búsqueda y filtros** avanzados
- ✅ **Validaciones** de RUC con dígito verificador
- ✅ **Logo y website** configurables
- ✅ **Sistema multi-empresa** preparado para segregación de datos
- ✅ **Interfaz completa** con gestión de estado visual

### v2.4.0 - Módulo Completo de Clientes

- ✅ **API completa de clientes** integrada con Redux
- ✅ **CRUD completo** con validaciones
- ✅ **Soporte personas físicas y jurídicas**
- ✅ **Búsqueda en tiempo real** con debounce (300ms)
- ✅ **Filtros avanzados** por tipo y estado
- ✅ **Paginación** con navegación
- ✅ **Soft delete y restauración** de clientes
- ✅ **Modal de búsqueda mejorado** con integración en facturación
- ✅ **Validaciones completas** (CI, RUC, email)
- ✅ **Normalización automática** de teléfonos
- ✅ **Interfaz moderna** con badges y estados visuales

### v2.3.0 - Integración Completa de Facturación Electrónica

- ✅ **Envío real de facturas** a la API backend
- ✅ **Transformación automática** de datos al formato requerido por la API
- ✅ **Notificaciones toast** con sonner para éxito/error
- ✅ **Estado de carga** durante el envío de facturas
- ✅ **Mapeo correcto de IVA** según estándares de facturación electrónica
- ✅ **Estructura completa** compatible con final_structure.json
- ✅ **Manejo robusto de errores** con mensajes descriptivos
- ✅ **Logs detallados** para debugging y auditoría

### v2.2.0 - Mejoras de Productos e Integración

- ✅ **Modal de búsqueda de productos** en facturación
- ✅ **Funciones de utilidad centralizadas** (`mapUnidadMedida`, `convertIvaToType`)
- ✅ **Select de unidades de medida** en formulario de productos
- ✅ **Integración completa** entre búsqueda de productos y generación de facturas
- ✅ **Conversión automática** de datos al seleccionar productos
- ✅ **Código DRY** (Don't Repeat Yourself) - sin duplicación
- ✅ **Documentación JSDoc** en funciones de utilidad
- ✅ **Mapeo inteligente** de unidades legacy a códigos estándar
- ✅ **UI mejorada** con mejores efectos visuales en modales

### v2.1.0 - Módulo de Productos

- ✅ **Módulo completo de productos** implementado
- ✅ **CRUD completo** (Crear, Leer, Actualizar, Eliminar)
- ✅ **Búsqueda avanzada** por nombre, descripción y código de barras
- ✅ **Múltiples precios** de venta y control de stock
- ✅ **Venta a granel** con equivalencias
- ✅ **Formularios completos** con validación Zod
- ✅ **UI moderna** con tabla responsive
- ✅ **Integración completa** con Redux Toolkit

### v2.0.0 - Migración a Redux Toolkit

- ✅ Migrado de Context API a Redux Toolkit
- ✅ Implementado authSlice con createAsyncThunk
- ✅ Hooks tipados para Redux
- ✅ Mejor manejo de estado asíncrono

### v1.0.0 - Versión Inicial

- ✅ Sistema de autenticación dual (JWT + user_token)
- ✅ Gestión de documentos
- ✅ Interfaz de usuario completa
- ✅ Integración con API backend

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:

- Crear issue en el repositorio
- Documentar el problema con logs y pasos para reproducir

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).

---

**Última actualización**: Octubre 11, 2025  
**Versión**: 2.5.0  
**Estado**: En desarrollo activo

## 📚 Documentación Adicional

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Documentación completa de autenticación
- **[PRODUCTOS.md](./PRODUCTOS.md)** - Documentación completa del módulo de productos
- **[FACTURACION.md](./FACTURACION.md)** - Documentación completa de facturación electrónica
- **[README-API.md](./README-API.md)** - API de clientes - Guía completa

## 🎯 Características Destacadas v2.5.0

### 🏢 Módulo de Empresas - Sistema Multi-Empresa

El sistema ahora incluye gestión completa de empresas:

- **Datos de la empresa**:
  - Razón Social y Nombre Comercial
  - RUC con dígito verificador
  - Contacto: dirección, teléfono, email, website
  - Logo de la empresa
- **Datos de facturación**:
  - Timbrado con vigencia
  - Establecimiento y punto de expedición
- **Gestión de estados**:
  - Activar/Desactivar empresas
  - Filtros por estado
- **Sistema multi-empresa**: Preparado para segregar datos por empresa
- **Búsqueda**: Por razón social, RUC o nombre comercial

#### Estructura de Empresa

```typescript
interface Empresa {
  id: number;
  razon_social: string;
  nombre_comercial?: string;
  ruc: string;
  dv: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  activo: number;
  timbrado?: string;
  vigencia_desde?: string;
  vigencia_hasta?: string;
  establecimiento?: string;
  punto_expedicion?: string;
}
```

### 👥 Módulo Completo de Clientes

El sistema ahora cuenta con un módulo completo de gestión de clientes:

- **Tipos de clientes**:
  - Persona Física: Requiere CI, opcionalmente RUC
  - Persona Jurídica: Requiere RUC obligatorio
- **Búsqueda inteligente**: Busca por nombre, CI, RUC o email en tiempo real
- **Filtros múltiples**: Por tipo de persona y estado (activos/eliminados)
- **Soft delete**: Los clientes eliminados pueden ser restaurados
- **Validaciones**: CI (8 dígitos), RUC (formato 80012345-6), email
- **Modal integrado**: Búsqueda rápida de clientes en la generación de facturas
- **Paginación**: Navegación eficiente de grandes listas
- **Multi-empresa**: Soporte para múltiples empresas con `empresa_id`

#### Estructura de Cliente

```typescript
interface Cliente {
  id: number;
  nombre: string;
  tipo_persona: "fisica" | "juridica";
  ci?: string;
  fecha_nacimiento?: string;
  tiene_ruc: number;
  ruc?: string;
  telefono?: string;
  pais_telefono: string;
  telefono_normalizado?: string;
  telefono_whatsapp?: string;
  direccion?: string;
  email?: string;
  eliminado: number;
  empresa_id?: number;
}
```

## 🎯 Características Destacadas v2.3.0

### 📄 Sistema de Facturación Electrónica Completo

El sistema ahora cuenta con facturación electrónica totalmente funcional:

- **Transformación automática** de datos del formulario al formato de la API
- **Estructura compatible** con estándares de facturación electrónica paraguaya
- **Envío en tiempo real** a la API backend
- **Validación completa** de datos antes de enviar
- **Notificaciones visuales** con toast para éxito/error
- **Logs detallados** para debugging y auditoría
- **Mapeo inteligente** de códigos IVA y unidades de medida
- **Manejo robusto de errores** con mensajes descriptivos

#### Formato de Estructura Final

El sistema envía las facturas en el formato estándar definido en `final_structure.json`:

```json
{
  "tipoDocumento": 1,
  "establecimiento": "001",
  "punto": "001",
  "numero": 10,
  "cliente": { ... },
  "items": [ ... ],
  "condicion": { ... }
}
```

Ver **[FACTURACION.md](./FACTURACION.md)** para documentación completa del formato y transformación.

## 🎯 Características Destacadas v2.2.0

### 🔍 Modal de Búsqueda de Productos

El nuevo modal de búsqueda permite:

- **Búsqueda en tiempo real** por nombre, descripción o código de barras
- **Selección rápida** con un clic
- **Vista previa** de información completa del producto
- **Integración directa** con generación de facturas
- **Conversión automática** de formatos de datos

### 🧰 Funciones de Utilidad Compartidas

```typescript
// lib/utils.ts
import { mapUnidadMedida, convertIvaToType } from "@/lib/utils";

// Convertir unidades de medida
const codigoUnidad = mapUnidadMedida("Kilogramo"); // "KG"

// Convertir porcentaje IVA a tipo
const tipoIva = convertIvaToType(19); // "iva10"
```

### 📝 Formulario de Productos Mejorado

- **Select de unidades** en lugar de input libre
- **Validación mejorada** con opciones predefinidas
- **Consistencia de datos** garantizada
- **Mapeo automático** de valores legacy

### 🔄 Flujo de Facturación Completo

1. **Usuario inicia factura**: Accede a "Generar Factura"
2. **Selecciona cliente**: Búsqueda y selección mediante modal
3. **Agrega productos**:
   - Opción 1: Manual mediante "Agregar Producto"
   - Opción 2: Búsqueda rápida con "Buscar Producto" (modal)
4. **Revisa totales**: Cálculos automáticos de IVA y totales
5. **Emite factura**: Clic en "Emitir Factura"
6. **Confirma datos**: Modal de confirmación con resumen
7. **Envío a API**:
   - Transformación automática al formato `final_structure.json`
   - Envío mediante `POST /generar-documento/crear`
   - Estado de carga visual
8. **Resultado**:
   - ✅ Éxito: Toast verde con número de documento
   - ❌ Error: Toast rojo con mensaje descriptivo
9. **Limpieza**: Formulario se resetea automáticamente tras éxito

## 🏗️ Arquitectura y Mejores Prácticas

### Principios Aplicados

- **DRY (Don't Repeat Yourself)**: Funciones centralizadas sin duplicación
- **Single Responsibility**: Cada componente tiene una responsabilidad clara
- **Type Safety**: TypeScript en todo el proyecto
- **Separation of Concerns**: UI, lógica y datos separados
- **Reusabilidad**: Componentes y funciones reutilizables

### Patrones de Diseño

- **Redux Toolkit** para estado global
- **Custom Hooks** para lógica reutilizable
- **Compound Components** para componentes complejos
- **Utility Functions** para operaciones comunes
- **Modal Pattern** para diálogos y confirmaciones
