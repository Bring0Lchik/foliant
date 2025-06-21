const db = require('../config/db');

class Publisher {
    static async getPopularityReport({ startDate, endDate }) {
        let query = `
            SELECT p.name, COUNT(oi.id) as items_sold, SUM(oi.quantity * oi.price_per_item) as total_revenue
            FROM order_items oi
            JOIN books b ON oi.book_id = b.id
            JOIN publishers p ON b.publisher_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.name IS NOT NULL AND 1=1 `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY p.name ORDER BY total_revenue DESC';
        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = Publisher;