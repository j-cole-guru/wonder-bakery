import React from "react";
import { ShoppingBag } from "lucide-react";

export function ProductCard({ product, onOrder }) {
  const formatPrice = (price) => `Le ${price.toLocaleString()}`;

  return (
    <div className="card-base group animate-fadeIn">
      <div className="relative w-full aspect-square overflow-hidden bg-wb-dark">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.is_featured && (
          <div className="absolute top-3 right-3 bg-wb-gold text-wb-dark text-xs font-bold px-3 py-1 rounded">
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-wb-gold text-xs font-dm-sans uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        <h3 className="font-cormorant text-lg text-wb-cream mb-1 group-hover:text-wb-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-wb-cream/60 text-sm font-dm-sans mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-cormorant text-xl text-wb-gold">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onOrder(product)}
            className="px-4 py-2 rounded text-sm font-dm-sans font-medium bg-wb-gold/20 text-wb-gold border border-wb-gold hover:bg-wb-gold hover:text-wb-dark transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingBag size={14} />
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
