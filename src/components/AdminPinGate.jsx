import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

export function AdminPinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const ADMIN_STORAGE_KEY = "wb_admin";

  const handlePinInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
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
    <div className="fixed inset-0 bg-wb-dark flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1917] border border-[rgba(201,168,76,0.25)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg p-8 w-full max-w-sm">
        <h1 className="font-cormorant italic text-wb-gold text-3xl text-center tracking-wide">
          WONDER BAKERY
        </h1>
        <h2 className="font-dm-sans text-wb-cream text-sm text-center mt-1 uppercase tracking-widest opacity-80">
          Admin Access
        </h2>
        
        <div className="h-px bg-gradient-to-r from-transparent via-wb-gold/30 to-transparent my-6" />

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  i < pin.length ? "bg-wb-gold" : "bg-wb-gold/20"
                }`}
              />
            ))}
          </div>

          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={handlePinInput}
            maxLength="4"
            placeholder="••••"
            className="w-full bg-wb-dark border border-[rgba(201,168,76,0.25)] text-wb-cream text-center text-2xl tracking-[0.5em] py-3 rounded focus:outline-none focus:shadow-[0_0_0_2px_rgba(201,168,76,0.2)] transition-all font-dm-sans"
          />

          {error && (
            <div className="flex items-center justify-center gap-1.5 mt-4 text-[#ef5350] text-sm font-dm-sans">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pin.length !== 4}
            className="w-full bg-wb-gold text-wb-dark font-dm-sans font-bold uppercase tracking-wider py-3 rounded mt-6 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
