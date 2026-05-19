# WONDER BAKERY — Luxury Bakery Website

A modern, dark luxury bakery website built with React, Vite, and TailwindCSS. Features include an elegant product menu, shopping cart, checkout system, order tracking, and admin dashboard.

## 🏛️ Features

### 🛍️ Customer Features
- **Home Page**: Hero section with featured products, testimonials carousel, gallery, and brand story
- **Menu**: Browse all products with category filters and search functionality
- **Shopping Cart**: Manage items, apply promo codes (use "WONDER10" for 10% off)
- **Checkout**: Multi-step checkout with delivery options and payment method selection
- **Order Tracking**: Real-time order status with WhatsApp integration links
- **Responsive Design**: Mobile-first approach, fully responsive across all devices

### 👨‍💼 Admin Features
- **Admin Dashboard**: Secure PIN-protected admin panel (PIN: 1234)
- **Order Management**: View, track, and update order status
- **Product Management**: Add, edit, and delete products
- **Analytics**: View today's orders, revenue, and pending order count

## 🎨 Design Aesthetic

- **Color Palette**: Dark luxury with gold accents
  - Background: `#0f0e0c` (Deep Charcoal)
  - Accent: `#c9a84c` (Gold)
  - Text: `#f5f0e8` (Cream)
  
- **Typography**: 
  - Headings: Cormorant Garamond (Google Fonts)
  - Body: DM Sans (Google Fonts)

- **Effects**: Subtle grain texture, smooth fade-in animations, gold accents on scroll

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```
The site will open at `http://localhost:5173`

3. **Build for Production**
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── Toast.jsx
│   ├── PaymentMethodCard.jsx
│   ├── OrderStatusTracker.jsx
│   ├── AdminPinGate.jsx
│   └── index.js
├── pages/              # Page components
│   ├── Home.jsx        # Landing page with hero, features, testimonials
│   ├── Menu.jsx        # Product listing with filters
│   ├── Cart.jsx        # Shopping cart with promo codes
│   ├── Checkout.jsx    # Order form and payment selection
│   ├── Track.jsx       # Order status tracking
│   ├── Admin.jsx       # Admin dashboard
│   └── index.js
├── context/            # React Context for state management
│   └── CartContext.jsx # Shopping cart state
├── data/               # Mock data
│   └── mockData.js     # Products, testimonials, constants
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
└── index.css           # TailwindCSS directives

public/
├── index.html          # HTML template
vite.config.js          # Vite configuration
tailwind.config.js      # TailwindCSS configuration
postcss.config.js       # PostCSS configuration
```

## 💾 Local Storage Schema

- **`wb_cart`**: Shopping cart items
  ```json
  {
    "items": [
      { "id": "1", "name": "...", "price": 25000, "quantity": 1, ... }
    ],
    "discount": 0
  }
  ```

- **`wb_orders`**: Order history
  ```json
  [
    {
      "id": "WB-1234",
      "customer": "Name",
      "phone": "076123456",
      "items": [...],
      "total": 50000,
      "paymentMethod": "Orange Money",
      "deliveryType": "delivery",
      "address": "...",
      "status": "received|preparing|ready|delivered",
      "createdAt": "ISO timestamp"
    }
  ]
  ```

- **`wb_products`**: Custom products (admin)
- **`wb_admin`**: Admin unlock flag

## 🔐 Admin Access

- Navigate to `/admin`
- Enter PIN: **1234**
- Dashboard includes:
  - Order management (status updates)
  - Product management (CRUD operations)
  - Daily statistics

## 📦 Promo Codes

- **WONDER10**: 10% discount (mock only)

## 🌍 Location Info

- **Location**: Freetown, Sierra Leone
- **Currency**: Sierra Leone Leones (Le)
- **Phone Format**: 076/077/078/079 + 7 digits

## 🔄 Integration Roadmap

The following features are mocked and ready for Supabase integration:

```javascript
// TODO: replace with Supabase query (search for this comment)
- mockProducts loading
- mockTestimonials loading
- Order creation and retrieval
- Product CRUD operations

// TODO: send WhatsApp notification (search for this comment)
- WhatsApp order confirmations
- WhatsApp status updates
```

Replace these TODO sections with actual Supabase client calls and WhatsApp API integration.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS 3
- **Routing**: React Router DOM 6
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: localStorage (mock data persistence)

## 📝 Notes

- All prices shown in Sierra Leone Leones (Le)
- No real payments processed (mock implementation)
- All data persisted in localStorage (replace with Supabase)
- Images pulled from Unsplash (free tier)
- Fully responsive, mobile-first design

## 🎯 Future Enhancements

- [ ] Supabase integration for data persistence
- [ ] WhatsApp API for notifications
- [ ] Email confirmations
- [ ] User authentication
- [ ] Review/rating system
- [ ] Inventory management
- [ ] Real payment integration
- [ ] Analytics dashboard
- [ ] Multi-language support

## 📄 License

Built with ❤️ for Wonder Bakery. All rights reserved.

---

**Happy Baking! 🥐**
