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
}

module.exports = SpecialOffer;