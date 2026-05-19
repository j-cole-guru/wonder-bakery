import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { OrderModal } from "../components/OrderModal";
import { ChevronRight, ChevronLeft, MapPin, Phone, Clock } from "lucide-react";
import { useFeaturedProducts } from "../hooks/useProducts";

export function Home() {
  const navigate = useNavigate();
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const featuredProducts = useFeaturedProducts();

  const testimonials = [
    {
      customer_name: "Aminata K.",
      message:
        "The cakes from Wonder Bakery are absolutely divine! Every birthday I order from them and the quality never disappoints.",
      rating: 5,
    },
    {
      customer_name: "Mohamed S.",
      message:
        "Best bread in Freetown, hands down. Fresh every morning and the sourdough is out of this world!",
      rating: 5,
    },
    {
      customer_name: "Fatmata D.",
      message:
        "Ordered a custom wedding cake and it was beyond beautiful. The taste matched the look — pure perfection.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const galleryImages = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500",
  ];

  const scrollTestimonial = (direction) => {
    if (testimonials.length === 0) return;
    if (direction === "next") {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      setTestimonialIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length,
      );
    }
  };

  return (
    <div className="bg-wb-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 grain opacity-20"></div>

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-wb-gold/5 to-transparent"></div>

        <div className="relative z-10 text-center max-w-4xl px-4 md:px-8 animate-fadeIn">
          <div className="mb-6 overflow-hidden">
            <h1
              className="font-cormorant text-5xl md:text-7xl font-bold text-wb-gold animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              WONDER BAKERY
            </h1>
          </div>

          <p
            className="font-dm-sans text-xl md:text-2xl text-wb-cream mb-2 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            Taste the Grace in Every Embrace
          </p>
          <p
            className="font-dm-sans text-sm text-wb-gold/70 mb-8 animate-fadeIn flex items-center justify-center gap-2"
            style={{ animationDelay: "0.5s" }}
          >
            <MapPin size={13} className="inline" />
            Wilkinson Road, Cockerill Junction, Freetown, Sierra Leone
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn"
            style={{ animationDelay: "0.6s" }}
          >
            <button onClick={() => navigate("/menu")} className="btn-primary">
              Order Now
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("about");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-secondary"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-wb-gold rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-wb-gold rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-cormorant text-4xl md:text-5xl text-wb-cream mb-3">
            Featured Selection
          </h2>
          <div className="w-16 h-0.5 bg-wb-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section id="about" className="section-container bg-wb-dark-lighter">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-fadeIn">
            <p className="font-dm-sans text-xs text-wb-gold uppercase tracking-widest mb-3">
              Wilkinson Road, Cockerill Junction · Freetown, Sierra Leone
            </p>
            <h2 className="font-cormorant text-4xl text-wb-cream mb-2">
              Crafted with <span className="text-wb-gold">Love</span>
            </h2>
            <p className="font-dm-sans text-wb-gold/80 italic text-sm mb-5">
              "Taste the grace in every embrace"
            </p>
            <p className="font-dm-sans text-wb-cream/80 leading-relaxed mb-4">
              Wonder Bakery is Freetown's home of handcrafted celebration cakes,
              pastries, small chops and full catering services. From intimate
              birthdays to grand weddings and corporate events, we pour passion
              into every single order.
            </p>
            <p className="font-dm-sans text-wb-cream/80 leading-relaxed mb-6">
              Based on Wilkinson Road, Cockerill Junction, we are{" "}
              <span className="text-wb-gold font-medium">always open</span> and
              ready to make your occasion unforgettable — with custom birthday
              cakes, elegant wedding tiers, cupcakes, parfaits, spring rolls,
              samosas, puff-puff, food trays and so much more.
            </p>

            {/* Services tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Birthday Cakes",
                "Wedding Cakes",
                "Cupcakes & Parfaits",
                "Small Chops",
                "Food Trays",
                "Catering",
                "Corporate Events",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-dm-sans bg-wb-gold/10 border border-wb-gold/30 text-wb-gold px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate("/menu")} className="btn-primary">
                Order Now
              </button>
              <a
                href="https://wa.me/23279214582"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Logo / Image */}
          <div className="flex flex-col items-center gap-6">
            <div className="aspect-square w-64 md:w-72 overflow-hidden rounded-full border-4 border-wb-gold/40 hover:border-wb-gold transition-colors bg-white flex items-center justify-center p-4">
              <img
                src="https://scontent.ffna1-2.fna.fbcdn.net/v/t39.30808-1/p200x200/wonder_bakery_logo.jpg"
                alt="Wonder Bakery Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500";
                  e.target.className = "w-full h-full object-cover";
                }}
              />
            </div>
            {/* Contact info card */}
            <div className="bg-wb-dark border border-wb-gold/20 rounded-lg px-6 py-4 w-full max-w-xs space-y-3">
              <div className="flex items-start gap-3 text-sm font-dm-sans text-wb-cream/70">
                <MapPin
                  size={15}
                  className="text-wb-gold flex-shrink-0 mt-0.5"
                />
                <span>Wilkinson Road, Cockerill Junction, Freetown</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-dm-sans text-wb-cream/70">
                <Phone size={15} className="text-wb-gold flex-shrink-0" />
                <a
                  href="tel:+23279214582"
                  className="text-wb-gold hover:text-wb-cream transition-colors"
                >
                  +232 79 214582
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm font-dm-sans text-wb-cream/70">
                <Clock size={15} className="text-wb-gold flex-shrink-0" />
                <span className="text-wb-gold font-medium uppercase tracking-widest text-xs">
                  Always Open
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-cormorant text-4xl md:text-5xl text-wb-cream mb-3">
            Love from Our Customers
          </h2>
          <div className="w-16 h-0.5 bg-wb-gold mx-auto"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          {testimonials.length > 0 ? (
            <div className="bg-wb-dark-lighter border-2 border-wb-gold/30 rounded-lg p-8 md:p-12 animate-fadeIn">
              <div className="flex gap-1.5 mb-4">
                {[...Array(testimonials[testimonialIndex]?.rating || 5)].map(
                  (_, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-wb-gold inline-block"
                    ></span>
                  ),
                )}
              </div>
              <p className="font-dm-sans text-wb-cream mb-6 text-lg italic leading-relaxed">
                "{testimonials[testimonialIndex]?.message}"
              </p>
              <p className="font-cormorant text-wb-gold text-lg">
                {testimonials[testimonialIndex]?.customer_name}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-wb-cream/50 font-dm-sans">
              Loading reviews...
            </div>
          )}

          {/* Navigation */}
          {testimonials.length > 0 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => scrollTestimonial("prev")}
                className="p-3 border-2 border-wb-gold/30 rounded-full hover:border-wb-gold hover:text-wb-gold transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === testimonialIndex
                        ? "bg-wb-gold w-6"
                        : "bg-wb-gold/30"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => scrollTestimonial("next")}
                className="p-3 border-2 border-wb-gold/30 rounded-full hover:border-wb-gold hover:text-wb-gold transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-cormorant text-4xl md:text-5xl text-wb-cream mb-3">
            Gallery
          </h2>
          <div className="w-16 h-0.5 bg-wb-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-lg border border-wb-gold/20 hover:border-wb-gold transition-all hover:scale-105 ${
                index === 2 || index === 5 ? "md:row-span-2 md:col-span-1" : ""
              }`}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          ))}
        </div>
      </section>

      <OrderModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
