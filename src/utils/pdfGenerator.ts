import jsPDF from "jspdf";

export interface FacturaData {
  emisor: {
    nombre: string;
    ruc: string;
    dv: string;
    direccion: string;
    telefono: string;
    email: string;
    departamento: string;
    ciudad: string;
    actividad: string;
  };
  receptor: {
    nombre: string;
    ruc: string;
    dv: string;
    codigo_cliente?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
  };
  documento: {
    timbrado: string;
    establecimiento: string;
    punto_expedicion: string;
    numero: string;
    fecha_vigencia: string;
    fecha_emision: string;
    cdc: string;
    condicion: string;
    tipo_transaccion: string;
    moneda: string;
    tipo_cambio: string;
  };
  items: Array<{
    codigo: string;
    descripcion: string;
    cantidad: number;
    precio_unitario: number;
    total: number;
    unidad: string;
    tasa_iva: number;
  }>;
  totales: {
    exentas: number;
    gravadas_5: number;
    gravadas_10: number;
    iva_5: number;
    iva_10: number;
    total_iva: number;
    total_operacion: number;
  };
}

export function generarPDFFactura(data: FacturaData): void {
  const doc = new jsPDF();

  // Configuración de fuentes y colores
  const primaryColor = "#2c3e50";
  const secondaryColor = "#34495e";
  const lightGray = "#ecf0f1";

  // Función para formatear números
  const formatNum = (num: number): string => {
    return num.toLocaleString("es-PY");
  };

  // Función para formatear fechas
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("es-PY") + " " + date.toLocaleTimeString("es-PY")
    );
  };

  let yPosition = 20;

  // Título del documento
  doc.setFillColor(44, 62, 80);
  doc.rect(10, yPosition, 190, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("KuDE de FACTURA ELECTRONICA", 105, yPosition + 10, {
    align: "center",
  });

  yPosition += 25;

  // Título de la empresa
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.emisor.nombre, 20, yPosition);

  yPosition += 10;

  // Información de la empresa
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Actividad: ${data.emisor.actividad}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Dirección: ${data.emisor.direccion}`, 20, yPosition);
  yPosition += 5;
  doc.text(
    `Ciudad: ${data.emisor.ciudad} - ${data.emisor.departamento} - PARAGUAY`,
    20,
    yPosition
  );
  yPosition += 5;
  doc.text(`Teléfono: ${data.emisor.telefono}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Correo: ${data.emisor.email}`, 20, yPosition);

  yPosition += 10;

  // Información del documento (lado derecho)
  const rightX = 120;
  doc.setFillColor(236, 240, 241);
  doc.rect(rightX, yPosition - 15, 80, 40, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`RUC: ${data.emisor.ruc}-${data.emisor.dv}`, rightX + 5, yPosition);
  yPosition += 5;
  doc.text(`Timbrado N°: ${data.documento.timbrado}`, rightX + 5, yPosition);
  yPosition += 5;
  doc.text(
    `Inicio de vigencia: ${formatDate(data.documento.fecha_vigencia)}`,
    rightX + 5,
    yPosition
  );
  yPosition += 10;

  // Número de factura
  doc.setFillColor(90, 108, 125);
  doc.rect(rightX + 5, yPosition, 70, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Factura Electrónica", rightX + 40, yPosition + 8, {
    align: "center",
  });
  doc.text(
    `${data.documento.establecimiento}-${data.documento.punto_expedicion}-${data.documento.numero}`,
    rightX + 40,
    yPosition + 15,
    { align: "center" }
  );

  yPosition += 30;

  // Información de emisión
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Información de Emisión:", 20, yPosition);
  yPosition += 5;
  doc.text(
    `Fecha y hora de emisión: ${formatDate(data.documento.fecha_emision)}`,
    20,
    yPosition
  );
  yPosition += 5;
  doc.text(`Condición de venta: ${data.documento.condicion}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Moneda: ${data.documento.moneda}`, 20, yPosition);

  yPosition += 15;

  // Datos del cliente
  doc.text("Datos del Cliente:", 20, yPosition);
  yPosition += 5;
  doc.text(`Nombre o Razón Social: ${data.receptor.nombre}`, 20, yPosition);
  yPosition += 5;
  doc.text(
    `RUC/Documento: ${data.receptor.ruc}-${data.receptor.dv}`,
    20,
    yPosition
  );
  if (data.receptor.email) {
    yPosition += 5;
    doc.text(`Correo: ${data.receptor.email}`, 20, yPosition);
  }
  if (data.receptor.direccion) {
    yPosition += 5;
    doc.text(`Dirección: ${data.receptor.direccion}`, 20, yPosition);
  }
  if (data.receptor.telefono) {
    yPosition += 5;
    doc.text(`Teléfono: ${data.receptor.telefono}`, 20, yPosition);
  }
  if (data.receptor.codigo_cliente) {
    yPosition += 5;
    doc.text(`Código Cliente: ${data.receptor.codigo_cliente}`, 20, yPosition);
  }

  yPosition += 20;

  // Tabla de productos
  const tableTop = yPosition;
  const tableLeft = 20;
  const colWidths = [20, 60, 20, 25, 25, 25, 25];

  // Encabezados de tabla
  doc.setFillColor(52, 73, 94);
  doc.rect(tableLeft, tableTop, 200, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  const headers = [
    "Código",
    "Descripción",
    "Cantidad",
    "Precio",
    "Exentas",
    "5%",
    "10%",
  ];
  let xPos = tableLeft + 2;
  headers.forEach((header, index) => {
    doc.text(header, xPos, tableTop + 7);
    xPos += colWidths[index];
  });

  yPosition += 15;

  // Filas de productos
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  data.items.forEach((item, index) => {
    const exentas = item.tasa_iva === 0 ? formatNum(item.total) : "0";
    const grav5 = item.tasa_iva === 5 ? formatNum(item.total) : "0";
    const grav10 = item.tasa_iva === 10 ? formatNum(item.total) : "0";

    xPos = tableLeft + 2;
    const rowData = [
      item.codigo,
      item.descripcion,
      formatNum(item.cantidad),
      formatNum(item.precio_unitario),
      exentas,
      grav5,
      grav10,
    ];

    rowData.forEach((cell, cellIndex) => {
      doc.text(cell, xPos, yPosition);
      xPos += colWidths[cellIndex];
    });

    yPosition += 8;
  });

  yPosition += 10;

  // Totales
  doc.setFillColor(236, 240, 241);
  doc.rect(tableLeft, yPosition, 200, 8, "F");
  doc.setFont("helvetica", "bold");

  xPos = tableLeft + 2;
  const totalData = [
    "Subtotal:",
    "",
    "",
    "",
    formatNum(data.totales.exentas),
    formatNum(data.totales.gravadas_5),
    formatNum(data.totales.gravadas_10),
  ];

  totalData.forEach((cell, cellIndex) => {
    doc.text(cell, xPos, yPosition + 6);
    xPos += colWidths[cellIndex];
  });

  yPosition += 15;

  // Total final
  doc.setFillColor(90, 108, 125);
  doc.rect(tableLeft, yPosition, 200, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(
    `Total a Pagar: ${formatNum(data.totales.total_operacion)}`,
    tableLeft + 100,
    yPosition + 7,
    { align: "center" }
  );

  yPosition += 20;

  // Liquidación de IVA
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(149, 165, 166);
  doc.rect(20, yPosition, 180, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Liquidación IVA: (5%) ${formatNum(data.totales.iva_5)} | (10%) ${formatNum(
      data.totales.iva_10
    )} | Total IVA: ${formatNum(data.totales.total_iva)}`,
    110,
    yPosition + 10,
    { align: "center" }
  );

  yPosition += 25;

  // CDC
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(236, 240, 241);
  doc.rect(20, yPosition, 180, 15, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`CDC: ${data.documento.cdc}`, 110, yPosition + 10, {
    align: "center",
  });

  yPosition += 25;

  // Información de verificación
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Consulte esta Factura Electrónica en:", 20, yPosition);
  yPosition += 5;
  doc.text("https://ekuatia.set.gov.py/consultas/", 20, yPosition);
  yPosition += 10;
  doc.text(
    "ESTE DOCUMENTO ES UNA REPRESENTACIÓN GRÁFICA DE UN DOCUMENTO ELECTRÓNICO (XML)",
    110,
    yPosition,
    { align: "center" }
  );

  // Generar y descargar PDF
  const fileName = `Factura_${data.documento.establecimiento}_${data.documento.punto_expedicion}_${data.documento.numero}.pdf`;
  doc.save(fileName);
}

// Función para generar PDF con datos de prueba
export function generarPDFPrueba(): void {
  const datosPrueba: FacturaData = {
    emisor: {
      nombre: "EMPRESA DE PRUEBA S.A.",
      ruc: "80012345",
      dv: "7",
      direccion: "Av. Mariscal López 1234",
      telefono: "(021) 123-4567",
      email: "contacto@empresa.com",
      departamento: "Central",
      ciudad: "Asunción",
      actividad: "Comercio y Servicios",
    },
    receptor: {
      nombre: "CLIENTE DE PRUEBA",
      ruc: "12345678",
      dv: "9",
      codigo_cliente: "CLI001",
      direccion: "Calle Falsa 123",
      telefono: "(021) 987-6543",
      email: "cliente@email.com",
    },
    documento: {
      timbrado: "12345678",
      establecimiento: "001",
      punto_expedicion: "001",
      numero: "0000001",
      fecha_vigencia: "2024-01-01",
      fecha_emision: new Date().toISOString(),
      cdc: "12345678901234567890123456789012345678901234567890",
      condicion: "Contado",
      tipo_transaccion: "Venta",
      moneda: "PYG",
      tipo_cambio: "1",
    },
    items: [
      {
        codigo: "PROD001",
        descripcion: "Producto de Prueba 1",
        cantidad: 2,
        precio_unitario: 50000,
        total: 100000,
        unidad: "Unidad",
        tasa_iva: 10,
      },
      {
        codigo: "PROD002",
        descripcion: "Producto de Prueba 2",
        cantidad: 1,
        precio_unitario: 30000,
        total: 30000,
        unidad: "Unidad",
        tasa_iva: 5,
      },
    ],
    totales: {
      exentas: 0,
      gravadas_5: 30000,
      gravadas_10: 100000,
      iva_5: 1500,
      iva_10: 10000,
      total_iva: 11500,
      total_operacion: 141500,
    },
  };

  generarPDFFactura(datosPrueba);
}
