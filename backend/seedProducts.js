require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Audio',
    stock: 50
  },
  {
    name: 'True Wireless Earbuds',
    description: 'Compact earbuds with touch controls, IPX5 water resistance, and a compact charging case.',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    category: 'Audio',
    stock: 80
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Compact 75% mechanical keyboard with hot-swappable switches and per-key RGB lighting.',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500',
    category: 'Accessories',
    stock: 35
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI and a silent-click design.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Accessories',
    stock: 100
  },
  {
    name: 'Smartwatch Series X',
    description: 'Fitness smartwatch with heart-rate tracking, GPS, and a 7-day battery life.',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Wearables',
    stock: 40
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Rugged, waterproof speaker delivering 360-degree sound with 12 hours of playback.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Audio',
    stock: 60
  },
  {
    name: '20000mAh Power Bank',
    description: 'Fast-charging power bank with dual USB-C ports and digital charge display.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500',
    category: 'Accessories',
    stock: 90
  },
  {
    name: 'USB-C Hub 7-in-1',
    description: 'Multiport adapter with HDMI, USB 3.0, SD card reader, and 100W power delivery.',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    category: 'Accessories',
    stock: 70
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.insertMany(products);
    console.log(`${products.length} products added successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
