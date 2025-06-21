const db = require('../config/db');
const bcrypt = require('bcryptjs');
class User {
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, email, full_name, role_id, delivery_address, is_blocked, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(fullName, email, password, roleId = 2) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Если пользователя сразу создают админом, устанавливаем дату повышения
        const promotedAt = (roleId === 1) ? new Date() : null;

        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password_hash, role_id, promoted_to_admin_at) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, hashedPassword, roleId, promotedAt]
        );
        return result.insertId;
    }
    
    static async updateProfile(id, fullName, deliveryAddress) {
        await db.query('UPDATE users SET full_name = ?, delivery_address = ? WHERE id = ?', [fullName, deliveryAddress, id]);
    }

    static async getAllWithRoles() {
        const [rows] = await db.query(`
            SELECT u.id, u.full_name, u.email, u.is_blocked, u.created_at, r.name as role_name 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            ORDER BY u.id ASC
        `);
        return rows;
    }

    static async toggleBlock(id) {
        const user = await this.findById(id);
        if (!user) return null;
        const newStatus = !user.is_blocked;
        await db.query('UPDATE users SET is_blocked = ? WHERE id = ?', [newStatus, id]);
        return newStatus;
    }
    
    static async changeRole(userId, newRoleId) {
        // Если повышаем до админа, ставим текущую дату.
        // Если понижаем, сбрасываем дату.
        const promotedAt = (newRoleId === 1) ? new Date() : null;
        await db.query(
            'UPDATE users SET role_id = ?, promoted_to_admin_at = ? WHERE id = ?', 
            [newRoleId, promotedAt, userId]
        );
    }

    // НОВАЯ ЛОГИКА СУПЕР-АДМИНА
    static async getSuperAdminId() {
        // Супер-админ - это админ с самой ранней датой повышения.
        // Если у нескольких дата null (старые админы), то выбирается тот, кто раньше зарегистрировался.
        const [rows] = await db.query(`
            SELECT id FROM users 
            WHERE role_id = 1 
            ORDER BY promoted_to_admin_at ASC, created_at ASC 
            LIMIT 1
        `);
        return rows.length > 0 ? rows[0].id : null;
    }
    
    static async getTopClients({ startDate, endDate }, limit = 5) {
        let query = `
            SELECT u.full_name, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
            FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1 `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY u.id, u.full_name ORDER BY total_spent DESC LIMIT ?';
        params.push(limit);
        const [rows] = await db.query(query, params);
        return rows;
    }
     static async getActivityReport({ startDate, endDate }) {
        let query = `
            SELECT 
                u.full_name, u.email, 
                COUNT(DISTINCT o.id) as order_count, 
                IFNULL(SUM(o.total_amount), 0) as total_spent, 
                MAX(o.created_at) as last_order_date,
                (SELECT COUNT(r.id) FROM reviews r WHERE r.user_id = u.id) as review_count
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id 
            WHERE u.role_id = 2 `;
        const params = [];

        // Фильтр по дате применяется к заказам, но клиенты без заказов все равно должны отображаться
        if (startDate || endDate) {
            query += ' AND (';
            const dateConditions = [];
            if (startDate) {
                dateConditions.push('o.created_at >= ?');
                params.push(startDate);
            }
            if (endDate) {
                dateConditions.push('o.created_at <= ?');
                params.push(endDate + ' 23:59:59');
            }
            // Включаем пользователей без заказов в этот период
            query += dateConditions.join(' AND ') + ' OR o.id IS NULL)';
        }
        
        query += ' GROUP BY u.id, u.full_name, u.email ORDER BY total_spent DESC';
        const [rows] = await db.query(query, params);
        return rows;
    }
}
module.exports = User;
