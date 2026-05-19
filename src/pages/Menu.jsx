import React, { useState, useMemo } from "react";
import { ProductCard } from "../components/ProductCard";
import { OrderModal } from "../components/OrderModal";
import { Search } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { CATEGORIES } from "../data/mockData";

export function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products dynamically from Supabase based on category tab selection
  const { products, loading } = useProducts(selectedCategory);

  const filteredProducts = useMemo(() => {
    let prods = products;

    // Search filter in memory on database results
    if (searchQuery) {
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return prods;
  }, [products, searchQuery]);

  return (
    <div className="bg-wb-dark min-h-screen pt-24 pb-12">
      <div className="section-container">
        <div className="text-center mb-12">
          <h1 className="font-cormorant text-5xl md:text-6xl text-wb-cream mb-3">
            Our Menu
          </h1>
          <p className="font-dm-sans text-wb-cream/70 text-lg">
            Discover our complete collection of artisanal baked goods
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wb-gold/50"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-wb-dark-lighter border-2 border-wb-gold/30 text-wb-cream placeholder:text-wb-cream/40 pl-10 pr-4 py-3 rounded focus:border-wb-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-12 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-3 min-w-min">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-dm-sans font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-wb-gold text-wb-dark"
                    : "border-2 border-wb-gold/30 text-wb-cream hover:border-wb-gold"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 rounded-full border-2 border-wb-gold border-t-transparent animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-dm-sans text-wb-cream/60 text-lg mb-4">
              No products found
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <OrderModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
