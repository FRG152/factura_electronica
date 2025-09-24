import { useState } from "react";
import { Select } from "./Select";
import { Input } from "./Input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";
import { estadoOptions } from "../constants/invoice";

interface FacturasFilterProps {
  onFilter: (filters: {
    estado: string;
    numeroDocumento: string;
    cdc: string;
  }) => void;
  onClear: () => void;
}

const InvoiceFilter = ({ onFilter, onClear }: FacturasFilterProps) => {
  const [filters, setFilters] = useState({
    estado: "todos",
    numeroDocumento: "",
    cdc: "",
  });

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({
      estado: "todos",
      numeroDocumento: "",
      cdc: "",
    });
    onClear();
  };

  const handleInputChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white py-4 rounded-lg w-full">
      <div className="flex flex-wrap items-end gap-2 lg:flex-nowrap">
        <div className="w-full">
          <Select
            label="Estado"
            value={filters.estado}
            options={estadoOptions}
            placeholder="Seleccionar estado"
            onValueChange={(value) => handleInputChange("estado", value)}
          />
        </div>

        <Input
          label="Número de Factura"
          placeholder="DOC-123"
          value={filters.numeroDocumento}
          onChange={(value) => handleInputChange("numeroDocumento", value)}
          className="w-full"
        />

        <Input
          label="CDC"
          placeholder="Buscar por CDC"
          value={filters.cdc}
          onChange={(value) => handleInputChange("cdc", value)}
          className="w-full"
        />

        <div className="flex gap-2">
          <Button
            onClick={handleFilter}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Search size={30} />
            Filtrar
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <X size={30} />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFilter;
