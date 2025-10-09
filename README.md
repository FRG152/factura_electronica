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
│   ├── LoginForm.tsx     # Formulario de login
│   ├── ProductosList.tsx # Lista de productos
│   ├── ProductoForm.tsx  # Formulario de productos
│   ├── ProtectedRoute.tsx # Ruta protegida
│   └── Sidebar.tsx       # Barra lateral
├── contexts/             # Contextos (DEPRECATED - Migrado a Redux)
├── hooks/                # Custom hooks
├── interfaces/           # Tipos TypeScript
│   ├── index.ts         # Interfaces generales
│   └── productos.ts     # Interfaces de productos
├── pages/                # Páginas principales
│   ├── Login.tsx         # Página de login
│   ├── Dashboard.tsx     # Panel principal
│   ├── Invoice.tsx       # Lista de facturas
│   ├── GenerateInvoice.tsx # Crear factura
│   ├── Productos.tsx     # Lista de productos
│   ├── CrearProducto.tsx # Crear producto
│   ├── EditarProducto.tsx # Editar producto
│   ├── Clients.tsx       # Gestión de clientes
│   └── Configuration.tsx # Configuración
├── schemas/              # Validaciones Zod
│   ├── auth/            # Esquemas de autenticación
│   └── productos.ts     # Validaciones de productos
├── store/               # Redux Store
│   ├── slices/          # Redux slices
│   │   ├── authSlice.ts # Slice de autenticación
│   │   └── productosSlice.ts # Slice de productos
│   ├── hooks.ts         # Hooks tipados de Redux
│   └── index.ts         # Configuración del store
├── utils/               # Utilidades
└── constants/           # Constantes
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

### Acciones Disponibles

- `loginUser` - Iniciar sesión
- `logoutUser` - Cerrar sesión
- `checkAuth` - Validar token al cargar
- `clearError` - Limpiar errores

### Uso en Componentes

```typescript
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";

const dispatch = useAppDispatch();
const { user, isAuthenticated, isLoading, error } = useAppSelector(
  (state) => state.auth
);

// Login
dispatch(loginUser({ username, password }));

// Productos
dispatch(fetchProductos());
dispatch(searchProductos({ search: "laptop" }));
dispatch(
  createProducto({
    nombre: "Laptop HP",
    precio_compra: 1500000,
    precio_venta1: 2000000,
    iva: 19,
  })
);
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
- **Múltiples precios de venta** (3 precios + precio mínimo)
- **Venta a granel** con equivalencias y unidades
- **Control de stock** opcional con alertas de mínimo
- **Códigos de barras** únicos
- **IVA configurable** (0-100%)
- **Imágenes** (URLs)
- **Eliminación con confirmación**

### 👥 Clientes

- Lista de clientes
- Crear/editar clientes
- Búsqueda y filtros

### ⚙️ Configuración

- Configuración de emisor
- Gestión de certificados
- Configuración general

## 🔧 API Endpoints

### Documentos

- `GET /documentos` - Listar documentos
- `POST /documentos` - Crear documento
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

## 🎨 UI/UX

### Componentes Base

- Sistema de diseño basado en shadcn/ui
- Componentes: Button, Input, Card, Dialog, etc.
- Tema oscuro/claro (configurable)

### Responsive Design

- Mobile-first approach
- Breakpoints de Tailwind CSS
- Sidebar colapsible

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

**Última actualización**: $(date)
**Versión**: 2.1.0
**Estado**: En desarrollo activo

## 📚 Documentación Adicional

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Documentación completa de autenticación
- **[PRODUCTOS.md](./PRODUCTOS.md)** - Documentación completa del módulo de productos
