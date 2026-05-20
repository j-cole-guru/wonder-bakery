import React, { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export function Toast({ message, type = "success", duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast-base">
      {type === "success" && <CheckCircle size={20} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-wb-dark/20 rounded"
      >
        <X size={16} />
      </button>
    </div>
  );
}
