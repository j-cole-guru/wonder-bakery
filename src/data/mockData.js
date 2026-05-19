// TODO: replace with Supabase query
export const mockProducts = [
  { 
    id: '1', 
    name: 'Sourdough Loaf', 
    category: 'Breads', 
    price: 25000, 
    description: 'Naturally fermented, crispy crust', 
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 
    is_featured: true, 
    dietary_tags: ['vegan'] 
  },
  { 
    id: '2', 
    name: 'Butter Croissant', 
    category: 'Pastries', 
    price: 15000, 
    description: 'Flaky, buttery, golden layers', 
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 
    is_featured: true, 
    dietary_tags: [] 
  },
  { 
    id: '3', 
    name: 'Chocolate Cake', 
    category: 'Cakes', 
    price: 180000, 
    description: 'Rich dark chocolate, 6 layers', 
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 
    is_featured: true, 
    dietary_tags: [] 
  },
  { 
    id: '4', 
    name: 'Cinnamon Roll', 
    category: 'Pastries', 
    price: 20000, 
    description: 'Soft dough, caramel glaze', 
    image_url: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400', 
    is_featured: false, 
    dietary_tags: [] 
  },
  { 
    id: '5', 
    name: 'Baguette', 
    category: 'Breads', 
    price: 12000, 
    description: 'Classic French style', 
    image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=400', 
    is_featured: false, 
    dietary_tags: ['vegan'] 
  },
  { 
    id: '6', 
    name: 'Red Velvet Cake', 
    category: 'Cakes', 
    price: 200000, 
    description: 'Cream cheese frosting, velvety crumb', 
    image_url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400', 
    is_featured: false, 
    dietary_tags: [] 
  },
  { 
    id: '7', 
    name: 'Cappuccino', 
    category: 'Drinks', 
    price: 18000, 
    description: 'Double shot, silky foam', 
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 
    is_featured: false, 
    dietary_tags: [] 
  },
  { 
    id: '8', 
    name: 'Blueberry Muffin', 
    category: 'Pastries', 
    price: 14000, 
    description: 'Bursting with fresh blueberries', 
    image_url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', 
    is_featured: false, 
    dietary_tags: [] 
  },
  { 
    id: '9', 
    name: 'Wedding Cake', 
    category: 'Special Orders', 
    price: 1500000, 
    description: 'Custom 3-tier, contact us to design', 
    image_url: 'https://images.unsplash.com/photo-1558636508-e0969431e753?w=400', 
    is_featured: false, 
    dietary_tags: [] 
  },
  { 
    id: '10', 
    name: 'Banana Bread', 
    category: 'Breads', 
    price: 22000, 
    description: 'Moist, spiced, homestyle', 
    image_url: 'https://images.unsplash.com/photo-1585478259715-4d3a9e3a5658?w=400', 
    is_featured: false, 
    dietary_tags: ['vegan'] 
  },
  { 
    id: '11', 
    name: 'Strawberry Tart', 
    category: 'Pastries', 
    price: 30000, 
    description: 'Buttery shell, fresh custard', 
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 
    is_featured: false, 
    dietary_tags: [] 
  },
  { 
    id: '12', 
    name: 'Fresh Lemonade', 
    category: 'Drinks', 
    price: 12000, 
    description: 'Cold pressed, lightly sweetened', 
    image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', 
    is_featured: false, 
    dietary_tags: ['vegan'] 
  },
];

// TODO: replace with Supabase query
export const mockTestimonials = [
  { 
    id: '1', 
    customer_name: 'Aminata K.', 
    message: 'The most beautiful cakes in Freetown. Wonder Bakery made our wedding unforgettable.', 
    rating: 5 
  },
  { 
    id: '2', 
    customer_name: 'Ibrahim S.', 
    message: 'I order croissants every Saturday morning. Nothing comes close to this quality.', 
    rating: 5 
  },
  { 
    id: '3', 
    customer_name: 'Fatima J.', 
    message: 'The sourdough bread is absolutely divine. Best bakery in Sierra Leone!', 
    rating: 5 
  },
];

export const CATEGORIES = ['All', 'Breads', 'Pastries', 'Cakes', 'Drinks', 'Special Orders'];

export const ADMIN_PIN = '1234';
