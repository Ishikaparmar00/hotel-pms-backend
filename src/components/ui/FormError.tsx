import React from "react";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1 select-none animate-fade-in ${className}`}>
      <AlertCircle className="w-3 h-3 shrink-0" />
      <span>{message}</span>
    </span>
  );
};
