import {
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
  Select as SelectPrimitive,
} from "./ui/select";
import { cn } from "../lib/utils";
import type { SelectProps } from "@/interfaces";

export function Select({
  label,
  error,
  value,
  options,
  disabled = false,
  className,
  placeholder = "Seleccionar...",
  onValueChange,
}: SelectProps) {
  return (
    <div className={cn(className)}>
      <label className="text-sm font-medium">{label}</label>

      <SelectPrimitive
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
      >
        <SelectTrigger className={`w-full ${cn(error && "border-red-500")}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="w-full">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
