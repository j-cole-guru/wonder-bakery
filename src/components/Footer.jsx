import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

// Facebook SVG icon
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// TikTok SVG icon
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

// Instagram SVG icon
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function Footer() {
  const whatsappNumber = "23279214582";

  return (
    <footer className="bg-wb-dark-lighter pt-16 pb-8 border-t border-wb-gold/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-cormorant text-2xl text-wb-gold mb-1">
              WONDER BAKERY
            </h3>
            <p className="text-wb-gold/70 font-dm-sans text-xs italic mb-3">
              "Taste the grace in every embrace"
            </p>
            <p className="text-wb-cream/60 font-dm-sans text-sm leading-relaxed">
              Freetown's go-to bakery for custom cakes, small chops, catering
              and so much more — made with love on every occasion.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-5">
              <a
                href="https://www.facebook.com/share/1AE1U55R2y/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wb-gold hover:text-wb-cream transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://wa.me/23279214582"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wb-gold hover:text-wb-cream transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* What We Offer */}
          <div>
            <h4 className="font-cormorant text-lg text-wb-gold mb-4">
              What We Offer
            </h4>
            <ul className="space-y-2 font-dm-sans text-sm text-wb-cream/70">
              {[
                "Custom Birthday Cakes",
                "Wedding & Engagement Cakes",
                "Corporate & Event Cakes",
                "Cupcakes, Parfaits & Treats",
                "Small Chops & Pastries",
                "Food Trays (Party & Family)",
                "Full Catering Services",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight
                    size={12}
                    className="text-wb-gold flex-shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cormorant text-lg text-wb-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 font-dm-sans text-sm">
              <li>
                <Link
                  to="/"
                  className="text-wb-cream/70 hover:text-wb-gold transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-wb-cream/70 hover:text-wb-gold transition-colors"
                >
                  Our Menu
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1AE1U55R2y/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wb-cream/70 hover:text-wb-gold transition-colors"
                >
                  Facebook Page
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wb-cream/70 hover:text-wb-gold transition-colors"
                >
                  Order via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cormorant text-lg text-wb-gold mb-4">
              Find Us
            </h4>
            <div className="space-y-4 text-sm font-dm-sans">
              <div className="flex gap-2 text-wb-cream/70">
                <MapPin
                  size={16}
                  className="text-wb-gold flex-shrink-0 mt-0.5"
                />
                <p>
                  Wilkinson Road, Cockerill Junction,
                  <br />
                  Freetown, Sierra Leone
                </p>
              </div>
              <div className="flex gap-2 text-wb-cream/70">
                <Clock
                  size={16}
                  className="text-wb-gold flex-shrink-0 mt-0.5"
                />
                <p>Always Open</p>
              </div>
              <div className="flex gap-2 text-wb-cream/70">
                <Phone
                  size={16}
                  className="text-wb-gold flex-shrink-0 mt-0.5"
                />
                <div>
                  <a
                    href="tel:+23279214582"
                    className="hover:text-wb-gold transition-colors block"
                  >
                    +232 79 214582
                  </a>
                  <a
                    href="https://wa.me/23279214582"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wb-gold hover:text-wb-cream transition-colors text-xs mt-1 flex items-center gap-1"
                  >
                    <MessageCircle size={12} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-wb-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-wb-cream/50 font-dm-sans text-xs tracking-wider">
            &copy; 2025 <span className="text-wb-gold">Wonder Bakery</span>. All
            Rights Reserved. Freetown, Sierra Leone
          </p>
          <Link
            to="/admin"
            className="text-wb-gold/30 hover:text-wb-gold transition-colors tracking-widest text-[10px] uppercase font-medium font-dm-sans"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
