import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: "PENDIENTE" | "ENVIADO" | "RECHAZADO" | "APROBADO";
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const StatusBadge = ({ status, variant = "default" }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ENVIADO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RECHAZADO":
        return "bg-red-100 text-red-800 border-red-200";
      case "APROBADO":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge
      className={cn(
        "text-xs font-medium px-2 py-1 rounded-full border",
        getStatusStyles(status)
      )}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
