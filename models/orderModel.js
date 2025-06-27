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

    static async updateStatus(orderId, newStatus) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [orderRows] = await connection.query('SELECT status FROM orders WHERE id = ?', [orderId]);
            if (orderRows.length === 0) {
                throw new Error('Заказ не найден');
            }
            const oldStatus = orderRows[0].status;

            if (oldStatus === newStatus) {
                await connection.commit();
                return;
            }

            if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
                const [items] = await connection.query('SELECT book_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
                for (const item of items) {
                    await connection.query('UPDATE books SET stock_quantity = stock_quantity + ? WHERE id = ?', [item.quantity, item.book_id]);
                }
            } else if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
                const [items] = await connection.query('SELECT book_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
                for (const item of items) {
                    await connection.query('UPDATE books SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.book_id]);
                }
            }

            await connection.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
            
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error("Ошибка при обновлении статуса заказа:", err);
            throw err;
        } finally {
            connection.release();
        }
    }

    static async create(userId, deliveryAddress, cartItems) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            let totalAmount = 0;
            for (const item of cartItems) {
                const [[book]] = await connection.query('SELECT stock_quantity, title FROM books WHERE id = ?', [item.book_id]);
                if (item.quantity > book.stock_quantity) {
                    throw new Error(`Недостаточно товара "${book.title}" на складе.`);
                }
                totalAmount += Number(item.effective_price) * item.quantity;
            }

            if (isNaN(totalAmount)) {
                throw new Error('Не удалось рассчитать итоговую сумму заказа.');
            }

            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES (?, ?, ?, ?)',
                [userId, totalAmount, deliveryAddress, 'processing']
            );
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
        let query = `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_amount) as total_revenue FROM orders WHERE status != 'cancelled' `;
        const params = [];
        if (startDate) { query += ' AND created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY month ORDER BY month ASC';
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getDetailedSalesReport({ startDate, endDate }) {
        let query = `SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1 `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' ORDER BY o.created_at DESC';

        const [orders] = await db.query(query, params);
        if (orders.length === 0) {
            return [];
        }

        const orderIds = orders.map(o => o.id);
        const [items] = await db.query(`SELECT oi.order_id, oi.quantity, oi.price_per_item, b.title FROM order_items oi JOIN books b ON oi.book_id = b.id WHERE oi.order_id IN (?)`, [orderIds]);
        
        const itemsByOrderId = items.reduce((acc, item) => {
            if (!acc[item.order_id]) {
                acc[item.order_id] = [];
            }
            acc[item.order_id].push(item);
            return acc;
        }, {});

        orders.forEach(order => {
            order.items = itemsByOrderId[order.id] || [];
            order.client_name = order.full_name;
        });

        return orders;
    }
    
    static async findDetailsById(orderId) {
        const [orderRows] = await db.query(`SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?`, [orderId]);
        if (orderRows.length === 0) {
            return null;
        }

        const order = orderRows[0];
        const [itemRows] = await db.query(`SELECT oi.quantity, oi.price_per_item, b.id as book_id, b.title, b.cover_image_path FROM order_items oi JOIN books b ON oi.book_id = b.id WHERE oi.order_id = ?`, [orderId]);
        order.items = itemRows;

        return order;
    }

    /**
     * НОВЫЙ МЕТОД: Сводный отчет по продажам
     */
    static async getSalesSummaryReport({ startDate, endDate }) {
        let whereClause = " WHERE status != 'cancelled' ";
        const params = [];
        if (startDate) { whereClause += ' AND created_at >= ?'; params.push(startDate); }
        if (endDate) { whereClause += " AND created_at <= ?"; params.push(endDate + ' 23:59:59'); }
        
        // 1. Сводные метрики
        const summaryQuery = `
            SELECT
                SUM(total_amount) as totalRevenue,
                COUNT(id) as totalOrders,
                AVG(total_amount) as averageCheck
            FROM orders
            ${whereClause}
        `;
        const [summaryResult] = await db.query(summaryQuery, params);

        const itemsQuery = `
            SELECT SUM(oi.quantity) as totalBooksSold
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            ${whereClause.replace(/created_at/g, 'o.created_at')}
        `;
        const [itemsSummaryResult] = await db.query(itemsQuery, params);
        
        // ИСПРАВЛЕНИЕ: Явное преобразование в Number
        const summary = summaryResult[0] || {};
        const itemsSummary = itemsSummaryResult[0] || {};

        const metrics = {
            totalRevenue: Number(summary.totalRevenue) || 0,
            totalOrders: Number(summary.totalOrders) || 0,
            averageCheck: Number(summary.averageCheck) || 0,
            totalBooksSold: Number(itemsSummary.totalBooksSold) || 0
        };

        // 2. Группировка по периоду
        let groupBy, periodFormat;
        if (startDate && endDate) {
            const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            groupBy = diffDays <= 45 ? 'day' : 'month';
        } else {
            groupBy = 'month';
        }
        
        periodFormat = groupBy === 'day' ? '%Y-%m-%d' : '%Y-%m';

        const correctedGroupedQuery = `
            SELECT
                DATE_FORMAT(o.created_at, '${periodFormat}') as period,
                SUM(o.total_amount) as revenue,
                COUNT(DISTINCT o.id) as order_count,
                AVG(o.total_amount) as avg_check,
                SUM(oi.quantity) as books_sold
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            ${whereClause.replace(/created_at/g, 'o.created_at')}
            GROUP BY period
            ORDER BY period ASC
        `;
        const [correctedGroupedData] = await db.query(correctedGroupedQuery, params);

        return {
            metrics,
            groupedData: correctedGroupedData
        };
    }
}

module.exports = Order;