const db = require('../config/db');

class SpecialOffer {
    static async create({ userId, bookId, offerPrice, expiresAt }) {
        const [result] = await db.query(
            'INSERT INTO special_offers (user_id, book_id, offer_price, expires_at) VALUES (?, ?, ?, ?)',
            [userId, bookId, offerPrice, expiresAt]
        );
        return result.insertId;
    }

    static async findActiveForUser(userId) {
        const [rows] = await db.query(`
            SELECT so.*, b.title as book_title, b.cover_image_path, b.price as original_price
            FROM special_offers so
            JOIN books b ON so.book_id = b.id
            WHERE so.user_id = ? AND so.expires_at > NOW() AND so.is_accepted = 0
            ORDER BY so.created_at DESC
        `, [userId]);
        return rows;
    }

    static async findById(offerId) {
        const [rows] = await db.query('SELECT * FROM special_offers WHERE id = ?', [offerId]);
        return rows[0];
    }

    static async accept(offerId) {
        await db.query('UPDATE special_offers SET is_accepted = 1 WHERE id = ?', [offerId]);
    }
    
    /**
     * НОВЫЙ МЕТОД: Отчет по эффективности промо-акций
     */
    static async getPromoEffectivenessReport({ startDate, endDate }) {
        let whereClause = ' WHERE 1=1 ';
        const params = [];
        if (startDate) { whereClause += ' AND so.created_at >= ?'; params.push(startDate); }
        if (endDate) { whereClause += ' AND so.created_at <= ?'; params.push(endDate + ' 23:59:59'); }

        // 1. Сводные метрики
        const summaryQuery = `
            SELECT
                COUNT(id) as total_created,
                SUM(is_accepted) as total_accepted,
                SUM(CASE WHEN is_accepted = 1 THEN offer_price ELSE 0 END) as additional_revenue
            FROM special_offers
            ${whereClause.replace(/so\./g, '')}
        `;
        const [[summary]] = await db.query(summaryQuery, params);

        const metrics = {
            totalCreated: Number(summary.total_created) || 0,
            totalAccepted: Number(summary.total_accepted) || 0,
            conversion: Number(summary.total_created) > 0 ? ((Number(summary.total_accepted) / Number(summary.total_created)) * 100) : 0,
            additionalRevenue: Number(summary.additional_revenue) || 0
        };

        // 2. Детализированная таблица
        const detailsQuery = `
            SELECT
                so.created_at,
                so.expires_at,
                so.is_accepted,
                so.offer_price,
                b.title as book_title,
                b.price as original_price,
                u.full_name as client_name
            FROM special_offers so
            JOIN books b ON so.book_id = b.id
            JOIN users u ON so.user_id = u.id
            ${whereClause}
            ORDER BY so.created_at DESC
        `;
        const [details] = await db.query(detailsQuery, params);
        
        details.forEach(d => {
            // ИСПРАВЛЕНИЕ: Явное преобразование в число
            d.original_price = Number(d.original_price) || 0;
            d.offer_price = Number(d.offer_price) || 0;

            if (d.is_accepted) {
                d.status = 'Принято';
            } else if (new Date(d.expires_at) < new Date()) {
                d.status = 'Истекло';
            } else {
                d.status = 'Ожидает';
            }
        });

        return { metrics, details };
    }
}

module.exports = SpecialOffer;