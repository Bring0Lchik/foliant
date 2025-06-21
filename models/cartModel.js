const db = require('../config/db');

class Cart {
    // getItems теперь может принимать массив ID и возвращает ВСЕ нужные поля
    static async getItems(userId, itemIds = null) {
        let query = `
            SELECT 
                b.id as book_id, 
                b.title, 
                b.cover_image_path, 
                b.price as original_price,
                ci.quantity, 
                ci.override_price,
                b.stock_quantity 
            FROM cart_items ci 
            JOIN books b ON ci.book_id = b.id 
            WHERE ci.user_id = ?
        `;
        const params = [userId];

        if (itemIds && itemIds.length > 0) {
            const placeholders = itemIds.map(() => '?').join(',');
            query += ` AND b.id IN (${placeholders})`;
            params.push(...itemIds);
        }

        const [items] = await db.query(query, params);
        
        return items.map(item => ({
            ...item,
            effective_price: item.override_price !== null ? item.override_price : item.original_price
        }));
    }

    static async addItem(userId, bookId, quantity = 1, overridePrice = null) {
        const [existing] = await db.query('SELECT * FROM cart_items WHERE user_id = ? AND book_id = ?', [userId, bookId]);
        if (existing.length > 0) {
            await db.query('UPDATE cart_items SET quantity = quantity + ?, override_price = ? WHERE id = ?', [quantity, overridePrice, existing[0].id]);
        } else {
            await db.query('INSERT INTO cart_items (user_id, book_id, quantity, override_price) VALUES (?, ?, ?, ?)', [userId, bookId, quantity, overridePrice]);
        }
    }

    static async updateItem(userId, bookId, quantity) {
        if (quantity > 0) {
            await db.query('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND book_id = ?', [quantity, userId, bookId]);
        } else {
            await this.removeItem(userId, bookId);
        }
    }

    static async removeItem(userId, bookId) {
        await db.query('DELETE FROM cart_items WHERE user_id = ? AND book_id = ?', [userId, bookId]);
    }
    
    static async removeItems(userId, bookIds) {
        if (!bookIds || bookIds.length === 0) return;
        const placeholders = bookIds.map(() => '?').join(',');
        await db.query(`DELETE FROM cart_items WHERE user_id = ? AND book_id IN (${placeholders})`, [userId, ...bookIds]);
    }

    static async getItemsCount(userId) {
        const [rows] = await db.query('SELECT COUNT(id) as count FROM cart_items WHERE user_id = ?', [userId]);
        return rows[0].count;
    }
}

module.exports = Cart;