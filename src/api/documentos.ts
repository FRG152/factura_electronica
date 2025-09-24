const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

import type {
  CompleteInvoiceStructure,
  CrearDocumentoResponse,
  ListarDocumentosParams,
  ListarDocumentosResponse,
} from "../interfaces";

export const getListaDocumentos = async (
  params: ListarDocumentosParams = {}
): Promise<ListarDocumentosResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const queryParams = new URLSearchParams();
    if (params.estado) queryParams.append("estado", params.estado);
    if (params.numeroDocumento)
      queryParams.append("numeroDocumento", params.numeroDocumento);
    if (params.cdc) queryParams.append("cdc", params.cdc);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${API_BASE_URL}/generar-documento/listar?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al listar documentos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al listar documentos:", error);
    throw error;
  }
};

export const crearDocumento = async (
  invoiceData: CompleteInvoiceStructure
): Promise<CrearDocumentoResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/generar-documento/crear`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear documento");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear documento:", error);
    throw error;
  }
};

export const generarPDF = async (xmlData: string): Promise<Blob> => {
  try {
    const formData = new FormData();
    formData.append("xmlConQR", xmlData);

    const response = await fetch("/generarPdfDesdeXML.php", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al generar PDF");
    }

    return await response.blob();
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw error;
  }
};
