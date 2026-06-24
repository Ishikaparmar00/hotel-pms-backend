import React from "react";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const buttonColorClasses = {
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10",
    info: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4 text-xs font-semibold text-customText-light dark:text-white">
        <div className="flex items-start space-x-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            type === "danger" ? "bg-rose-50 text-rose-600" :
            type === "warning" ? "bg-amber-50 text-amber-600" :
            type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-sm text-customText-light dark:text-white leading-tight">
              Are you sure?
            </p>
            <p className="text-customText-mutedLight dark:text-customText-mutedDark font-medium leading-relaxed mt-1">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-customBorder-light dark:border-customBorder-dark">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-customBorder-light dark:border-[#334155] rounded-xl text-customText-light dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl font-bold shadow-sm transition active:scale-95 ${buttonColorClasses[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
