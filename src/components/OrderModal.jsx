import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";

const isMockMode =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes("your-project-id");

export function OrderModal({ product, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    deliveryType: "pickup",
    address: "",
    quantity: 1,
    notes: "",
    deliveryDate: "",
    deliveryTime: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const formatPrice = (p) => `Le ${p.toLocaleString()}`;
  const total = product.price * formData.quantity;

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.whatsappNumber.trim())
      e.whatsappNumber = "WhatsApp number is required";
    if (!formData.address.trim()) e.address = "Delivery address is required";
    if (formData.quantity < 1) e.quantity = "Quantity must be at least 1";
    if (!formData.deliveryDate)
      e.deliveryDate = "Preferred delivery date is required";
    if (!formData.deliveryTime)
      e.deliveryTime = "Preferred delivery time is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, Number(value)) : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const orderId = `WB-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderRow = {
      id: orderId,
      customer_name: formData.fullName,
      customer_phone: formData.whatsappNumber,
      delivery_type: formData.deliveryType,
      delivery_address: formData.address,
      delivery_date: formData.deliveryDate,
      delivery_time: formData.deliveryTime,
      items: [
        {
          name: product.name,
          price: product.price,
          quantity: formData.quantity,
        },
      ],
      total_amount: total,
      notes: formData.notes || null,
      status: "received",
    };

    if (!isMockMode) {
      console.log("Inserting order:", JSON.stringify(orderRow));
      const { error } = await supabase.from("orders").insert(orderRow);
      if (error) {
        console.error("Order insert error:", JSON.stringify(error));
        alert("Failed to place order. Please try again.");
        setSubmitting(false);
        return;
      }
    } else {
      const stored = JSON.parse(localStorage.getItem("wb_orders") || "[]");
      stored.unshift(orderRow);
      localStorage.setItem("wb_orders", JSON.stringify(stored));
    }

    const items = [
      { name: product.name, price: product.price, quantity: formData.quantity },
    ];

    const whatsappMessage = `
NEW ORDER - WONDER BAKERY

Order ID: ${orderId}
Customer: ${formData.fullName}
Phone: ${formData.whatsappNumber}
Delivery Address: ${formData.address}
Delivery Date: ${formData.deliveryDate}
Delivery Time: ${formData.deliveryTime}

Items:
${items.map((i) => `${i.quantity}x ${i.name} - Le ${(i.price * i.quantity).toLocaleString()}`).join("\n")}

Total: Le ${total.toLocaleString()}

Notes: ${formData.notes || "None"}
`.trim();

    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, "_blank");
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-wb-dark-lighter border-2 border-wb-gold/30 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-wb-gold/20">
          <div>
            <h2 className="font-cormorant text-xl text-wb-gold">
              Place an Order
            </h2>
            <p className="font-dm-sans text-xs text-wb-cream/60 mt-0.5">
              {product.name} — {formatPrice(product.price)} each
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-wb-cream/60 hover:text-wb-gold transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block font-dm-sans text-xs text-wb-cream/80 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className={`w-full bg-wb-dark border-2 text-wb-cream px-3 py-2.5 rounded text-sm focus:outline-none transition-colors placeholder:text-wb-cream/30 ${errors.fullName ? "border-red-400" : "border-wb-gold/30 focus:border-wb-gold"}`}
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block font-dm-sans text-xs text-wb-cream/80 mb-1">
              WhatsApp Number *
            </label>
            <input
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="076 XXX XXXX"
              className={`w-full bg-wb-dark border-2 text-wb-cream px-3 py-2.5 rounded text-sm focus:outline-none transition-colors placeholder:text-wb-cream/30 ${errors.whatsappNumber ? "border-red-400" : "border-wb-gold/30 focus:border-wb-gold"}`}
            />
            {errors.whatsappNumber && (
              <p className="text-red-400 text-xs mt-1">
                {errors.whatsappNumber}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-dm-sans text-xs text-wb-cream/80 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={`w-full bg-wb-dark border-2 text-wb-cream px-3 py-2.5 rounded text-sm focus:outline-none transition-colors ${errors.quantity ? "border-red-400" : "border-wb-gold/30 focus:border-wb-gold"}`}
            />
            {errors.quantity && (
              <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block font-dm-sans text-xs text-wb-cream/80 mb-2">
              Service Type *
            </label>
            <div className="flex gap-4">
              {["pickup", "delivery"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value={type}
                    checked={formData.deliveryType === type}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#C9A84C]"
                  />
                  <span className="font-dm-sans text-sm text-wb-cream capitalize">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block font-dm-sans text-xs text-wb-cream/80 mb-1">
              Delivery Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full delivery address"
              rows="3"
              className={`w-full bg-wb-dark border-2 text-wb-cream px-3 py-2.5 rounded text-sm focus:outline-none transition-colors resize-none placeholder:text-wb-cream/30 ${errors.address ? "border-red-400" : "border-wb-gold/30 focus:border-wb-gold"}`}
            />
            {errors.address && (
              <p className="text-red-400 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Date + Time grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-dm-sans text-xs text-wb-cream/80 mb-1">
                Preferred Delivery Date *
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full bg-wb-dark border-2 text-wb-cream px-3 py-2.5 rounded text-sm focus:outline-none transition-colors ${errors.deliveryDate ? "border-red-400" : "border-wb-gold/30 focus:border-wb-gold"}`}
              />
              {errors.deliveryDate && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.deliveryDate}
                </p>
              )}
            </div>
            <div>
              <label className="block font-dm-sans text-xs text-wb-cream/80 mb-1">
                Preferred Delivery Time *
              </label>
              <input
                type="time"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className={`w-full bg-wb-dark border-2 text-wb-cream px-3 py-2.5 rounded text-sm focus:outline-none transition-colors ${errors.deliveryTime ? "border-red-400" : "border-wb-gold/30 focus:border-wb-gold"}`}
              />
              {errors.deliveryTime && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.deliveryTime}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-dm-sans text-xs text-wb-cream/80 mb-1">
              Special Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requests or instructions..."
              rows="2"
              className="w-full bg-wb-dark border-2 border-wb-gold/30 text-wb-cream px-3 py-2.5 rounded text-sm focus:outline-none focus:border-wb-gold transition-colors resize-none placeholder:text-wb-cream/30"
            />
          </div>

          {/* Total */}
          <div className="bg-wb-gold/10 border border-wb-gold/20 rounded px-4 py-3 flex justify-between items-center">
            <span className="font-dm-sans text-sm text-wb-cream/70">Total</span>
            <span className="font-cormorant text-xl text-wb-gold">
              {formatPrice(total)}
            </span>
          </div>

          {/* Payment note */}
          <div className="text-center text-xs text-wb-cream/50 font-dm-sans">
            Payment is made physically upon delivery/pickup — no online payment
            required.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : "Place Order via WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
