require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "Men's Cotton T-Shirt",
    description: 'Breathable 100% cotton crew-neck t-shirt, available in classic solid colors.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Fashion',
    stock: 150
  },
  {
    name: "Women's Denim Jacket",
    description: 'Classic fit denim jacket with button closure, perfect for layering.',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    category: 'Fashion',
    stock: 60
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable mesh upper and cushioned sole.',
    price: 2699,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Fashion',
    stock: 75
  },
  {
    name: 'Non-Stick Cookware Set',
    description: '5-piece non-stick cookware set including pans and a saucepan with lids.',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1584990347449-a0e1a2f8f8f0?w=500',
    category: 'Home & Kitchen',
    stock: 40
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with 3 brightness levels and USB charging port.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home & Kitchen',
    stock: 85
  },
  {
    name: 'Memory Foam Pillow',
    description: 'Orthopedic memory foam pillow that contours to your neck and shoulders.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500',
    category: 'Home & Kitchen',
    stock: 100
  },
  {
    name: 'Atomic Habits (Paperback)',
    description: 'Bestselling guide to building good habits and breaking bad ones.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 120
  },
  {
    name: 'Herbal Face Wash',
    description: 'Gentle daily face wash with neem and tulsi extracts for clear skin.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 200
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.insertMany(products);
    console.log(`${products.length} more products added successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
