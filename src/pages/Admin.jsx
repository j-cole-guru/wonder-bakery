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
} from "lucide-react";

const isMockMode =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes("your-project-id");
const CATEGORIES = ["Bread", "Cakes", "Pastries", "Drinks", "Other"];
const ADMIN_KEY = "wb_admin";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(amount) {
  return `Le ${Number(amount).toLocaleString("en-US")}`;
}

function StatusBadge({ status }) {
  const map = {
    received: {
      label: "Received",
      classes: "bg-yellow-500/20 text-yellow-700 border-yellow-400/50",
    },
    preparing: {
      label: "Preparing",
      classes: "bg-blue-500/20 text-blue-700 border-blue-400/50",
    },
    ready: {
      label: "Ready",
      classes: "bg-purple-500/20 text-purple-700 border-purple-400/50",
    },
    delivered: {
      label: "Delivered",
      classes: "bg-green-500/20 text-green-700 border-green-400/50",
    },
  };
  const s = map[status] || map.received;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-lato text-xs uppercase tracking-wide border ${s.classes}`}
    >
      {s.label}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="spinner-terra" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Admin() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Bread",
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
        // Base64 encode image for localStorage
        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result;
          const newProduct = {
            id: `mock_${Date.now()}`,
            name: formData.name.trim(),
            price: Number(formData.price),
            category: formData.category,
            image_url: base64Url,
            is_available: true,
            is_featured: false,
            created_at: new Date().toISOString(),
          };
          const stored = localStorage.getItem("wb_products");
          const existing = stored ? JSON.parse(stored) : [];
          const updated = [newProduct, ...existing];
          localStorage.setItem("wb_products", JSON.stringify(updated));
          setProducts(updated);
          resetForm();
          setFormLoading(false);
        };
        reader.readAsDataURL(imageFile);
        return; // early return; setFormLoading(false) is in the reader callback
      }

      // Live mode — upload image via admin client (service role bypasses RLS)
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
        is_available: true,
        is_featured: false,
      });
      if (insertError) throw insertError;

      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error adding product:", err);
      setFormError(err.message || "Failed to add product. Please try again.");
      setFormLoading(false);
    }
  }

  function resetForm() {
    setFormData({ name: "", price: "", category: "Bread" });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormLoading(false);
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

      // Live mode
      const adminClient = getSupabaseAdmin();

      // Try to delete the image from storage (best-effort)
      if (product.image_url) {
        try {
          const parts = product.image_url.split("/product-images/");
          if (parts.length === 2) {
            await adminClient.storage.from("product-images").remove([parts[1]]);
          }
        } catch (_) {
          /* ignore storage errors */
        }
      }

      const { error } = await adminClient
        .from("products")
        .delete()
        .eq("id", product.id);
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

  // ── Orders: mark delivered ────────────────────────────────────────────────────
  async function handleMarkDelivered(order) {
    if (order.status === "delivered") return; // already delivered, no-op

    try {
      if (isMockMode) {
        const stored = localStorage.getItem("wb_orders");
        const existing = stored ? JSON.parse(stored) : [];
        const updated = existing.map((o) =>
          o.id === order.id ? { ...o, status: "delivered" } : o,
        );
        localStorage.setItem("wb_orders", JSON.stringify(updated));
        setOrders(updated);
        return;
      }

      // Optimistic UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: "delivered" } : o,
        ),
      );

      const { error } = await supabase
        .from("orders")
        .update({ status: "delivered" })
        .eq("id", order.id);
      if (error) throw error;
    } catch (err) {
      console.error("Error marking order delivered:", err);
      // Revert optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: order.status } : o,
        ),
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
    <div className="pt-20 pb-12 min-h-screen bg-wb-bg">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-playfair italic text-3xl sm:text-4xl text-wb-brown">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded border border-wb-border text-wb-muted hover:text-wb-terra hover:border-wb-terra transition-colors text-sm font-lato"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-8 bg-wb-cream border border-wb-border rounded p-1 w-full sm:w-fit overflow-x-auto">
          {[
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md transition-all ${
                activeTab === id
                  ? "bg-wb-terra text-wb-cream font-lato font-bold text-xs uppercase tracking-wider"
                  : "text-wb-muted hover:text-wb-brown font-lato text-xs uppercase tracking-wider"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════ TAB: PRODUCTS ══ */}
        {activeTab === "products" && (
          <div>
            {/* ── Add Product Form ── */}
            <div className="card-base mb-8">
              <h2 className="font-playfair italic text-2xl text-wb-brown mb-6 flex items-center gap-2">
                <Upload size={20} />
                Add New Product
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-wb-muted text-xs uppercase tracking-wide font-lato mb-1.5">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sourdough Loaf"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full bg-wb-bg border border-wb-border rounded px-3 py-2.5 text-wb-brown font-lato text-sm placeholder-wb-muted/50 focus:border-wb-terra focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-wb-muted text-xs uppercase tracking-wide font-lato mb-1.5">
                      Price in Le
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, price: e.target.value }))
                      }
                      className="w-full bg-wb-bg border border-wb-border rounded px-3 py-2.5 text-wb-brown font-lato text-sm placeholder-wb-muted/50 focus:border-wb-terra focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-wb-muted text-xs uppercase tracking-wide font-lato mb-1.5">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className="w-full appearance-none bg-wb-bg border border-wb-border rounded px-3 py-2.5 text-wb-brown font-lato text-sm focus:border-wb-terra focus:outline-none transition-colors"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-wb-muted/60 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-wb-muted text-xs uppercase tracking-wide font-lato mb-1.5">
                      Product Image
                    </label>
                    <div
                      className="relative w-full border-2 border-dashed border-wb-border rounded overflow-hidden cursor-pointer hover:border-wb-terra transition-colors"
                      style={{ height: "44px" }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview ? (
                        <div className="flex items-center gap-3 px-3 h-full">
                          <img
                            src={imagePreview}
                            alt="preview"
                            className="h-8 w-8 object-cover rounded"
                          />
                          <span className="text-wb-muted text-sm truncate">
                            {imageFile?.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 h-full text-wb-muted text-sm">
                          <Upload size={15} />
                          Click to choose image
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="text-red-600 text-sm font-lato">{formError}</p>
                )}

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-wb-dark/30 border-t-wb-dark rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Add Product
                      </>
                    )}
                  </button>
                  {(formData.name || formData.price || imageFile) &&
                    !formLoading && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-wb-muted hover:text-wb-terra transition-colors text-sm font-lato"
                      >
                        Clear
                      </button>
                    )}
                </div>
              </form>
            </div>

            {/* ── Products List ── */}
            <h2 className="font-playfair italic text-2xl text-wb-brown mb-4">
              Products ({products.length})
            </h2>

            {productsLoading ? (
              <Spinner />
            ) : products.length === 0 ? (
              <div className="card-base text-center py-16">
                <Package size={48} className="mx-auto text-wb-terra/30 mb-4" />
                <p className="font-lato text-wb-muted">
                  No products yet. Add your first product above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-wb-cream border border-wb-border rounded overflow-hidden hover:shadow-warm transition-all group"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-wb-bg overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-wb-terra/20" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="font-playfair text-wb-brown text-sm font-medium truncate">
                        {product.name}
                      </p>
                      <p className="font-lato font-bold text-wb-terra text-sm mt-0.5">
                        {formatPrice(product.price)}
                      </p>
                      <p className="font-lato text-[10px] uppercase tracking-widest text-wb-terra mt-0.5">
                        {product.category}
                      </p>

                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-500 hover:text-red-700 text-xs transition-colors"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════ TAB: ORDERS ══ */}
        {activeTab === "orders" && (
          <div>
            {/* ── Stats bar ── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              {[
                {
                  label: "Total Orders",
                  value: totalOrders,
                  color: "text-wb-terra",
                },
                {
                  label: "Delivered",
                  value: deliveredCount,
                  color: "text-green-700",
                },
                {
                  label: "Pending",
                  value: pendingCount,
                  color: "text-wb-brown",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-wb-cream border border-wb-border rounded p-4 text-center"
                >
                  <p className="font-lato text-xs uppercase tracking-wide text-wb-muted mb-1">
                    {label}
                  </p>
                  <p className={`font-playfair text-2xl ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* ── Orders list ── */}
            {ordersLoading ? (
              <Spinner />
            ) : orders.length === 0 ? (
              <div className="card-base text-center py-16">
                <ShoppingBag
                  size={48}
                  className="mx-auto text-wb-terra/30 mb-4"
                />
                <p className="font-lato text-wb-muted">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isDelivered = order.status === "delivered";
                  const items = Array.isArray(order.items) ? order.items : [];
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  return (
                    <div
                      key={order.id}
                      className={`bg-wb-cream border border-wb-border rounded-lg p-4 sm:p-5 transition-all ${isDelivered ? "opacity-60" : ""}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        {/* ── Left: order info ── */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {isDelivered && (
                              <CheckCircle
                                size={16}
                                className="text-green-700 shrink-0"
                              />
                            )}
                            <span className="font-lato text-xs text-wb-muted font-mono">
                              #
                              {typeof order.id === "string"
                                ? order.id.slice(0, 8).toUpperCase()
                                : order.id}
                            </span>
                            <StatusBadge status={order.status} />
                            <span className="font-lato text-wb-muted/60 text-xs flex items-center gap-1">
                              <Clock size={11} />
                              {dateStr}
                            </span>
                          </div>

                          {/* Customer */}
                          <div className="mb-2">
                            <span className="font-playfair text-wb-brown font-medium">
                              {order.customer_name || "Unknown"}
                            </span>
                            {order.customer_phone && (
                              <span className="font-lato text-wb-muted text-sm ml-2">
                                {order.customer_phone}
                              </span>
                            )}
                          </div>

                          {/* Items */}
                          {items.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {items.map((item, i) => (
                                <span
                                  key={i}
                                  className="inline-block bg-wb-bg border border-wb-border px-2 py-0.5 rounded font-lato text-xs text-wb-muted"
                                >
                                  {item.quantity}× {item.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Delivery info */}
                          {order.delivery_type && (
                            <p className="font-lato text-wb-muted text-xs capitalize">
                              {order.delivery_type === "delivery"
                                ? "Delivery"
                                : "Pickup"}
                            </p>
                          )}
                          {order.delivery_address && (
                            <p className="font-lato text-wb-muted text-xs">
                              {order.delivery_address}
                            </p>
                          )}
                          {order.customer_delivery_address && (
                            <p className="font-lato text-wb-muted text-xs">
                              <span className="text-wb-muted/60 font-lato">
                                Address:{" "}
                              </span>
                              {order.customer_delivery_address}
                            </p>
                          )}
                          {order.preferred_delivery_date && (
                            <p className="font-lato text-wb-muted text-xs">
                              <span className="text-wb-muted/60 font-lato">
                                Date:{" "}
                              </span>
                              {order.preferred_delivery_date}
                            </p>
                          )}
                          {order.preferred_delivery_time && (
                            <p className="font-lato text-wb-muted text-xs">
                              <span className="text-wb-muted/60 font-lato">
                                Time:{" "}
                              </span>
                              {order.preferred_delivery_time}
                            </p>
                          )}
                        </div>

                        {/* ── Right: price + action ── */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                          <p className="font-playfair text-wb-terra text-xl font-medium">
                            {formatPrice(order.total_amount || 0)}
                          </p>

                          {/* Mark as Delivered toggle */}
                          <label
                            className={`flex items-center gap-2 cursor-pointer select-none ${
                              isDelivered ? "cursor-default" : "cursor-pointer"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDelivered}
                              disabled={isDelivered}
                              onChange={() => handleMarkDelivered(order)}
                              className="w-4 h-4 accent-green-700 cursor-pointer disabled:cursor-default"
                            />
                            <span
                              className={`text-xs font-lato ${isDelivered ? "text-green-700" : "text-wb-muted"}`}
                            >
                              {isDelivered ? "Delivered ✓" : "Mark Delivered"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════ TAB: SETTINGS ══ */}
        {activeTab === "settings" && (
          <div className="max-w-md">
            <div className="card-base p-6">
              <h2 className="font-playfair italic text-2xl text-wb-brown mb-1 flex items-center gap-2">
                <Settings size={20} />
                Change PIN
              </h2>
              <p className="font-lato text-wb-muted text-sm mb-6">
                Update the 4-digit PIN used to access this dashboard.
              </p>
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
    // allow only digits, max 4
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current PIN */}
      <div>
        <label className="block font-lato text-xs uppercase tracking-wide text-wb-muted mb-1">
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
          className="w-full bg-wb-bg border border-wb-border text-wb-brown text-center text-xl tracking-widest px-3 py-2.5 rounded focus:border-wb-terra focus:outline-none transition-colors"
        />
      </div>

      {/* New PIN */}
      <div>
        <label className="block font-lato text-xs uppercase tracking-wide text-wb-muted mb-1">
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
          className="w-full bg-wb-bg border border-wb-border text-wb-brown text-center text-xl tracking-widest px-3 py-2.5 rounded focus:border-wb-terra focus:outline-none transition-colors"
        />
      </div>

      {/* Confirm New PIN */}
      <div>
        <label className="block font-lato text-xs uppercase tracking-wide text-wb-muted mb-1">
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
          className="w-full bg-wb-bg border border-wb-border text-wb-brown text-center text-xl tracking-widest px-3 py-2.5 rounded focus:border-wb-terra focus:outline-none transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm font-lato flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {/* Success */}
      {success && (
        <p className="text-green-700 text-sm font-lato flex items-center gap-1">
          <CheckCircle size={14} />
          {success}
        </p>
      )}

      <button type="submit" className="btn-primary w-full mt-2">
        Save PIN
      </button>
    </form>
  );
}
