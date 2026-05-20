import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-wb-dark/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-cormorant text-2xl font-bold text-wb-gold hover:text-wb-cream transition-colors"
        >
          WONDER
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
          >
            Menu
          </Link>
          <a
            href="/#about"
            className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
          >
            About
          </a>
          <a
            href="/#testimonials"
            className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
          >
            Reviews
          </a>
        </div>
        <button
          className="md:hidden p-2 text-wb-cream hover:text-wb-gold transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-wb-dark-lighter border-t border-wb-gold/20 animate-slideIn">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link
              to="/"
              className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <a
              href="/#about"
              className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/#testimonials"
              className="text-wb-cream hover:text-wb-gold transition-colors font-dm-sans"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
