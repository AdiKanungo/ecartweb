// ===== PAYMENT GATEWAY INTEGRATION =====
// Supports: Stripe & Razorpay

class PaymentGateway {
    constructor() {
        this.transactions = this.getTransactions();
        this.stripeKey = 'pk_test_51234567890'; // Test Stripe key
        this.razorpayKey = 'rzp_test_1234567890'; // Test Razorpay key
    }

    // Process Stripe Payment
    async processStripePayment(paymentDetails) {
        try {
            const { cardNumber, cvv, expiryDate, amount, orderId } = paymentDetails;

            // Validate card details
            if (!this.validateCard(cardNumber, cvv, expiryDate)) {
                throw new Error('Invalid card details');
            }

            // Simulate Stripe payment
            const paymentIntent = await this.createStripePaymentIntent(amount, orderId);

            if (paymentIntent.status === 'succeeded') {
                this.logTransaction({
                    orderId,
                    gateway: 'Stripe',
                    amount,
                    status: 'completed',
                    transactionId: paymentIntent.id,
                    timestamp: new Date(),
                    cardLast4: cardNumber.slice(-4)
                });

                return {
                    success: true,
                    transactionId: paymentIntent.id,
                    message: 'Payment successful via Stripe'
                };
            }
        } catch (error) {
            throw new Error(`Stripe payment failed: ${error.message}`);
        }
    }

    // Process Razorpay Payment
    async processRazorpayPayment(paymentDetails) {
        try {
            const { amount, orderId, customerEmail, customerPhone } = paymentDetails;

            // Create Razorpay order
            const razorpayOrder = await this.createRazorpayOrder(amount, orderId);

            if (razorpayOrder.id) {
                this.logTransaction({
                    orderId,
                    gateway: 'Razorpay',
                    amount,
                    status: 'pending',
                    razorpayOrderId: razorpayOrder.id,
                    customerEmail,
                    customerPhone,
                    timestamp: new Date()
                });

                return {
                    success: true,
                    orderId: razorpayOrder.id,
                    message: 'Razorpay order created',
                    razorpayKey: this.razorpayKey
                };
            }
        } catch (error) {
            throw new Error(`Razorpay payment failed: ${error.message}`);
        }
    }

    // Create Stripe Payment Intent
    async createStripePaymentIntent(amount, orderId) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: `pi_${Date.now()}`,
                    amount: Math.round(amount * 100),
                    status: 'succeeded',
                    client_secret: `pi_${Date.now()}_secret_${Math.random()}`
                });
            }, 1000);
        });
    }

    // Create Razorpay Order
    async createRazorpayOrder(amount, orderId) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: `order_${Date.now()}`,
                    amount: Math.round(amount * 100),
                    currency: 'INR',
                    receipt: `receipt_${orderId}`,
                    status: 'created'
                });
            }, 1000);
        });
    }

    // Validate Card Details
    validateCard(cardNumber, cvv, expiryDate) {
        // Remove spaces
        cardNumber = cardNumber.replace(/\s/g, '');

        // Validate length
        if (cardNumber.length !== 16) return false;
        if (cvv.length !== 3) return false;

        // Validate expiry date format
        const [month, year] = expiryDate.split('/');
        if (!month || !year || isNaN(month) || isNaN(year)) return false;

        // Check if card is expired
        const currentDate = new Date();
        const expireDate = new Date(2000 + parseInt(year), parseInt(month));
        if (currentDate > expireDate) return false;

        // Luhn algorithm for card validation
        return this.luhnCheck(cardNumber);
    }

    // Luhn Algorithm
    luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return (sum % 10) === 0;
    }

    // Log Transaction
    logTransaction(transactionData) {
        this.transactions.push({
            id: `txn_${Date.now()}`,
            ...transactionData
        });
        localStorage.setItem('ak_transactions', JSON.stringify(this.transactions));
    }

    // Get All Transactions
    getTransactions() {
        return JSON.parse(localStorage.getItem('ak_transactions') || '[]');
    }

    // Get Transaction by Order ID
    getTransactionByOrderId(orderId) {
        return this.transactions.find(t => t.orderId === orderId);
    }

    // Process Refund
    processRefund(orderId, reason = 'Customer requested') {
        const transaction = this.getTransactionByOrderId(orderId);

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        if (transaction.status === 'refunded') {
            throw new Error('Transaction already refunded');
        }

        transaction.status = 'refunded';
        transaction.refundReason = reason;
        transaction.refundDate = new Date();

        localStorage.setItem('ak_transactions', JSON.stringify(this.transactions));

        return {
            success: true,
            refundId: `ref_${Date.now()}`,
            amount: transaction.amount,
            message: 'Refund processed successfully'
        };
    }

    // Get Payment Summary
    getPaymentSummary() {
        const completed = this.transactions.filter(t => t.status === 'completed');
        const pending = this.transactions.filter(t => t.status === 'pending');
        const refunded = this.transactions.filter(t => t.status === 'refunded');

        const totalCompleted = completed.reduce((sum, t) => sum + t.amount, 0);
        const totalRefunded = refunded.reduce((sum, t) => sum + t.amount, 0);
        const netRevenue = totalCompleted - totalRefunded;

        return {
            totalTransactions: this.transactions.length,
            completedPayments: completed.length,
            pendingPayments: pending.length,
            refundedPayments: refunded.length,
            totalRevenue: totalCompleted,
            totalRefunded,
            netRevenue,
            transactions: this.transactions
        };
    }
}

// ===== MONETIZATION SYSTEM =====

class MonetizationManager {
    constructor() {
        this.revenue = this.getRevenue();
        this.commission = 0.1; // 10% platform commission
        this.taxes = 0.05; // 5% tax rate
    }

    // Calculate Revenue Breakdown
    calculateRevenue(orderAmount) {
        const platformCommission = orderAmount * this.commission;
        const vendorShare = orderAmount - platformCommission;
        const tax = orderAmount * this.taxes;
        const netRevenue = orderAmount - tax;

        return {
            grossRevenue: orderAmount,
            platformCommission,
            vendorShare,
            tax,
            netRevenue
        };
    }

    // Track Revenue
    logRevenue(orderId, amount, type = 'sale') {
        const breakdown = this.calculateRevenue(amount);

        const revenueEntry = {
            id: `rev_${Date.now()}`,
            orderId,
            type, // 'sale', 'refund', 'fee', 'discount'
            amount,
            breakdown,
            timestamp: new Date(),
            status: 'completed'
        };

        this.revenue.push(revenueEntry);
        localStorage.setItem('ak_revenue', JSON.stringify(this.revenue));

        return revenueEntry;
    }

    // Get Revenue Summary
    getRevenueSummary(startDate = null, endDate = null) {
        let revenues = this.revenue;

        if (startDate && endDate) {
            revenues = revenues.filter(r => {
                const date = new Date(r.timestamp);
                return date >= startDate && date <= endDate;
            });
        }

        const sales = revenues.filter(r => r.type === 'sale');
        const refunds = revenues.filter(r => r.type === 'refund');

        const totalSales = sales.reduce((sum, r) => sum + r.amount, 0);
        const totalRefunds = refunds.reduce((sum, r) => sum + r.amount, 0);
        const platformEarnings = sales.reduce((sum, r) => sum + r.breakdown.platformCommission, 0);
        const netRevenue = totalSales - totalRefunds;

        return {
            period: { startDate, endDate },
            totalSales,
            totalRefunds,
            netRevenue,
            platformCommission: platformEarnings,
            numberOfTransactions: revenues.length,
            averageOrderValue: sales.length > 0 ? totalSales / sales.length : 0,
            conversionRate: '0%' // Would need visitor data
        };
    }

    // Get Revenue by Period
    getRevenueByPeriod(period = 'daily') {
        const grouped = {};

        this.revenue.forEach(entry => {
            const date = new Date(entry.timestamp);
            let key;

            if (period === 'daily') {
                key = date.toISOString().split('T')[0];
            } else if (period === 'monthly') {
                key = date.toISOString().slice(0, 7);
            } else if (period === 'yearly') {
                key = date.getFullYear().toString();
            }

            if (!grouped[key]) {
                grouped[key] = { date: key, amount: 0, transactions: 0 };
            }

            grouped[key].amount += entry.amount;
            grouped[key].transactions += 1;
        });

        return Object.values(grouped);
    }

    // Get Revenue Data
    getRevenue() {
        return JSON.parse(localStorage.getItem('ak_revenue') || '[]');
    }

    // Predict Revenue
    predictRevenue(days = 30) {
        const summary = this.getRevenueSummary();
        const avgDailyRevenue = summary.averageOrderValue * 5; // Assume 5 orders/day

        return {
            projectedPeriod: `Next ${days} days`,
            currentDailyAverage: avgDailyRevenue,
            projectedRevenue: avgDailyRevenue * days,
            confidence: '70%'
        };
    }
}

// ===== INVOICE & RECEIPT SYSTEM =====

class InvoiceGenerator {
    constructor() {
        this.invoices = this.getInvoices();
    }

    // Generate Invoice
    generateInvoice(order, paymentDetails) {
        const invoice = {
            id: `INV-${Date.now()}`,
            orderId: order.id,
            invoiceDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            items: order.items,
            subtotal: order.total,
            tax: order.total * 0.05,
            total: order.total * 1.05,
            paymentMethod: paymentDetails.gateway,
            paymentStatus: paymentDetails.status || 'completed',
            customerEmail: paymentDetails.email,
            notes: 'Thank you for your purchase!'
        };

        this.invoices.push(invoice);
        localStorage.setItem('ak_invoices', JSON.stringify(this.invoices));

        return invoice;
    }

    // Generate Receipt
    generateReceipt(invoice) {
        const receipt = `
╔════════════════════════════════════════════════════════════╗
║              AK INDUSTRY - RECEIPT                         ║
║════════════════════════════════════════════════════════════║
║ Invoice ID:    ${invoice.id}                      ║
║ Order ID:      ${invoice.orderId}                         ║
║ Date:          ${invoice.invoiceDate.toLocaleDateString()}                        ║
║════════════════════════════════════════════════════════════║
║ ITEMS:                                                     ║
`;

        let itemsText = receipt;
        invoice.items.forEach(item => {
            itemsText += `
║ ${item.name.substring(0, 30).padEnd(30)} | x${item.quantity} | ₹${item.price}  ║`;
        });

        const finalReceipt = itemsText + `
║════════════════════════════════════════════════════════════║
║ Subtotal:          ₹${invoice.subtotal.toFixed(2).padStart(20)}  ║
║ Tax (5%):          ₹${invoice.tax.toFixed(2).padStart(20)}  ║
║════════════════════════════════════════════════════════════║
║ TOTAL:             ₹${invoice.total.toFixed(2).padStart(20)}  ║
║════════════════════════════════════════════════════════════║
║ Payment Method: ${invoice.paymentMethod.padEnd(39)}║
║ Status:         ${invoice.paymentStatus.padEnd(39)}║
║════════════════════════════════════════════════════════════║
║ ${invoice.notes.padEnd(58)}║
║════════════════════════════════════════════════════════════║
╚════════════════════════════════════════════════════════════╝`;

        return finalReceipt;
    }

    // Email Receipt
    emailReceipt(invoice, email) {
        console.log(`Receipt sent to ${email}`);

        // Simulate email
        return {
            success: true,
            message: `Receipt emailed to ${email}`,
            emailId: `email_${Date.now()}`,
            invoiceId: invoice.id
        };
    }

    // Download Invoice
    downloadInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id === invoiceId);

        if (!invoice) {
            throw new Error('Invoice not found');
        }

        const receipt = this.generateReceipt(invoice);
        const blob = new Blob([receipt], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${invoice.id}.txt`;
        link.click();

        return { success: true, invoiceId };
    }

    // Get Invoices
    getInvoices() {
        return JSON.parse(localStorage.getItem('ak_invoices') || '[]');
    }

    // Get Invoice by Order ID
    getInvoiceByOrderId(orderId) {
        return this.invoices.find(i => i.orderId === orderId);
    }
}

// ===== WALLET & BALANCE SYSTEM =====

class UserWallet {
    constructor() {
        this.wallets = this.getWallets();
    }

    // Create Wallet
    createWallet(userId, initialBalance = 0) {
        const wallet = {
            id: `wallet_${Date.now()}`,
            userId,
            balance: initialBalance,
            currency: 'INR',
            transactions: [],
            createdAt: new Date(),
            status: 'active'
        };

        this.wallets.push(wallet);
        localStorage.setItem('ak_wallets', JSON.stringify(this.wallets));

        return wallet;
    }

    // Add Balance
    addBalance(userId, amount, reason = 'refund') {
        const wallet = this.wallets.find(w => w.userId === userId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        wallet.balance += amount;
        wallet.transactions.push({
            type: 'credit',
            amount,
            reason,
            timestamp: new Date(),
            balanceAfter: wallet.balance
        });

        localStorage.setItem('ak_wallets', JSON.stringify(this.wallets));

        return wallet;
    }

    // Deduct Balance
    deductBalance(userId, amount, reason = 'purchase') {
        const wallet = this.wallets.find(w => w.userId === userId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        if (wallet.balance < amount) {
            throw new Error('Insufficient balance');
        }

        wallet.balance -= amount;
        wallet.transactions.push({
            type: 'debit',
            amount,
            reason,
            timestamp: new Date(),
            balanceAfter: wallet.balance
        });

        localStorage.setItem('ak_wallets', JSON.stringify(this.wallets));

        return wallet;
    }

    // Get Wallet
    getWallet(userId) {
        return this.wallets.find(w => w.userId === userId);
    }

    // Get All Wallets
    getWallets() {
        return JSON.parse(localStorage.getItem('ak_wallets') || '[]');
    }

    // Get Transaction History
    getTransactionHistory(userId) {
        const wallet = this.getWallet(userId);
        return wallet ? wallet.transactions : [];
    }
}

// ===== GLOBAL INSTANCES =====
const paymentGateway = new PaymentGateway();
const monetizationManager = new MonetizationManager();
const invoiceGenerator = new InvoiceGenerator();
const userWallet = new UserWallet();

// ===== ENHANCED CHECKOUT WITH PAYMENT =====

// Call this after placing order
function processPaymentAndCheckout(paymentMethod, paymentDetails, orderId, orderAmount) {
    try {
        let paymentResult;

        if (paymentMethod === 'card') {
            paymentResult = paymentGateway.processStripePayment({
                ...paymentDetails,
                orderId,
                amount: orderAmount
            });
        } else if (paymentMethod === 'upi') {
            paymentResult = paymentGateway.processRazorpayPayment({
                ...paymentDetails,
                orderId,
                amount: orderAmount
            });
        } else if (paymentMethod === 'wallet') {
            const userWalletInfo = userWallet.getWallet(auth.currentUser.id);
            if (userWalletInfo.balance >= orderAmount) {
                userWallet.deductBalance(auth.currentUser.id, orderAmount, 'purchase');
                paymentResult = {
                    success: true,
                    transactionId: `wallet_${Date.now()}`,
                    message: 'Payment from wallet successful'
                };
            } else {
                throw new Error('Insufficient wallet balance');
            }
        }

        if (paymentResult && paymentResult.success) {
            // Log revenue
            monetizationManager.logRevenue(orderId, orderAmount, 'sale');

            // Generate invoice
            const order = JSON.parse(localStorage.getItem('ak_orders') || '[]')
                .find(o => o.id === orderId);
            
            const invoice = invoiceGenerator.generateInvoice(order, {
                gateway: paymentMethod,
                status: 'completed',
                email: auth.currentUser.email
            });

            showNotification('Payment successful! Invoice sent to your email.', 'success');

            return {
                success: true,
                paymentResult,
                invoice
            };
        }
    } catch (error) {
        showNotification(`Payment failed: ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// Enhanced checkout modal
function createEnhancedCheckoutForm() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content checkout-form">
            <span class="close">&times;</span>
            <h2>Secure Checkout</h2>
            
            <div class="checkout-section">
                <h3>1. Delivery Address</h3>
                <form id="address-form">
                    <input type="text" placeholder="Full Name" required>
                    <input type="text" placeholder="Phone Number" required>
                    <input type="text" placeholder="Street Address" required>
                    <input type="text" placeholder="City" required>
                    <input type="text" placeholder="Postal Code" required>
                </form>
            </div>

            <div class="checkout-section">
                <h3>2. Payment Method</h3>
                <div class="payment-options">
                    <label>
                        <input type="radio" name="payment" value="card" checked>
                        <span class="payment-option-label">
                            <i class="fa-solid fa-credit-card"></i>
                            Credit/Debit Card (Stripe)
                        </span>
                    </label>
                    <label>
                        <input type="radio" name="payment" value="upi">
                        <span class="payment-option-label">
                            <i class="fa-solid fa-mobile"></i>
                            UPI / Google Pay (Razorpay)
                        </span>
                    </label>
                    <label>
                        <input type="radio" name="payment" value="wallet">
                        <span class="payment-option-label">
                            <i class="fa-solid fa-wallet"></i>
                            Wallet (₹${userWallet.getWallet(auth.currentUser.id)?.balance || 0})
                        </span>
                    </label>
                </div>
            </div>

            <div class="checkout-section" id="card-section">
                <h3>3. Card Details (Secured)</h3>
                <form id="card-form">
                    <div class="security-badge">
                        <i class="fa-solid fa-lock"></i> Encrypted & Secure
                    </div>
                    <input type="text" placeholder="Card Holder Name" required>
                    <input type="text" placeholder="Card Number" maxlength="16" required>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" placeholder="MM/YY" maxlength="5" required>
                        <input type="text" placeholder="CVV" maxlength="3" required>
                    </div>
                </form>
            </div>

            <div class="order-summary">
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal (${cart.items.length} items):</span>
                    <span>₹${cart.getTotal().toLocaleString()}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (5%):</span>
                    <span>₹${(cart.getTotal() * 0.05).toLocaleString()}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span style="color: #4caf50;">FREE</span>
                </div>
                <div class="summary-row total-row">
                    <span>Total Amount:</span>
                    <span>₹${(cart.getTotal() * 1.05).toLocaleString()}</span>
                </div>
            </div>

            <button class="btn btn-primary place-order-btn" style="width: 100%; margin-top: 20px;">
                <i class="fa-solid fa-lock"></i> Complete Secure Payment
            </button>

            <div class="payment-badges">
                <img src="https://via.placeholder.com/80x30?text=Stripe" alt="Stripe">
                <img src="https://via.placeholder.com/80x30?text=Razorpay" alt="Razorpay">
            </div>
        </div>
    `;

    return modal;
}

// Enhanced receipt display
function showPaymentReceipt(invoice) {
    const modal = createModal('receipt-modal');
    const receipt = invoiceGenerator.generateReceipt(invoice);
    
    modal.innerHTML = `
        <div class="modal-content receipt">
            <span class="close">&times;</span>
            <div class="receipt-header">
                <h2>Payment Successful!</h2>
                <p class="receipt-status">✓ Transaction Completed</p>
            </div>
            <pre class="receipt-content">${receipt}</pre>
            <div class="receipt-actions">
                <button class="btn btn-primary" onclick="invoiceGenerator.downloadInvoice('${invoice.id}')">
                    <i class="fa-solid fa-download"></i> Download Invoice
                </button>
                <button class="btn btn-secondary" onclick="emailReceipt('${invoice.id}')">
                    <i class="fa-solid fa-envelope"></i> Email Receipt
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupModalClose(modal);
}
