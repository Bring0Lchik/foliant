const db = require('../config/db');

class Notification {
    static async create({ userId, type, message, link = null }) {
        await db.query(
            'INSERT INTO notifications (user_id, type, message, link) VALUES (?, ?, ?, ?)',
            [userId, type, message, link]
        );
    }

    static async findByUser(userId) {
        const [rows] = await db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }

    static async getUnreadCount(userId) {
        const [rows] = await db.query('SELECT COUNT(id) as count FROM notifications WHERE user_id = ? AND is_read = 0', [userId]);
        return rows[0].count;
    }

    static async markAsRead(notificationId, userId) {
        await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, userId]);
    }
    
    static async markAllAsRead(userId) {
        await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    }
}

module.exports = Notification;