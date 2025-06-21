const db = require('../config/db');

class Order {
    static async findById(orderId) {
        const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        return rows[0];
    }

    static async findByUser(userId) {
        const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }

    static async getAll() {
        const [rows] = await db.query(`
            SELECT o.*, u.full_name, u.email 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        return rows;
    }

    static async updateStatus(orderId, status) {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    }

    static async create(userId, deliveryAddress, cartItems) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            let totalAmount = 0;
            for (const item of cartItems) {
                if (item.quantity > item.stock_quantity) throw new Error(`Недостаточно товара "${item.title}" на складе.`);
                totalAmount += Number(item.effective_price) * item.quantity;
            }
            if (isNaN(totalAmount)) throw new Error('Не удалось рассчитать итоговую сумму заказа.');
            const [orderResult] = await connection.query('INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES (?, ?, ?, ?)', [userId, totalAmount, deliveryAddress, 'processing']);
            const orderId = orderResult.insertId;
            for (const item of cartItems) {
                await connection.query('INSERT INTO order_items (order_id, book_id, quantity, price_per_item) VALUES (?, ?, ?, ?)', [orderId, item.book_id, item.quantity, item.effective_price]);
                await connection.query('UPDATE books SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.book_id]);
            }
            await connection.commit();
            return orderId;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
    
    static async getSalesByMonth({ startDate, endDate }) {
        let query = `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_amount) as total_revenue FROM orders WHERE status = 'delivered' `;
        const params = [];
        if (startDate) { query += ' AND created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY month ORDER BY month ASC';
        const [rows] = await db.query(query, params);
        return rows;
    }
    
    static async getDetailedSalesReport({ startDate, endDate }) {
        let query = `
            SELECT o.id, o.created_at, u.full_name as client_name, o.total_amount, o.status
            FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1 `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' ORDER BY o.created_at DESC';
        const [orders] = await db.query(query, params);
        
        for(let order of orders) {
            const [items] = await db.query(`SELECT b.title, oi.quantity, oi.price_per_item FROM order_items oi JOIN books b ON oi.book_id = b.id WHERE oi.order_id = ?`, [order.id]);
            order.items = items;
        }
        return orders;
    }
}

module.exports = Order;