import { cn } from "../lib/utils";
import type { InputProps } from "@/interfaces";
import { Input as InputPrimitive } from "./ui/input";

export function Input({
  label,
  value,
  error,
  type = "text",
  onChange,
  placeholder,
  disabled = false,
  className,
  required = false,
  readOnly = false,
  min,
  max,
  step,
}: InputProps) {
  return (
    <div className={cn(className)}>
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <InputPrimitive
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        className={cn(
          "w-full",
          error && "border-red-500 focus:border-red-500",
          readOnly && "bg-gray-50 cursor-not-allowed"
        )}
      />

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
