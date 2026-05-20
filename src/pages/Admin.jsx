import React, { useState, useEffect, useRef } from "react";
import { supabase, getSupabaseAdmin } from "../lib/supabase";
import { AdminPinGate } from "../components/AdminPinGate";
import {
  Package,
  ShoppingBag,
  LogOut,
  Upload,
  Trash2,
  CheckCircle,
  Clock,
  ChevronDown,
  Settings,
  AlertCircle,
  X,
} from "lucide-react";

const isMockMode =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes("your-project-id");
const CATEGORIES = ["Bread", "Cakes", "Pastries", "Drinks", "Other"];
const ADMIN_KEY = "wb_admin";

// ─── Shared Styles ────────────────────────────────────────────────────────────

const cardStyle = "bg-[#1a1917] border border-[rgba(201,168,76,0.25)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg";
const inputStyle = "w-full bg-wb-dark border border-[rgba(201,168,76,0.25)] text-wb-cream px-3 py-2.5 rounded focus:outline-none focus:shadow-[0_0_0_2px_rgba(201,168,76,0.2)] transition-all font-dm-sans";
const btnSolid = "bg-wb-gold text-wb-dark font-dm-sans font-bold py-2 px-4 rounded hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const btnOutlineGold = "border border-wb-gold text-wb-gold font-dm-sans font-bold py-1.5 px-3 rounded hover:bg-wb-gold hover:text-wb-dark transition-all text-sm";
const btnOutlineRed = "border border-[#ef5350] text-[#ef5350] font-dm-sans font-bold py-1.5 px-3 rounded hover:bg-[#ef5350] hover:text-wb-dark transition-all text-sm";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(amount) {
  return `Le ${Number(amount).toLocaleString("en-US")}`;
}

function StatusBadge({ status }) {
  const map = {
    received: {
      label: "Received",
      classes: "bg-wb-dark text-wb-cream border-[rgba(201,168,76,0.2)]",
    },
    preparing: {
      label: "Preparing",
      classes: "bg-wb-dark text-wb-cream border-[rgba(201,168,76,0.2)]",
    },
    ready: {
      label: "Ready",
      classes: "bg-wb-dark text-wb-cream border-[rgba(201,168,76,0.2)]",
    },
    delivered: {
      label: "Delivered",
      classes: "bg-[#4caf50]/20 text-[#4caf50] border-[#4caf50]/50",
    },
  };
  const s = map[status] || map.received;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-widest border font-dm-sans ${s.classes}`}
    >
      {s.label}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-wb-gold/30 border-t-wb-gold rounded-full animate-spin" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Admin() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState("orders"); // Orders as default per redesign typically

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Bread",
    is_available: true,
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // ── Always require PIN on every visit ─────────────────────────────────────
  useEffect(() => {
    localStorage.removeItem(ADMIN_KEY);
  }, []);

  // ── Load data when tab changes (and on unlock) ───────────────────────────────
  useEffect(() => {
    if (!isUnlocked) return;
    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
  }, [isUnlocked, activeTab]);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  function handleUnlock() {
    setIsUnlocked(true);
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_KEY);
    setIsUnlocked(false);
  }

  // ── Products: fetch ───────────────────────────────────────────────────────────
  async function fetchProducts() {
    setProductsLoading(true);
    try {
      if (isMockMode) {
        const stored = localStorage.getItem("wb_products");
        setProducts(stored ? JSON.parse(stored) : []);
      } else {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  }

  // ── Products: add ─────────────────────────────────────────────────────────────
  async function handleAddProduct(e) {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) return setFormError("Product name is required.");
    if (!formData.price || isNaN(Number(formData.price)))
      return setFormError("A valid price is required.");
    if (!imageFile) return setFormError("Please select an image.");

    setFormLoading(true);
    try {
      if (isMockMode) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result;
          const newProduct = {
            id: `mock_${Date.now()}`,
            name: formData.name.trim(),
            price: Number(formData.price),
            category: formData.category,
            image_url: base64Url,
            is_available: formData.is_available,
            is_featured: formData.is_featured,
            created_at: new Date().toISOString(),
          };
          const stored = localStorage.getItem("wb_products");
          const existing = stored ? JSON.parse(stored) : [];
          const updated = [newProduct, ...existing];
          localStorage.setItem("wb_products", JSON.stringify(updated));
          setProducts(updated);
          closeModal();
        };
        reader.readAsDataURL(imageFile);
        return;
      }

      // Live mode
      const adminClient = getSupabaseAdmin();
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await adminClient.storage
        .from("product-images")
        .upload(fileName, imageFile, { upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = adminClient.storage
        .from("product-images")
        .getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      const { error: insertError } = await adminClient.from("products").insert({
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        image_url: imageUrl,
        is_available: formData.is_available,
        is_featured: formData.is_featured,
      });
      if (insertError) throw insertError;

      await fetchProducts();
      closeModal();
    } catch (err) {
      console.error("Error adding product:", err);
      setFormError(err.message || "Failed to add product. Please try again.");
      setFormLoading(false);
    }
  }

  function closeModal() {
    setIsProductModalOpen(false);
    setFormData({ name: "", price: "", category: "Bread", is_available: true, is_featured: false });
    setImageFile(null);
    setImagePreview(null);
    setFormLoading(false);
    setFormError("");
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  // ── Products: delete ──────────────────────────────────────────────────────────
  async function handleDeleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`))
      return;

    try {
      if (isMockMode) {
        const stored = localStorage.getItem("wb_products");
        const existing = stored ? JSON.parse(stored) : [];
        const updated = existing.filter((p) => p.id !== product.id);
        localStorage.setItem("wb_products", JSON.stringify(updated));
        setProducts(updated);
        return;
      }

      const adminClient = getSupabaseAdmin();
      if (product.image_url) {
        try {
          const parts = product.image_url.split("/product-images/");
          if (parts.length === 2) {
            await adminClient.storage.from("product-images").remove([parts[1]]);
          }
        } catch (_) {}
      }

      const { error } = await adminClient.from("products").delete().eq("id", product.id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product: " + (err.message || "Unknown error"));
    }
  }

  // ── Orders: fetch ─────────────────────────────────────────────────────────────
  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      if (isMockMode) {
        const stored = localStorage.getItem("wb_orders");
        setOrders(stored ? JSON.parse(stored) : []);
      } else {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }

  // ── Orders: update status ────────────────────────────────────────────────────
  async function handleUpdateOrderStatus(order, newStatus) {
    if (order.status === newStatus) return;

    try {
      if (isMockMode) {
        const stored = localStorage.getItem("wb_orders");
        const existing = stored ? JSON.parse(stored) : [];
        const updated = existing.map((o) =>
          o.id === order.id ? { ...o, status: newStatus } : o,
        );
        localStorage.setItem("wb_orders", JSON.stringify(updated));
        setOrders(updated);
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)),
      );

      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);
      if (error) throw error;
    } catch (err) {
      console.error("Error updating order:", err);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: order.status } : o)),
      );
      alert("Failed to update order: " + (err.message || "Unknown error"));
    }
  }

  // ── Orders stats ──────────────────────────────────────────────────────────────
  const totalOrders = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const pendingCount = totalOrders - deliveredCount;

  // ── Render: locked ────────────────────────────────────────────────────────────
  if (!isUnlocked) {
    return <AdminPinGate onUnlock={handleUnlock} />;
  }

  // ── Render: unlocked ──────────────────────────────────────────────────────────
  return (
    <div className="pt-20 pb-12 min-h-screen bg-wb-dark font-dm-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(201,168,76,0.2)]">
          <h1 className="font-cormorant italic text-2xl sm:text-3xl text-wb-gold">
            WONDER BAKERY <span className="font-dm-sans not-italic text-lg text-wb-cream opacity-80 ml-2">— Admin</span>
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-[rgba(201,168,76,0.4)] text-wb-cream hover:text-wb-dark hover:bg-wb-gold transition-colors text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-6 mb-8 border-b border-[rgba(201,168,76,0.1)]">
          {[
            { id: "orders", label: "Orders" },
            { id: "products", label: "Products" },
            { id: "settings", label: "Settings" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`pb-3 text-sm uppercase tracking-widest font-bold transition-all border-b-2 ${
                activeTab === id
                  ? "text-wb-gold border-wb-gold"
                  : "text-wb-cream border-transparent hover:text-wb-gold/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════ TAB: ORDERS ══ */}
        {activeTab === "orders" && (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Orders", value: totalOrders },
                { label: "Pending", value: pendingCount },
                { label: "Delivered", value: deliveredCount },
              ].map(({ label, value }) => (
                <div key={label} className={`${cardStyle} p-6 flex flex-col items-center justify-center text-center`}>
                  <p className="text-4xl font-cormorant text-wb-gold mb-1">{value}</p>
                  <p className="text-xs uppercase tracking-widest text-wb-cream opacity-70">{label}</p>
                </div>
              ))}
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <Spinner />
            ) : orders.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-cormorant italic text-wb-cream text-2xl opacity-60">
                  No orders yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })
                    : "—";

                  return (
                    <div key={order.id} className={`${cardStyle} p-5`}>
                      {/* Top Row */}
                      <div className="flex justify-between items-center border-b border-[rgba(201,168,76,0.1)] pb-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-cormorant text-xl text-wb-gold font-bold">
                            #{typeof order.id === "string" ? order.id.slice(0, 8).toUpperCase() : order.id}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <span className="text-xs text-wb-cream opacity-60 flex items-center gap-1.5">
                          <Clock size={12} /> {dateStr}
                        </span>
                      </div>

                      {/* Content Row */}
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        {/* Info */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-wb-cream font-bold">{order.customer_name || "Unknown Customer"}</p>
                            <p className="text-wb-cream/70 text-sm">{order.customer_phone}</p>
                          </div>
                          
                          <div className="text-sm text-wb-cream/80 space-y-1">
                            <p>
                              <span className="text-wb-gold/70 mr-1 uppercase text-xs tracking-wider">Type:</span> 
                              {order.delivery_type === "delivery" ? "Delivery" : "Pickup"}
                            </p>
                            {(order.delivery_address || order.customer_delivery_address) && (
                              <p>
                                <span className="text-wb-gold/70 mr-1 uppercase text-xs tracking-wider">Address:</span> 
                                {order.delivery_address || order.customer_delivery_address}
                              </p>
                            )}
                            {order.preferred_delivery_date && (
                              <p>
                                <span className="text-wb-gold/70 mr-1 uppercase text-xs tracking-wider">Time:</span> 
                                {order.preferred_delivery_date} {order.preferred_delivery_time}
                              </p>
                            )}
                          </div>

                          {/* Items */}
                          <div className="pt-2">
                            <p className="text-xs uppercase tracking-widest text-wb-gold/70 mb-2">Order Items</p>
                            <div className="flex flex-wrap gap-2">
                              {items.map((item, i) => (
                                <span key={i} className="bg-wb-dark border border-[rgba(201,168,76,0.2)] px-2 py-1 rounded text-xs text-wb-cream">
                                  {item.quantity}× {item.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end justify-between min-w-[150px] border-t md:border-t-0 md:border-l border-[rgba(201,168,76,0.1)] pt-4 md:pt-0 md:pl-6">
                          <p className="font-bold text-wb-gold text-2xl mb-4">
                            {formatPrice(order.total_amount || 0)}
                          </p>
                          
                          <div className="w-full relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order, e.target.value)}
                              className="w-full appearance-none bg-wb-dark border border-[rgba(201,168,76,0.4)] text-wb-cream text-sm px-3 py-2 rounded focus:outline-none focus:border-wb-gold cursor-pointer"
                            >
                              <option value="received">Received</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-wb-gold pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════ TAB: PRODUCTS ══ */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-end mb-6">
              <button onClick={() => setIsProductModalOpen(true)} className={btnSolid + " flex items-center gap-2"}>
                <Upload size={16} /> Add New Product
              </button>
            </div>

            {productsLoading ? (
              <Spinner />
            ) : products.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-cormorant italic text-wb-cream text-2xl opacity-60">
                  No products yet. Add your first product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className={`${cardStyle} overflow-hidden flex flex-col`}>
                    <div className="relative h-48 bg-wb-dark overflow-hidden">
                      {product.image_url ? (
                        <>
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-wb-dark/80 via-transparent to-wb-dark/40" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-wb-gold/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-[#1a1917]/90 backdrop-blur-sm border border-[rgba(201,168,76,0.3)] px-2 py-1 rounded text-[10px] uppercase tracking-widest text-wb-gold">
                        {product.category}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-cormorant text-xl font-bold text-wb-cream mb-1 truncate">{product.name}</h3>
                      <p className="text-wb-gold font-bold mb-3">{formatPrice(product.price)}</p>
                      
                      <div className="flex gap-2 mb-4">
                        {product.is_featured && <span className="text-[10px] uppercase tracking-wider bg-wb-gold/10 text-wb-gold px-2 py-0.5 rounded border border-wb-gold/20">Featured</span>}
                        {!product.is_available && <span className="text-[10px] uppercase tracking-wider bg-[#ef5350]/10 text-[#ef5350] px-2 py-0.5 rounded border border-[#ef5350]/20">Hidden</span>}
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-2">
                        <button onClick={() => {}} className={btnOutlineGold + " flex justify-center items-center gap-1 opacity-50 cursor-not-allowed"} disabled>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(product)} className={btnOutlineRed + " flex justify-center items-center gap-1"}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Modal */}
            {isProductModalOpen && (
              <div className="fixed inset-0 bg-wb-dark/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className={`${cardStyle} w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-cormorant italic text-3xl text-wb-gold">Add New Product</h2>
                    <button onClick={closeModal} className="text-wb-cream/60 hover:text-wb-gold transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleAddProduct} className="space-y-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-wb-cream/70 mb-2">Product Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-wb-cream/70 mb-2">Price (Le)</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData(p => ({...p, price: e.target.value}))} className={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-wb-cream/70 mb-2">Category</label>
                        <div className="relative">
                          <select value={formData.category} onChange={(e) => setFormData(p => ({...p, category: e.target.value}))} className={`${inputStyle} appearance-none cursor-pointer`}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-wb-gold/60 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-wb-cream/70 mb-2">Image</label>
                      <div 
                        className="border-2 border-dashed border-[rgba(201,168,76,0.3)] hover:border-wb-gold transition-colors rounded p-4 text-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        {imagePreview ? (
                          <div className="flex flex-col items-center gap-2">
                            <img src={imagePreview} alt="preview" className="h-24 object-cover rounded border border-[rgba(201,168,76,0.3)]" />
                            <span className="text-xs text-wb-cream/70">{imageFile?.name}</span>
                          </div>
                        ) : (
                          <div className="text-wb-cream/60 flex flex-col items-center gap-2">
                            <Upload size={24} className="text-wb-gold/50" />
                            <span className="text-sm">Click to select image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-6 py-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData(p => ({...p, is_available: e.target.checked}))} className="accent-wb-gold w-4 h-4" />
                        <span className="text-sm text-wb-cream">Available</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData(p => ({...p, is_featured: e.target.checked}))} className="accent-wb-gold w-4 h-4" />
                        <span className="text-sm text-wb-cream">Featured</span>
                      </label>
                    </div>

                    {formError && <p className="text-[#ef5350] text-sm flex items-center gap-1.5"><AlertCircle size={14}/> {formError}</p>}

                    <div className="flex gap-3 pt-2 border-t border-[rgba(201,168,76,0.1)]">
                      <button type="button" onClick={closeModal} className="flex-1 border border-wb-cream/20 text-wb-cream hover:bg-wb-cream/10 py-2 rounded font-dm-sans font-bold transition-all">Cancel</button>
                      <button type="submit" disabled={formLoading} className="flex-1 bg-wb-gold text-wb-dark hover:brightness-110 py-2 rounded font-dm-sans font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                        {formLoading ? <div className="w-4 h-4 border-2 border-wb-dark/30 border-t-wb-dark rounded-full animate-spin" /> : "Save Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════ TAB: SETTINGS ══ */}
        {activeTab === "settings" && (
          <div className="flex justify-center pt-8">
            <div className={`${cardStyle} w-full max-w-md p-8`}>
              <h2 className="font-cormorant italic text-3xl text-wb-gold mb-6 text-center">Change PIN</h2>
              <ChangePinForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Change PIN Form ──────────────────────────────────────────────────────────

function ChangePinForm() {
  const [fields, setFields] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const clean = value.replace(/\D/g, "").slice(0, 4);
    setFields((prev) => ({ ...prev, [name]: clean }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const storedPin =
      localStorage.getItem("wb_admin_pin") ||
      import.meta.env.VITE_ADMIN_PIN ||
      "1234";

    if (fields.current !== storedPin) {
      setError("Current PIN is incorrect.");
      return;
    }
    if (fields.next.length !== 4) {
      setError("New PIN must be exactly 4 digits.");
      return;
    }
    if (fields.next !== fields.confirm) {
      setError("New PIN and Confirm PIN do not match.");
      return;
    }

    localStorage.setItem("wb_admin_pin", fields.next);
    setSuccess("PIN updated successfully.");
    setFields({ current: "", next: "", confirm: "" });
  };

  const inputClass = "w-full bg-wb-dark border border-[rgba(201,168,76,0.25)] text-wb-cream text-center text-xl tracking-[0.5em] px-3 py-3 rounded focus:border-wb-gold focus:outline-none focus:shadow-[0_0_0_2px_rgba(201,168,76,0.2)] transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-dm-sans text-xs uppercase tracking-widest text-wb-cream/70 mb-2 text-center">
          Current PIN
        </label>
        <input
          type="password"
          name="current"
          value={fields.current}
          onChange={handleChange}
          placeholder="••••"
          inputMode="numeric"
          maxLength={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block font-dm-sans text-xs uppercase tracking-widest text-wb-cream/70 mb-2 text-center">
          New PIN
        </label>
        <input
          type="password"
          name="next"
          value={fields.next}
          onChange={handleChange}
          placeholder="••••"
          inputMode="numeric"
          maxLength={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block font-dm-sans text-xs uppercase tracking-widest text-wb-cream/70 mb-2 text-center">
          Confirm New PIN
        </label>
        <input
          type="password"
          name="confirm"
          value={fields.confirm}
          onChange={handleChange}
          placeholder="••••"
          inputMode="numeric"
          maxLength={4}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-[#ef5350] text-sm font-dm-sans flex items-center justify-center gap-1.5 mt-2">
          <AlertCircle size={15} /> {error}
        </p>
      )}

      {success && (
        <p className="text-[#4caf50] text-sm font-dm-sans flex items-center justify-center gap-1.5 mt-2">
          <CheckCircle size={15} /> {success}
        </p>
      )}

      <button type="submit" className="w-full bg-wb-gold text-wb-dark font-dm-sans font-bold uppercase tracking-wider py-3 rounded mt-6 hover:brightness-110 transition-all">
        Save PIN
      </button>
    </form>
  );
}
