// ===== DATABASE SETUP GUIDE =====

/*
OPTION 1: FIREBASE (Recommended for Beginners)
============================================

Firebase provides:
- Real-time database
- Authentication
- Hosting
- Analytics

Setup Steps:
1. Go to https://firebase.google.com/
2. Click "Get Started"
3. Create new project "AK-Industry"
4. Enable:
   - Firestore Database (Start in test mode)
   - Authentication (Email/Password)
   - Storage (for images)
5. Copy your config
6. Use the code below

*/

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase (uncomment when ready)
/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
*/

// ===== FIRESTORE DATABASE STRUCTURE =====

/*
Collections Structure:
├── users/
│   └── {userId}
│       ├── email: string
│       ├── name: string
│       ├── createdAt: timestamp
│       ├── wallet: number
│       └── profile: object
│
├── products/
│   └── {productId}
│       ├── name: string
│       ├── category: string
│       ├── price: number
│       ├── rating: number
│       ├── stock: number
│       └── image: string
│
├── orders/
│   └── {orderId}
│       ├── userId: string
│       ├── items: array
│       ├── total: number
│       ├── status: string
│       ├── createdAt: timestamp
│       └── paymentId: string
│
├── transactions/
│   └── {transactionId}
│       ├── orderId: string
│       ├── userId: string
│       ├── amount: number
│       ├── gateway: string
│       ├── status: string
│       └── timestamp: timestamp
│
├── invoices/
│   └── {invoiceId}
│       ├── orderId: string
│       ├── userId: string
│       ├── items: array
│       ├── total: number
│       └── createdAt: timestamp
│
└── analytics/
    └── {date}
        ├── revenue: number
        ├── orders: number
        ├── users: number
        └── timestamp: timestamp
*/

// ===== NODE.JS + MONGODB SETUP =====

/*
For Production Backend:

1. Install Node.js from nodejs.org

2. Create server directory:
   mkdir ak-industry-server
   cd ak-industry-server

3. Initialize project:
   npm init -y
   
4. Install dependencies:
   npm install express cors dotenv mongoose stripe razorpay jsonwebtoken bcryptjs

5. Create .env file with:
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ak-industry
   STRIPE_SECRET_KEY=sk_test_xxxxx
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   JWT_SECRET=your_secret_key

6. Create server.js (see file below)
*/

// ===== EXPRESS SERVER (MongoDB) =====

/*
// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// ===== MONGODB SCHEMAS =====

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String,
    wallet: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    rating: Number,
    stock: Number,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: String,
    items: Array,
    total: Number,
    status: { type: String, default: 'pending' },
    paymentId: String,
    createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    orderId: String,
    userId: String,
    amount: Number,
    gateway: String,
    status: String,
    transactionId: String,
    timestamp: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// ===== API ROUTES =====

// Payment Route - Stripe
app.post('/api/payments/stripe', async (req, res) => {
    try {
        const { amount, orderId, email } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'inr',
            metadata: { orderId }
        });

        // Log transaction
        await Transaction.create({
            orderId,
            amount,
            gateway: 'Stripe',
            status: 'completed',
            transactionId: paymentIntent.id
        });

        res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Payment Route - Razorpay
app.post('/api/payments/razorpay', async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const { amount, orderId } = req.body;

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: orderId
        });

        res.json({ success: true, orderId: order.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Orders
app.get('/api/orders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create Order
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ success: true, orderId: order._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Revenue Analytics
app.get('/api/analytics/revenue', async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: 'completed' });
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        res.json({
            totalRevenue,
            totalOrders,
            totalUsers,
            averageOrderValue: totalRevenue / totalOrders,
            transactions: transactions.length
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
*/

// ===== MONGODB SETUP INSTRUCTIONS =====

/*
1. Create account at mongodb.com
2. Create free cluster
3. Add database user (with password)
4. Whitelist IP address (0.0.0.0/0 for development)
5. Click "Connect" and copy connection string
6. Replace in .env file
7. Run: npm start

Connection String Format:
mongodb+srv://username:password@cluster.mongodb.net/database-name
*/

// ===== CONNECTING FRONTEND TO BACKEND =====

class DatabaseAPI {
    constructor(apiUrl = 'http://localhost:5000') {
        this.apiUrl = apiUrl;
    }

    // Create Order
    async createOrder(orderData) {
        try {
            const response = await fetch(`${this.apiUrl}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Get Orders
    async getOrders(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/api/orders/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    // Process Stripe Payment
    async processStripePayment(amount, orderId, email) {
        try {
            const response = await fetch(`${this.apiUrl}/api/payments/stripe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, orderId, email })
            });
            return await response.json();
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    // Process Razorpay Payment
    async processRazorpayPayment(amount, orderId) {
        try {
            const response = await fetch(`${this.apiUrl}/api/payments/razorpay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, orderId })
            });
            return await response.json();
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    // Get Analytics
    async getAnalytics() {
        try {
            const response = await fetch(`${this.apiUrl}/api/analytics/revenue`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }
}

// Create API instance
const dbAPI = new DatabaseAPI('http://localhost:5000');

// ===== QUICK START GUIDE =====

/*
FASTEST SETUP (Firebase):
========================

1. Go to https://firebase.google.com/
2. Sign in with Google account
3. Click "Create a project"
4. Name it "AK-Industry"
5. Click "Create project"
6. Click "Firestore Database"
7. Click "Create Database"
8. Choose "Start in test mode"
9. Select region "asia-southeast1" (fastest for India)
10. Click "Create"
11. Go to Project Settings
12. Copy your config
13. Replace in payments.js
14. Done!

PRODUCTION SETUP (MongoDB + Node):
==================================

1. Install Node.js
2. Create server folder: mkdir ak-industry-server
3. npm init -y
4. npm install express cors dotenv mongoose stripe razorpay
5. Create .env file
6. Create server.js
7. Run: npm start
8. Update dbAPI URL in frontend
9. Deploy to Heroku/Railway

PAYMENT TESTING:
================

Stripe Test Cards:
- 4242 4242 4242 4242 (Success)
- 4000 0000 0000 0002 (Declined)
- 4000 0025 0000 3155 (3D Secure)

Razorpay Test Mode:
- All test payments succeed
- Use any email/phone
- No real money charged
*/

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DatabaseAPI, paymentGateway, monetizationManager, invoiceGenerator };
}
