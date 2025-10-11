# 📄 Documentación de Facturación Electrónica

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Estructura de la Factura](#estructura-de-la-factura)
- [Transformación de Datos](#transformación-de-datos)
- [Mapeo de Campos](#mapeo-de-campos)
- [Códigos y Estándares](#códigos-y-estándares)
- [Flujo de Emisión](#flujo-de-emisión)
- [Ejemplos](#ejemplos)

## 🎯 Introducción

Este documento describe el formato de las facturas electrónicas y cómo el sistema transforma los datos del formulario al formato requerido por la API de facturación electrónica paraguaya.

## 📦 Estructura de la Factura

La estructura completa de una factura electrónica sigue el estándar definido en `final_structure.json`:

```json
{
  "tipoDocumento": 1,
  "establecimiento": "001",
  "punto": "001",
  "numero": 10,
  "codigoSeguridadAleatorio": "960847",
  "descripcion": "Factura electrónica",
  "observacion": "",
  "fecha": "2025-09-11T16:59:20",
  "tipoEmision": 1,
  "tipoTransaccion": 2,
  "tipoImpuesto": 1,
  "moneda": "PYG",
  "condicionAnticipo": 0,
  "condicionTipoCambio": 0,
  "descuentoGlobal": 0,
  "anticipoGlobal": 0,
  "cambio": "",
  "factura": { ... },
  "cliente": { ... },
  "usuario": { ... },
  "condicion": { ... },
  "items": [ ... ]
}
```

### Campos Principales

| Campo                      | Tipo   | Descripción                      | Ejemplo                 |
| -------------------------- | ------ | -------------------------------- | ----------------------- |
| `tipoDocumento`            | number | Tipo de documento fiscal         | `1` = Factura           |
| `establecimiento`          | string | Código del establecimiento       | `"001"`                 |
| `punto`                    | string | Punto de expedición              | `"001"`                 |
| `numero`                   | number | Número correlativo de documento  | `10`                    |
| `codigoSeguridadAleatorio` | string | Código de seguridad de 6 dígitos | `"960847"`              |
| `descripcion`              | string | Descripción del documento        | `"Factura electrónica"` |
| `fecha`                    | string | Fecha de emisión (ISO 8601)      | `"2025-09-11T16:59:20"` |
| `tipoEmision`              | number | Tipo de emisión                  | `1` = Normal            |
| `tipoTransaccion`          | number | Tipo de transacción              | `2` = Venta de bienes   |
| `tipoImpuesto`             | number | Tipo de impuesto                 | `1` = IVA               |
| `moneda`                   | string | Código de moneda ISO 4217        | `"PYG"`                 |

## 🔄 Transformación de Datos

El sistema utiliza la función `transformToCompleteInvoiceStructure()` en `src/utils/invoiceTransformer.ts` para convertir los datos del formulario al formato de la API.

### Flujo de Transformación

```
Formulario (UI)
    ↓
FacturaData (Interface interna)
    ↓
transformToCompleteInvoiceStructure()
    ↓
CompleteInvoiceStructure (API Format)
    ↓
API Backend
```

### Datos de Entrada (FacturaData)

```typescript
interface FacturaData {
  cliente: Client | null;
  condicionPago: string;
  items: InvoiceItem[];
  totales: {
    cantidadTotal: number;
    subtotalExentas: number;
    subtotal5: number;
    subtotal10: number;
    totalVenta: number;
    totalIva: number;
  };
}
```

### Datos de Salida (CompleteInvoiceStructure)

Estructura completa compatible con la API, ver `final_structure.json`.

## 🗺️ Mapeo de Campos

### Cliente

| Campo Formulario    | Campo API             | Transformación |
| ------------------- | --------------------- | -------------- |
| `cliente.nombre`    | `razonSocial`         | Directo        |
| `cliente.ruc`       | `ruc`                 | Directo        |
| `cliente.ruc`       | `documentoNumero`     | Solo dígitos   |
| `cliente.direccion` | `direccion`           | Directo        |
| `cliente.telefono`  | `telefono`, `celular` | Directo        |
| `cliente.email`     | `email`               | Directo        |

### Items (Productos)

| Campo Formulario   | Campo API        | Transformación          |
| ------------------ | ---------------- | ----------------------- |
| `item.codigo`      | `codigo`         | Directo                 |
| `item.descripcion` | `descripcion`    | Directo                 |
| `item.unidad`      | `unidadMedida`   | Mapeo a código numérico |
| `item.cantidad`    | `cantidad`       | Directo                 |
| `item.precio`      | `precioUnitario` | Directo                 |
| `item.tipoIva`     | `ivaTipo`        | Mapeo a código numérico |
| `item.tipoIva`     | `iva`            | Conversión a porcentaje |

## 📊 Códigos y Estándares

### Unidades de Medida

El sistema mapea las unidades de medida a códigos numéricos estándar:

| Código | Valor Numérico | Descripción    |
| ------ | -------------- | -------------- |
| `UNI`  | 77             | Unidad         |
| `KG`   | 78             | Kilogramo      |
| `L`    | 79             | Litro          |
| `M`    | 80             | Metro          |
| `M2`   | 81             | Metro cuadrado |
| `M3`   | 82             | Metro cúbico   |

```typescript
function getUnidadMedidaCode(unidad: string): number {
  const unidadMap: { [key: string]: number } = {
    UNI: 77,
    KG: 78,
    L: 79,
    M: 80,
    M2: 81,
    M3: 82,
  };
  return unidadMap[unidad] || 77;
}
```

### Tipos de IVA

El sistema mapea los tipos de IVA según los estándares de facturación electrónica:

| Tipo String | Código Numérico | Porcentaje | Descripción   |
| ----------- | --------------- | ---------- | ------------- |
| `exentas`   | 3               | 0%         | Exento de IVA |
| `iva5`      | 2               | 5%         | IVA reducido  |
| `iva10`     | 1               | 10%        | IVA general   |

```typescript
function getIvaTipoCode(tipoIva: string): number {
  const ivaMap: { [key: string]: number } = {
    exentas: 3,
    iva5: 2,
    iva10: 1,
  };
  return ivaMap[tipoIva] || 1;
}

function getIvaPercentage(tipoIva: string): number {
  const ivaMap: { [key: string]: number } = {
    exentas: 0,
    iva5: 5,
    iva10: 10,
  };
  return ivaMap[tipoIva] || 10;
}
```

### Condición de Pago

| Tipo    | Código | Descripción     |
| ------- | ------ | --------------- |
| Contado | 1      | Pago al contado |
| Crédito | 2      | Pago a crédito  |

```typescript
condicion: {
  tipo: 1,
  entregas: [
    {
      tipo: 1,
      monto: totalVenta,
      moneda: "PYG",
      cambio: 0
    }
  ]
}
```

## 🔄 Flujo de Emisión

### 1. Captura de Datos

El usuario completa el formulario en `GenerateInvoice.tsx`:

- Selecciona cliente
- Agrega productos
- Revisa totales

### 2. Validación

Antes de emitir, se valida:

- ✅ Cliente seleccionado
- ✅ Al menos un producto agregado
- ✅ Cantidades y precios válidos

### 3. Confirmación

Modal de confirmación muestra:

- Resumen de cliente
- Lista de productos
- Totales calculados

### 4. Transformación

```typescript
const completeInvoiceStructure = transformToCompleteInvoiceStructure(
  facturaData,
  {
    tipoDocumento: 1,
    establecimiento: "001",
    punto: "001",
    numero: 10,
    codigoSeguridadAleatorio: generateRandomCode(),
    descripcion: "Factura electrónica",
    fecha: new Date().toISOString(),
    // ... otros campos
  }
);
```

### 5. Envío a API

```typescript
const response = await crearDocumento(completeInvoiceStructure);
```

### 6. Respuesta

```typescript
interface CrearDocumentoResponse {
  success: boolean;
  message: string;
  documento?: {
    id: number;
    numeroDocumento: string;
    cdc: string;
    estado: string;
  };
}
```

### 7. Notificación

- ✅ **Éxito**: Toast verde con número de documento
- ❌ **Error**: Toast rojo con mensaje de error

## 📝 Ejemplos

### Ejemplo Completo de Factura

```json
{
  "tipoDocumento": 1,
  "establecimiento": "001",
  "punto": "001",
  "numero": 10,
  "codigoSeguridadAleatorio": "960847",
  "descripcion": "Factura electrónica",
  "observacion": "",
  "fecha": "2025-09-11T16:59:20",
  "tipoEmision": 1,
  "tipoTransaccion": 2,
  "tipoImpuesto": 1,
  "moneda": "PYG",
  "condicionAnticipo": 0,
  "condicionTipoCambio": 0,
  "descuentoGlobal": 0,
  "anticipoGlobal": 0,
  "cambio": "",
  "factura": {
    "presencia": 1,
    "fecha": "2025-09-11T16:59:20"
  },
  "cliente": {
    "contribuyente": true,
    "razonSocial": "Rosmary Brunaga",
    "tipoOperacion": 1,
    "tipoContribuyente": 2,
    "direccion": "",
    "numeroCasa": "0",
    "departamento": 11,
    "departamentoDescripcion": "ALTO PARANA",
    "distrito": 173,
    "distritoDescripcion": "CIUDAD DEL ESTE",
    "ciudad": 4278,
    "ciudadDescripcion": "CIUDAD DEL ESTE",
    "pais": "PRY",
    "paisDescripcion": "Paraguay",
    "telefono": "",
    "celular": "",
    "email": "",
    "codigo": "026",
    "ruc": "4155258-0",
    "documentoTipo": 1,
    "documentoNumero": "4155258"
  },
  "usuario": {
    "documentoTipo": 1,
    "documentoNumero": "157264",
    "nombre": "Juan Pérez",
    "cargo": "Vendedor"
  },
  "condicion": {
    "tipo": 1,
    "entregas": [
      {
        "tipo": 1,
        "monto": 100000,
        "moneda": "PYG",
        "cambio": 0
      }
    ]
  },
  "items": [
    {
      "codigo": "15253621",
      "descripcion": "Servicios profesionales",
      "observacion": "",
      "unidadMedida": 77,
      "cantidad": 1,
      "precioUnitario": 100000,
      "cambio": 0,
      "descuento": 0,
      "anticipo": 0,
      "pais": "PRY",
      "paisDescripcion": "Paraguay",
      "ivaTipo": 1,
      "ivaBase": 100,
      "iva": 10
    }
  ]
}
```

### Ejemplo de Uso en Código

```typescript
// En GenerateInvoice.tsx

// 1. Preparar datos
const facturaData: FacturaData = {
  cliente,
  condicionPago,
  items,
  totales: {
    cantidadTotal,
    subtotalExentas,
    subtotal5,
    subtotal10,
    totalVenta,
    totalIva,
  },
};

// 2. Transformar
const completeInvoiceStructure = transformToCompleteInvoiceStructure(
  facturaData,
  {
    tipoDocumento: 1,
    establecimiento: "001",
    punto: "001",
    numero: 10,
    codigoSeguridadAleatorio: Math.floor(
      100000 + Math.random() * 900000
    ).toString(),
    descripcion: "Factura electrónica",
    fecha: new Date().toISOString(),
    tipoEmision: 1,
    tipoTransaccion: 2,
    tipoImpuesto: 1,
    moneda: "PYG",
    condicionAnticipo: 0,
    condicionTipoCambio: 0,
    descuentoGlobal: 0,
    anticipoGlobal: 0,
    cambio: "",
  }
);

// 3. Enviar
const response = await crearDocumento(completeInvoiceStructure);

// 4. Manejar respuesta
if (response.success) {
  toast.success("Factura emitida correctamente", {
    description: `Número de documento: ${response.documento?.numeroDocumento}`,
  });
} else {
  toast.error("Error al emitir la factura", {
    description: response.message,
  });
}
```

## 🔍 Debugging

### Logs de Consola

El sistema registra automáticamente:

```typescript
console.log("=== ESTRUCTURA COMPLETA DE LA FACTURA ===");
console.log(JSON.stringify(completeInvoiceStructure, null, 2));
console.log("==========================================");

console.log("=== RESPUESTA DE LA API ===");
console.log(JSON.stringify(response, null, 2));
console.log("===========================");
```

### Verificar Transformación

Para verificar que la transformación es correcta:

1. Abrir DevTools (F12)
2. Ir a la pestaña Console
3. Emitir una factura de prueba
4. Revisar los logs de "ESTRUCTURA COMPLETA"
5. Comparar con `final_structure.json`

## 🚨 Errores Comunes

### Error: "Cliente es requerido"

**Causa**: No se seleccionó un cliente antes de emitir.  
**Solución**: Usar el modal de búsqueda de clientes para seleccionar uno.

### Error: "Debe agregar al menos un ítem"

**Causa**: La factura no tiene productos.  
**Solución**: Agregar al menos un producto a la factura.

### Error 401: "Unauthorized"

**Causa**: Token de autenticación expirado o inválido.  
**Solución**: Cerrar sesión y volver a iniciar sesión.

### Error 400: "Bad Request"

**Causa**: Datos de la factura inválidos o incompletos.  
**Solución**: Revisar los logs de consola para identificar el campo problemático.

## 📚 Referencias

- **API Backend**: https://carlos-benitez.tecasispy.com
- **Estructura de referencia**: `final_structure.json`
- **Transformer**: `src/utils/invoiceTransformer.ts`
- **Interfaces**: `src/interfaces/index.ts`
- **Componente principal**: `src/pages/GenerateInvoice.tsx`

## 🔐 Seguridad

### Código de Seguridad Aleatorio

Se genera un código de 6 dígitos aleatorio para cada factura:

```typescript
Math.floor(100000 + Math.random() * 900000).toString();
```

### Autenticación

Todas las peticiones a la API incluyen el token JWT:

```typescript
headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
}
```

## 📈 Mejoras Futuras

- [ ] Configuración de establecimiento y punto de expedición
- [ ] Numeración automática de documentos
- [ ] Soporte para múltiples condiciones de pago
- [ ] Descuentos y anticipos
- [ ] Integración con catálogo de productos
- [ ] Historial de facturas emitidas
- [ ] Exportación de facturas a PDF
- [ ] Reimpresión de facturas

---

**Última actualización**: Octubre 11, 2025  
**Versión**: 2.5.0
