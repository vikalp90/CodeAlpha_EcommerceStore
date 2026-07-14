# NOVA — Full Stack E-commerce Store

A full-stack e-commerce web application built as part of the **CodeAlpha Full Stack Development Internship**. NOVA lets users browse a multi-category product catalog, manage a cart, and place orders — with a complete authentication system and a custom-designed dark UI.

🔗 **Live Demo:** _add your deployed link here (optional)_
📹 **Video Walkthrough:** _add your LinkedIn video link here_

---

## ✨ Features

- **User Authentication** — Register/Login with JWT-based auth and hashed passwords (bcrypt)
- **Product Catalog** — 16+ products across 6 categories (Electronics, Fashion, Home & Kitchen, Books, Beauty, Wearables)
- **Search & Filter** — Live search bar and category filter chips
- **Product Details** — Click-through detail view with full specs
- **Shopping Cart** — Add, remove, and update item quantities, synced with the backend
- **Order Processing** — Checkout flow that converts a cart into an order with shipping address and order status
- **Order History** — View all past orders with itemized totals
- **Custom UI** — Dark graphite + mint themed interface, built from scratch with vanilla HTML/CSS/JS

---

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, JavaScript (Vanilla)
**Backend:** Node.js, Express.js
**Database:** MongoDB (Atlas) with Mongoose ODM
**Auth:** JWT (jsonwebtoken), bcryptjs

---

## 📁 Project Structure

```
CodeAlpha_EcommerceStore/
├── backend/
│   ├── config/
│   ├── controllers/       # Business logic (auth, products, cart, orders)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   ├── server.js           # App entry point
│   └── seedProducts.js     # Script to seed sample products
└── frontend/
    ├── index.html
    ├── css/style.css
    └── js/script.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (free tier works)

### Setup

1. Clone the repository
```bash
git clone https://github.com/vikalp90/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore/backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the `backend` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the server
```bash
node server.js
```

5. Open `frontend/index.html` in your browser (or use a live server extension)

---

## 📡 API Endpoints

| Method | Endpoint                    | Description             |
|--------|------------------------------|--------------------------|
| POST   | `/api/auth/register`         | Register a new user     |
| POST   | `/api/auth/login`            | Login and get JWT token |
| GET    | `/api/products`              | Get all products         |
| GET    | `/api/products/:id`          | Get a single product    |
| POST   | `/api/cart/add`              | Add item to cart        |
| GET    | `/api/cart/:userId`          | Get user's cart         |
| POST   | `/api/cart/remove`           | Remove item from cart   |
| POST   | `/api/orders/create`         | Place an order          |
| GET    | `/api/orders/user/:userId`   | Get a user's orders     |

---

## 👤 Author

**Vikalp Patel**
B.Tech CSE Student
Built as part of the CodeAlpha Full Stack Development Internship (July 2026)

---

## 📄 License

This project was built for educational purposes as part of a CodeAlpha internship task.
