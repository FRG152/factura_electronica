<?php

/**
 * Normaliza la URL del QR proveniente del XML (suele venir con &amp; o &;).
 * Devuelve una URL con & como separador estándar.
 */
function normalizarUrlQr(string $raw): string {
    // 1) Decodificar entidades HTML/XML
    $s = html_entity_decode($raw, ENT_QUOTES | ENT_XML1, 'UTF-8');

    // 2) Reparar separadores erróneos: &amp; -> &,  &; -> &,  ;<param>= -> &<param>=
    $s = str_replace('&amp;', '&', $s);
    $s = preg_replace('/&;+/u', '&', $s);            // &;  -> &
    $s = preg_replace('/;(?=[A-Za-z_][A-Za-z0-9_]*=)/u', '&', $s); // ;Id= -> &Id=

    // 3) Colapsar duplicados && y limpiar
    $s = preg_replace('/[&]{2,}/u', '&', $s);
    $s = preg_replace('/\?&/u', '?', $s);
    $s = trim($s);

    // 4) Si faltan esquema/host, intentar completar ruta base de SET
    // (rara vez necesario, pero defensivo)
    $p = parse_url($s);
    if (empty($p['scheme']) || empty($p['host'])) {
        // Intentar detectar sólo query
        if (strpos($s, 'nVersion=') !== false) {
            $s = 'https://ekuatia.set.gov.py/consultas/qr?' . ltrim($s, '?&');
        }
    }

    // 5) Reconstruir con http_build_query para asegurar formato canónico
    $p = parse_url($s);
    $base = ($p['scheme'] ?? 'https') . '://' . ($p['host'] ?? 'ekuatia.set.gov.py') . ($p['path'] ?? '/consultas/qr');

    $query = $p['query'] ?? '';
    $params = [];
    if ($query !== '') {
        // parse_str maneja correctamente claves repetidas y decodifica
        parse_str($query, $params);
    }

    // Orden estable (opcional, solo por prolijidad)
    $orden = ['nVersion','Id','dFeEmiDE','dRucRec','dTotGralOpe','dTotIVA','cItems','DigestValue','IdCSC','cHashQR'];
    $paramsOrdenados = [];
    foreach ($orden as $k) {
        if (array_key_exists($k, $params)) $paramsOrdenados[$k] = $params[$k];
    }
    // incluir cualquier otro parámetro fuera de orden conocido
    foreach ($params as $k => $v) {
        if (!array_key_exists($k, $paramsOrdenados)) $paramsOrdenados[$k] = $v;
    }

    $qs = http_build_query($paramsOrdenados, '', '&', PHP_QUERY_RFC3986);
    return $base . ($qs ? ('?' . $qs) : '');
}

// generarPdfDesdeXML.php - DISEÑO ATRACTIVO CON COLORES REDUCIDOS
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configurar CORS para permitir requests desde React
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'assets/mpdf/vendor/autoload.php';

if (isset($_GET['test'])) {
    echo "✅ Generador PDF Formato SIFEN - DISEÑO MEJORADO<br>";
    echo "📄 " . __FILE__ . "<br>";
    echo "🕐 " . date('Y-m-d H:i:s') . "<br>";
    echo class_exists('\Mpdf\Mpdf') ? "✅ MPDF disponible<br>" : "❌ MPDF no disponible<br>";
    echo class_exists('\Mpdf\QrCode\QrCode') ? "✅ QR Code disponible<br>" : "❌ QR Code no disponible<br>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['xmlConQR'])) {
    http_response_code(400);
    die("Error: Datos requeridos no recibidos");
}

try {
    // DEBUG: Ver qué XML llega
    error_log("=== DEBUG XML RECIBIDO ===");
    error_log("Tamaño XML: " . strlen($_POST['xmlConQR']));
    error_log("Primeros 500 chars: " . substr($_POST['xmlConQR'], 0, 500));
    error_log("Contiene gCamFuFD: " . (strpos($_POST['xmlConQR'], 'gCamFuFD') !== false ? 'SI' : 'NO'));
    
    // Limpiar y extraer el XML válido
    $xmlContent = $_POST['xmlConQR'];
    
    // Si el XML contiene la respuesta completa de la SET, extraer solo la parte del documento
    if (strpos($xmlContent, '<rDE') !== false) {
        // Extraer desde <rDE hasta </rDE>
        preg_match('/<rDE.*?<\/rDE>/s', $xmlContent, $matches);
        if (!empty($matches[0])) {
            $xmlContent = $matches[0];
            error_log("XML extraído desde rDE: " . substr($xmlContent, 0, 200));
        }
    }
    
    // Remover cualquier contenido después del cierre del XML principal
    if (strpos($xmlContent, '</rDE>') !== false) {
        $xmlContent = substr($xmlContent, 0, strpos($xmlContent, '</rDE>') + 6);
    }
    
    // Cargar el XML limpio
    $xml = simplexml_load_string($xmlContent, 'SimpleXMLElement', LIBXML_NOCDATA);
    if (!$xml) {
        error_log("Error al parsear XML limpio");
        throw new Exception("XML inválido");
    }
    
    error_log("XML parseado exitosamente");

    // Extraer datos del XML
    $emisor = [
        'nombre' => (string)$xml->DE->gDatGralOpe->gEmis->dNomEmi,
        'ruc' => (string)$xml->DE->gDatGralOpe->gEmis->dRucEm,
        'dv' => (string)$xml->DE->gDatGralOpe->gEmis->dDVEmi,
        'direccion' => (string)$xml->DE->gDatGralOpe->gEmis->dDirEmi,
        'telefono' => (string)$xml->DE->gDatGralOpe->gEmis->dTelEmi,
        'email' => (string)$xml->DE->gDatGralOpe->gEmis->dEmailE,
        'departamento' => (string)$xml->DE->gDatGralOpe->gEmis->dDesDepEmi,
        'ciudad' => (string)$xml->DE->gDatGralOpe->gEmis->dDesCiuEmi,
        'actividad' => (string)$xml->DE->gDatGralOpe->gEmis->gActEco->dDesActEco
    ];

    $receptor = [
        'nombre' => (string)$xml->DE->gDatGralOpe->gDatRec->dNomRec,
        'ruc' => (string)$xml->DE->gDatGralOpe->gDatRec->dRucRec,
        'dv' => (string)$xml->DE->gDatGralOpe->gDatRec->dDVRec,
        'codigo_cliente' => (string)$xml->DE->gDatGralOpe->gDatRec->dCodCliente,
        'direccion' => '',
        'telefono' => '',
        'email' => ''
    ];

    $documento = [
        'timbrado' => (string)$xml->DE->gTimb->dNumTim,
        'establecimiento' => (string)$xml->DE->gTimb->dEst,
        'punto_expedicion' => (string)$xml->DE->gTimb->dPunExp,
        'numero' => str_pad((string)$xml->DE->gTimb->dNumDoc, 7, '0', STR_PAD_LEFT),
        'fecha_vigencia' => (string)$xml->DE->gTimb->dFeIniT,
        'fecha_emision' => (string)$xml->DE->gDatGralOpe->dFeEmiDE,
        'cdc' => (string)$xml->DE['Id'],
        'condicion' => (string)$xml->DE->gDtipDE->gCamCond->dDCondOpe,
        'tipo_transaccion' => (string)$xml->DE->gDatGralOpe->gOpeCom->dDesTipTra,
        'moneda' => (string)$xml->DE->gDatGralOpe->gOpeCom->cMoneOpe,
        'tipo_cambio' => '1'
    ];

    // Extraer items (múltiples si existen)
    $items = [];
    $gCamItem = $xml->DE->gDtipDE->gCamItem;
    
    if (isset($gCamItem[0])) {
        // Múltiples items
        foreach ($gCamItem as $item) {
            $items[] = [
                'codigo' => (string)$item->dCodInt,
                'descripcion' => (string)$item->dDesProSer,
                'cantidad' => (float)$item->dCantProSer,
                'precio_unitario' => (float)$item->gValorItem->dPUniProSer,
                'total' => (float)$item->gValorItem->gValorRestaItem->dTotOpeItem,
                'unidad' => (string)$item->dDesUniMed,
                'tasa_iva' => (float)$item->gCamIVA->dTasaIVA
            ];
        }
    } else {
        // Un solo item
        $items[] = [
            'codigo' => (string)$gCamItem->dCodInt,
            'descripcion' => (string)$gCamItem->dDesProSer,
            'cantidad' => (float)$gCamItem->dCantProSer,
            'precio_unitario' => (float)$gCamItem->gValorItem->dPUniProSer,
            'total' => (float)$gCamItem->gValorItem->gValorRestaItem->dTotOpeItem,
            'unidad' => (string)$gCamItem->dDesUniMed,
            'tasa_iva' => (float)$gCamItem->gCamIVA->dTasaIVA
        ];
    }

    $totales = [
        'exentas' => (float)$xml->DE->gTotSub->dSubExe,
        'gravadas_5' => (float)$xml->DE->gTotSub->dSub5,
        'gravadas_10' => (float)$xml->DE->gTotSub->dSub10,
        'iva_5' => (float)$xml->DE->gTotSub->dIVA5,
        'iva_10' => (float)$xml->DE->gTotSub->dIVA10,
        'total_iva' => (float)$xml->DE->gTotSub->dTotIVA,
        'total_operacion' => (float)$xml->DE->gTotSub->dTotGralOpe
    ];

    // Función para extraer QR del XML original con debug detallado
    function extraerQRDelXML($xml) {
        error_log("=== DEBUG EXTRACCIÓN QR ===");
        $xmlString = $xml->asXML() ?: '';
        // Búsqueda directa por etiqueta dCarQR
        if (preg_match('/<dCarQR>(.*?)<\/dCarQR>/s', $xmlString, $m) && !empty($m[1])) {
            $qr = normalizarUrlQr($m[1]);
            error_log("QR extraído (normalizado): " . substr($qr, 0, 120) . "...");
            return $qr;
        }
        // Fallback por XPath
        $nodes = $xml->xpath('//gCamFuFD/dCarQR');
        if (!empty($nodes)) {
            $qr = normalizarUrlQr((string)$nodes[0]);
            error_log("QR por XPath (normalizado): " . substr($qr, 0, 120) . "...");
            return $qr;
        }
        error_log("No se encontró dCarQR; no hay QR original en el XML.");
        return null;
    }
    

    // Generar QR completo con datos extraídos del XML
    function generarQRCompleto($xml, $documento, $receptor, $totales, $items) {
        $qr_original = extraerQRDelXML($xml);
        if ($qr_original) {
            return $qr_original; // ya viene normalizado
        }
        // Fallback mínimo por CDC
        return "https://ekuatia.set.gov.py/consultas/public/consulta-documento-electronico?cdc=" . $documento['cdc'];
    }
    
    
    $qr_data = generarQRCompleto($xml, $documento, $receptor, $totales, $items);
    
    // Formatear fechas
    $fecha_emision = DateTime::createFromFormat('Y-m-d\TH:i:s', $documento['fecha_emision']);
    $fecha_vigencia = DateTime::createFromFormat('Y-m-d', $documento['fecha_vigencia']);
    $fecha_emision_fmt = $fecha_emision ? $fecha_emision->format('d/m/Y H:i:s') : $documento['fecha_emision'];
    $fecha_vigencia_fmt = $fecha_vigencia ? $fecha_vigencia->format('d/m/Y') : $documento['fecha_vigencia'];

    function formatNum($num) {
        return number_format($num, 0, ',', '.');
    }

    $mpdf = new \Mpdf\Mpdf([
        'format' => 'A4',
        'margin_left' => 10,
        'margin_right' => 10,
        'margin_top' => 10,
        'margin_bottom' => 15,
        'default_font' => 'dejavusans',
        'mode' => 'utf-8'
    ]);

    // CSS ATRACTIVO CON COLORES REDUCIDOS
    $css = "
        body { 
            font-family: 'DejaVu Sans', Arial, sans-serif; 
            font-size: 9px; 
            margin: 0; 
            padding: 0; 
            line-height: 1.4;
            color: #333;
        }
        
        .document-title {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            text-align: center;
            padding: 12px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 0;
            border-radius: 8px 8px 0 0;
        }
        
        .main-header { 
            border: 2px solid #34495e; 
            padding: 15px; 
            margin-bottom: 10px; 
            border-radius: 0 0 8px 8px;
            background: #f8f9fa;
        }
        .company-name {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .company-activity {
            font-size: 8px;
            color: #666;
            font-style: italic;
            margin-bottom: 8px;
        }
        .header-left { 
            width: 60%; 
            float: left; 
        }
        .header-right { 
            width: 35%; 
            float: right; 
            text-align: right; 
            background: #ecf0f1;
            padding: 10px;
            border-radius: 6px;
            border-left: 4px solid #5a6c7d;
        }
        .invoice-number {
            background: #5a6c7d;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
            display: inline-block;
        }
        .clearfix::after { 
            content: ''; 
            display: table; 
            clear: both; 
        }
        
        .info-section { 
            border: 2px solid #34495e; 
            padding: 15px; 
            margin-bottom: 10px; 
            border-radius: 8px;
            background: #fdfdfd;
        }
        .section-title {
            font-size: 10px;
            font-weight: bold;
            color: #2c3e50;
            border-bottom: 2px solid #5a6c7d;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .info-left { 
            width: 48%; 
            float: left; 
        }
        .info-right { 
            width: 48%; 
            float: right; 
        }
        
        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 10px;
        }
        .items-table th { 
            background: linear-gradient(135deg, #34495e, #2c3e50);
            color: white;
            border: none;
            padding: 12px 6px; 
            text-align: center; 
            font-weight: bold;
            font-size: 8px;
        }
        .items-table td { 
            border: 1px solid #bdc3c7; 
            padding: 8px 6px; 
            text-align: center;
            font-size: 8px;
            background: white;
        }
        .items-table tr:nth-child(even) td {
            background: #f8f9fa;
        }
        .desc-col { 
            text-align: left !important; 
            font-weight: 500;
        }
        .num-col { 
            text-align: right !important; 
            font-family: monospace;
            padding-right: 8px !important;
        }
        
        .totals-row { 
            background: linear-gradient(135deg, #ecf0f1, #bdc3c7) !important; 
            font-weight: bold; 
        }
        .totals-row td {
            background: linear-gradient(135deg, #ecf0f1, #bdc3c7) !important;
            font-weight: bold;
        }
        .final-total {
            background: linear-gradient(135deg, #5a6c7d, #34495e) !important;
            color: white !important;
            font-size: 10px !important;
        }
        .final-total td {
            background: linear-gradient(135deg, #5a6c7d, #34495e) !important;
            color: white !important;
        }
        
        .tax-summary {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
            color: white;
            padding: 12px; 
            margin: 10px 0;
            border-radius: 8px;
            font-size: 10px;
            text-align: center;
        }
        .tax-item {
            display: inline-block;
            margin: 0 15px;
            font-weight: bold;
        }
        
        .footer-section { 
            border: 2px solid #34495e; 
            padding: 15px; 
            margin-top: 15px; 
            border-radius: 8px;
            background: #f8f9fa;
        }
        .qr-section { 
            width: 25%; 
            float: left; 
            text-align: center;
        }
        .qr-enhanced {
            border: 3px solid #5a6c7d;
            border-radius: 8px;
            padding: 10px;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .verification-section { 
            width: 70%; 
            float: right;
            padding-left: 15px;
        }
        .verification-url {
            color: #5a6c7d;
            font-weight: bold;
            font-size: 10px;
        }
        
        .cdc-display { 
            font-size: 11px; 
            font-weight: bold; 
            text-align: center; 
            margin: 15px 0; 
            letter-spacing: 1px;
            padding: 10px;
            background: #ecf0f1;
            border-radius: 6px;
            font-family: monospace;
        }
        
        .legal-footer { 
            font-size: 8px; 
            text-align: center; 
            margin-top: 15px; 
            line-height: 1.4;
            background: #2c3e50;
            color: white;
            padding: 10px;
            border-radius: 6px;
        }
        
        .highlight-box {
            background: #e8f4f8;
            border-left: 4px solid #5a6c7d;
            padding: 10px;
            margin: 10px 0;
            border-radius: 0 6px 6px 0;
        }
        
        .status-badge {
            background: #c0392b;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
        }
    ";

    // HTML ATRACTIVO
    $html = "
    <div class='status-badge'>
        KuDE de FACTURA ELECTRONICA
    </div>
    
    <div class='document-title'>
        " . htmlspecialchars($emisor['nombre'], ENT_QUOTES, 'UTF-8') . "
    </div>
    
    <div class='main-header clearfix'>
        <div class='header-left'>
            <div class='company-activity'>" . htmlspecialchars($emisor['actividad'], ENT_QUOTES, 'UTF-8') . "</div>
            <strong>Dirección:</strong> " . htmlspecialchars($emisor['direccion'], ENT_QUOTES, 'UTF-8') . "<br>
            <strong>Ciudad:</strong> " . htmlspecialchars($emisor['ciudad'], ENT_QUOTES, 'UTF-8') . " - " . htmlspecialchars($emisor['departamento'], ENT_QUOTES, 'UTF-8') . " - PARAGUAY<br>
            <strong>Teléfono:</strong> " . htmlspecialchars($emisor['telefono'], ENT_QUOTES, 'UTF-8') . " 
            <strong>Correo:</strong> " . htmlspecialchars($emisor['email'], ENT_QUOTES, 'UTF-8') . "
        </div>
        <div class='header-right'>
            <strong>RUC:</strong> " . $emisor['ruc'] . "-" . $emisor['dv'] . "<br>
            <strong>Timbrado N°:</strong> " . $documento['timbrado'] . "<br>
            <strong>Inicio de vigencia:</strong> " . $fecha_vigencia_fmt . "<br>
            <div class='invoice-number'>
                Factura Electrónica<br>
                " . $documento['establecimiento'] . "-" . $documento['punto_expedicion'] . "-" . $documento['numero'] . "
            </div>
        </div>
    </div>
    
    <div class='info-section clearfix'>
        <div class='info-left'>
            <div class='section-title'>Información de Emisión</div>
            <strong>Fecha y hora de emisión:</strong> " . $fecha_emision_fmt . "<br>
            <strong>Condición de venta:</strong> " . $documento['condicion'] . "<br>
            <strong>Moneda:</strong> " . $documento['moneda'] . " 
            " . ($documento['tipo_cambio'] ? "<strong>Tipo de cambio:</strong> " . $documento['tipo_cambio'] : "") . "
        </div>
        <div class='info-right'>
            <div class='section-title'>Datos del Cliente</div>
            <strong>Nombre o Razón Social:</strong> " . htmlspecialchars($receptor['nombre'], ENT_QUOTES, 'UTF-8') . "<br>
            <strong>RUC/Documento de identidad N°:</strong> " . $receptor['ruc'] . "-" . $receptor['dv'] . "<br>
            " . ($receptor['email'] ? "<strong>Correo:</strong> " . htmlspecialchars($receptor['email'], ENT_QUOTES, 'UTF-8') . "<br>" : "") . "
            " . ($receptor['direccion'] ? "<strong>Dirección:</strong> " . htmlspecialchars($receptor['direccion'], ENT_QUOTES, 'UTF-8') . "<br>" : "") . "
            " . ($receptor['telefono'] ? "<strong>Teléfono:</strong> " . $receptor['telefono'] . "<br>" : "") . "
            " . ($receptor['codigo_cliente'] ? "<strong>Código Cliente:</strong> " . $receptor['codigo_cliente'] : "") . "
        </div>
    </div>
    
    <table class='items-table'>
        <thead>
            <tr>
                <th style='width: 10%;'>Código</th>
                <th style='width: 25%;'>Descripción</th>
                <th style='width: 8%;'>Cantidad</th>
                <th style='width: 12%;'>Precio</th>
                <th style='width: 12%;'>Exentas</th>
                <th style='width: 12%;'>5%</th>
                <th style='width: 15%;'>10%</th>
            </tr>
        </thead>
        <tbody>";

    // Generar filas de items
    foreach ($items as $item) {
        $exentas_display = $item['tasa_iva'] == 0 ? formatNum($item['total']) : '0';
        $grav5_display = $item['tasa_iva'] == 5 ? formatNum($item['total']) : '0';
        $grav10_display = $item['tasa_iva'] == 10 ? formatNum($item['total']) : '0';

        $html .= "
            <tr>
                <td>" . htmlspecialchars($item['codigo'], ENT_QUOTES, 'UTF-8') . "</td>
                <td class='desc-col'>" . htmlspecialchars($item['descripcion'], ENT_QUOTES, 'UTF-8') . "</td>
                <td>" . formatNum($item['cantidad']) . "</td>
                <td style='text-align: right;' class='num-col'>" . formatNum($item['precio_unitario']) . "</td>
                <td style='text-align: right;' class='num-col'>$exentas_display</td>
                <td style='text-align: right;' class='num-col'>$grav5_display</td>
                <td style='text-align: right;' class='num-col'>$grav10_display</td>
            </tr>";
    }

    $html .= "
            <tr class='totals-row'>
                <td colspan='4'><strong>Subtotal:</strong></td>
                <td style='text-align: right;' class='num-col'><strong>" . formatNum($totales['exentas']) . "</strong></td>
                <td style='text-align: right;' class='num-col'><strong>" . formatNum($totales['gravadas_5']) . "</strong></td>
                <td style='text-align: right;' class='num-col'><strong>" . formatNum($totales['gravadas_10']) . "</strong></td>
            </tr>
            <tr class='final-total'>
                <td colspan='6'><strong>Total a Pagar:</strong></td>
                <td style='text-align: right;' class='num-col'><strong>" . formatNum($totales['total_operacion']) . "</strong></td>
            </tr>
            <tr class='final-total'>
                <td colspan='7' style='text-align: right;'><strong>Total Guaraníes: " . formatNum($totales['total_operacion']) . "</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div class='tax-summary' style='text-align: right;'>
        <span class='tax-item'>Liquidación Iva: (5%) " . formatNum($totales['iva_5']) . "</span>
        <span class='tax-item'>(10%) " . formatNum($totales['iva_10']) . "</span>
        <span class='tax-item'><strong>Total Iva: " . formatNum($totales['total_iva']) . "</strong></span>
    </div>
    
    <div class='footer-section clearfix'>
        <div class='qr-section'>
            <div class='qr-enhanced'>";
    
    // QR Code - usando el QR original del XML con mejor configuración
    if (class_exists('\Mpdf\QrCode\QrCode')) {
        $html .= "<barcode code='" . $qr_data . "' type='QR' class='qr-code' size='1.6' error='L' />";
    } else {
        $html .= "<div style='border: 2px solid #5a6c7d; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 10px; border-radius: 6px;'><strong>QR<br>CODE</strong></div>";
    }
    
    $html .= "
            </div>
        </div>
        <div class='verification-section'>
            <div class='highlight-box'>
                <strong>Consulte esta Factura Electrónica con el número impreso abajo:</strong><br>
                <span class='verification-url'>https://ekuatia.set.gov.py/consultas/</span>
            </div>
            
            <div class='cdc-display'>
                " . chunk_split($documento['cdc'], 4, ' ') . "
            </div>
            
            <div style='text-align: center; font-weight: bold; font-size: 10px;'>
                ESTE DOCUMENTO ES UNA REPRESENTACIÓN GRÁFICA DE UN<br>
                DOCUMENTO ELECTRÓNICO (XML)
            </div>
        </div>
    </div>
    
    <div class='legal-footer'>
        Si su documento electrónico presenta algún error puede solicitar la modificación dentro de las 72 horas siguientes de la emisión de este comprobante.
    </div>";

    $mpdf->WriteHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
    $mpdf->WriteHTML($html, \Mpdf\HTMLParserMode::HTML_BODY);

    $nombre_archivo = 'Factura_' . $documento['establecimiento'] . '_' . $documento['punto_expedicion'] . '_' . $documento['numero'] . '.pdf';
    $mpdf->Output($nombre_archivo, 'I');

} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}
?>
