import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

export function AdminPinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const ADMIN_STORAGE_KEY = "wb_admin";

  const handlePinInput = (e) => {
    const value = e.target.value.slice(0, 4);
    setPin(value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedPin =
      localStorage.getItem("wb_admin_pin") ||
      import.meta.env.VITE_ADMIN_PIN ||
      "1234";
    if (pin === storedPin) {
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      onUnlock();
    } else {
      setError("Invalid PIN");
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 bg-wb-dark/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-wb-dark-lighter border-2 border-wb-gold/30 rounded-lg p-8 w-full max-w-sm">
        <h2 className="font-cormorant text-2xl text-wb-gold mb-2 text-center">
          Admin Access
        </h2>
        <p className="text-wb-cream/70 text-center text-sm mb-6 font-dm-sans">
          Enter 4-digit PIN to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              onChange={handlePinInput}
              maxLength="4"
              className="w-full bg-wb-dark border-2 border-wb-gold/30 text-wb-cream text-center text-3xl tracking-widest py-4 rounded focus:border-wb-gold focus:outline-none transition-colors"
            />
            {error && (
              <div className="flex items-center gap-2 mt-3 text-red-400 text-sm font-dm-sans">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary w-full">
            Unlock
          </button>
        </form>
        <p className="text-wb-cream/40 text-xs text-center mt-6 font-dm-sans">
          Admin PIN required for dashboard access
        </p>
      </div>
    </div>
  );
}
