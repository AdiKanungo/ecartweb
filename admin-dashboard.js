// Admin Dashboard JavaScript

class AdminDashboard {
    constructor() {
        this.setupEventListeners();
        this.loadDashboardData();
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.closest('.nav-item')));
        });
    }

    switchSection(btn) {
        const section = btn.dataset.section;

        // Update active button
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));

        // Show selected section
        document.getElementById(section).classList.add('active');

        // Load section data
        switch (section) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'transactions':
                this.loadTransactionsData();
                break;
            case 'revenue':
                this.loadRevenueData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
            case 'users':
                this.loadUsersData();
                break;
            case 'refunds':
                this.loadRefundsData();
                break;
        }
    }

    loadDashboardData() {
        // Get data from payment gateway
        const summary = paymentGateway.getPaymentSummary();
        const revenueSummary = monetizationManager.getRevenueSummary();

        // Update stat cards
        document.getElementById('total-revenue').textContent = 
            `₹${revenueSummary.totalSales.toLocaleString()}`;
        document.getElementById('total-orders').textContent = 
            revenueSummary.numberOfTransactions;
        document.getElementById('total-users').textContent = 
            JSON.parse(localStorage.getItem('ak_users') || '[]').length;
        document.getElementById('total-transactions').textContent = 
            summary.completedPayments;
    }

    loadTransactionsData() {
        const transactions = paymentGateway.getPaymentSummary().transactions;
        const tbody = document.getElementById('transactions-tbody');
        tbody.innerHTML = '';

        transactions.forEach(txn => {
            tbody.innerHTML += `
                <tr>
                    <td>${txn.id}</td>
                    <td>${txn.orderId}</td>
                    <td>₹${txn.amount.toLocaleString()}</td>
                    <td>${txn.gateway}</td>
                    <td>
                        <span class="status-badge ${txn.status}">
                            ${txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </span>
                    </td>
                    <td>${new Date(txn.timestamp).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-small btn-view">View</button>
                        ${txn.status === 'completed' ? '<button class="btn-small btn-refund" onclick="refundTransaction(\'' + txn.orderId + '\')">Refund</button>' : ''}
                    </td>
                </tr>
            `;
        });
    }

    loadRevenueData() {
        const summary = monetizationManager.getRevenueSummary();
        
        // Update revenue cards
        document.getElementById('rev-total').textContent = 
            `₹${summary.totalSales.toLocaleString()}`;
        document.getElementById('rev-commission').textContent = 
            `₹${summary.platformCommission.toLocaleString()}`;
        document.getElementById('rev-taxes').textContent = 
            `₹${(summary.totalSales * 0.05).toLocaleString()}`;
        document.getElementById('rev-net').textContent = 
            `₹${summary.netRevenue.toLocaleString()}`;

        // Load revenue by date
        const revenueByDate = monetizationManager.getRevenueByPeriod('daily');
        const tbody = document.getElementById('revenue-tbody');
        tbody.innerHTML = '';

        revenueByDate.slice(-7).forEach(entry => {
            const avgValue = entry.transactions > 0 ? entry.amount / entry.transactions : 0;
            tbody.innerHTML += `
                <tr>
                    <td>${entry.date}</td>
                    <td>₹${entry.amount.toLocaleString()}</td>
                    <td>${entry.transactions}</td>
                    <td>₹${Math.round(avgValue).toLocaleString()}</td>
                    <td>₹${Math.round(entry.amount * 0.1).toLocaleString()}</td>
                </tr>
            `;
        });
    }

    loadOrdersData() {
        const orders = JSON.parse(localStorage.getItem('ak_orders') || '[]');
        const tbody = document.getElementById('orders-tbody');
        tbody.innerHTML = '';

        orders.forEach(order => {
            tbody.innerHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>${auth.currentUser?.name || 'Customer'}</td>
                    <td>₹${order.total.toLocaleString()}</td>
                    <td>${order.items.length}</td>
                    <td>
                        <span class="status-badge ${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </td>
                    <td>${new Date(order.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-small btn-view">View</button>
                        <button class="btn-small btn-ship">Ship</button>
                    </td>
                </tr>
            `;
        });
    }

    loadUsersData() {
        const users = JSON.parse(localStorage.getItem('ak_users') || '[]');
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const wallet = userWallet.getWallet(user.id);
            const userOrders = JSON.parse(localStorage.getItem('ak_orders') || '[]')
                .filter(o => o.userId === user.id);
            const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);

            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>₹${(wallet?.balance || 0).toLocaleString()}</td>
                    <td>₹${totalSpent.toLocaleString()}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-small btn-view">View</button>
                        <button class="btn-small btn-message">Message</button>
                    </td>
                </tr>
            `;
        });
    }

    loadRefundsData() {
        const transactions = paymentGateway.getPaymentSummary().transactions;
        const refunds = transactions.filter(t => t.status === 'refunded');
        const tbody = document.getElementById('refunds-tbody');
        tbody.innerHTML = '';

        refunds.forEach((refund, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>REF${index + 1}</td>
                    <td>${refund.orderId}</td>
                    <td>₹${refund.amount.toLocaleString()}</td>
                    <td>${refund.refundReason || 'N/A'}</td>
                    <td>
                        <span class="status-badge completed">Processed</span>
                    </td>
                    <td>${new Date(refund.refundDate).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-small btn-view">View</button>
                    </td>
                </tr>
            `;
        });
    }
}

// Initialize admin dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});

// Export data as CSV
function exportData() {
    const summary = monetizationManager.getRevenueSummary();
    const csv = `
Date,Total Revenue,Orders,Commission,Net Revenue
${new Date().toLocaleDateString()},${summary.totalSales},${summary.numberOfTransactions},${summary.platformCommission},${summary.netRevenue}
    `;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ak-industry-report-${Date.now()}.csv`;
    link.click();
}

// Print report
function printReport() {
    window.print();
}

// Process refund from admin
function refundTransaction(orderId) {
    try {
        const result = paymentGateway.processRefund(orderId, 'Admin requested refund');
        showNotification('Refund processed successfully', 'success');
        adminDashboard.loadTransactionsData();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}
