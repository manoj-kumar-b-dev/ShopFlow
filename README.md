# 🛒 Modern Full-Stack E-Commerce Platform (MERN Stack)

A feature-rich, high-performance, full-stack E-Commerce web application built using **MongoDB, Express.js, React 18 (Vite), and Node.js**, featuring **Tailwind CSS, Cloudinary image management, Stripe & Razorpay payment integrations, and a full Admin Dashboard**.

---

## 🚀 Live Demo & Preview

- **Frontend Application:** React 18 + Vite + Tailwind CSS
- **Backend API:** Node.js + Express (Vercel Serverless / Render Ready)
- **Database:** MongoDB Atlas (Mongoose ORM)

---

## ✨ Features

### 🛍️ Customer Experience
- **Interactive Storefront:** Dynamic product catalogue with advanced filtering (by category, price range, search query, sorting).
- **Product Details & Reviews:** High-res image carousels, detailed descriptions, stock availability, rating breakdown, and customer review system.
- **Wishlist & Shopping Cart:** Persistent shopping cart and wishlist state across sessions.
- **Saved Addresses:** Multi-address management for smooth checkout.
- **Seamless Checkout:** Multi-step checkout with real-time total calculations, discount code validation, and shipping choice.
- **Payment Gateways:** Built-in integration with **Razorpay** and **Stripe**, complete with secure server-side signature/webhook verification.
- **Order Tracking:** Complete customer order history and order tracking status (Pending, Processing, Shipped, Delivered, Cancelled).

### 🔐 Authentication & Security
- **JWT & HTTP-Only Cookie Authentication:** Secure token handling and session management.
- **Role-Based Access Control (RBAC):** Distinct permissions for Customers and Administrators.
- **Password Reset Flow:** Email-based OTP/password reset powered by **Nodemailer**.
- **Security Middleware:** Hardened headers with `helmet`, CORS preflight optimization, and rate limiting with `express-rate-limit`.

### 👑 Admin Management Dashboard
- **Analytics & Insights:** Visual revenue graphs, total order stats, sales metrics, and top-selling products using **Recharts**.
- **Product Management:** Full CRUD capability for products (title, description, price, category, stock, tags) with direct cloud image uploads to **Cloudinary**.
- **Order Management:** View customer orders, inspect items, update order statuses, and monitor fulfillments.
- **User Management:** Monitor registered users, update roles, and manage account statuses.
- **CLI Utility:** Included CLI script (`npm run create-admin`) to seed initial admin accounts safely.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **UI Components & Icons:** [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **State & Routing:** Context API (`AuthContext`, `CartContext`), [React Router v6](https://reactrouter.com/)
- **Data Visualizations:** [Recharts](https://recharts.org/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (>= 20.x ES Modules)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **File & Media Storage:** [Cloudinary SDK](https://cloudinary.com/) + `multer`
- **Payment Gateways:** `stripe`, `razorpay`
- **Mailing:** `nodemailer`
- **Security & Logging:** `helmet`, `cors`, `morgan`, `express-rate-limit`, `cookie-parser`

---

## 📂 Project Structure

```text
Ecommerce Website 1/
├── backend/
│   ├── api/                # Vercel serverless function entrypoint (index.js)
│   ├── config/             # DB connection (db.js) & configuration
│   ├── controllers/        # Route logic (auth, products, admin, order, cart, payment, address)
│   ├── middleware/         # Auth verification, error handling, file upload middleware
│   ├── models/             # Mongoose schemas (User, Product, Order, Cart, Category, Review)
│   ├── routes/             # Express API routes
│   ├── utils/              # Admin seed scripts, helper functions
│   ├── dev.js              # Local development server entrypoint
│   ├── server.js           # Express app instance configuration
│   ├── vercel.json         # Vercel deployment configuration
│   └── package.json
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images & iconography
│   │   ├── components/     # Reusable UI components (Navbar, Footer, ProductCard, Modal, etc.)
│   │   ├── context/        # React Context providers (AuthContext, CartContext)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application views (Home, Shop, Cart, Checkout, Dashboard, Admin)
│   │   │   └── admin/      # Admin portal views (Dashboard, Products, Orders, Users)
│   │   ├── utils/          # API helper instances and formatting tools
│   │   ├── App.jsx         # Main router & app layout setup
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind directives & custom CSS
│   ├── tailwind.config.js  # Tailwind theme configuration
│   ├── vite.config.js      # Vite build setup
│   └── package.json
└── README.md
```

---

## ⚙️ Environment Variables

### 1. Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
# Server Setup
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce?retryWrites=true&wmode=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Cloudinary Setup (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Integrations
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Nodemailer Setup (Password Reset / Emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@ecommerce.com
```

### 2. Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js** v20.x or higher
- **npm** or **yarn**
- **MongoDB** instance (Local or MongoDB Atlas)
- **Cloudinary** account (For image management)

### 1. Clone the Repository
```bash
git clone https://github.com/manoj-kumar-b-dev/Ecommerce-Website.git
cd Ecommerce-Website
```

### 2. Setup & Start Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Seed Admin Account
npm run create-admin

# Start development server
npm run dev
```
> The backend server will run on **http://localhost:5000**.

### 3. Setup & Start Frontend
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> The frontend application will run on **http://localhost:5173**.

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user | No |
| **POST** | `/api/auth/login` | Login user & issue JWT | No |
| **GET** | `/api/products` | Fetch catalogue with filter & pagination | No |
| **GET** | `/api/products/:id` | Fetch product details & reviews | No |
| **GET / POST** | `/api/cart` | Get or update shopping cart | Yes |
| **POST** | `/api/orders` | Create new purchase order | Yes |
| **POST** | `/api/payment/razorpay/order` | Create Razorpay payment transaction | Yes |
| **GET** | `/api/admin/dashboard` | Admin analytics summary | Yes (Admin) |
| **POST** | `/api/admin/products` | Create new product with Cloudinary image upload | Yes (Admin) |
| **PUT** | `/api/admin/orders/:id` | Update order status | Yes (Admin) |

---

## ☁️ Deployment

### Backend (Vercel / Render)
- The backend is configured for **Vercel Serverless Functions** with `vercel.json` and `api/index.js`.
- Make sure to set all Environment Variables in your Vercel / Render Dashboard.

### Frontend (Vercel / Netlify)
- Build the production assets using:
  ```bash
  cd frontend
  npm run build
  ```
- Deploy the resulting `dist/` folder to Vercel, Netlify, or your preferred static hosting platform.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
