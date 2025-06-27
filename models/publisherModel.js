const db = require('../config/db');

class Publisher {
    /**
     * Находит все издательства с подсчетом количества книг.
     */
    static async findAllWithBookCount() {
        const query = `
            SELECT p.id, p.name, COUNT(b.id) as book_count
            FROM publishers p
            LEFT JOIN books b ON p.id = b.publisher_id
            GROUP BY p.id, p.name
            ORDER BY p.name ASC;
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    /**
     * Находит одно издательство по ID со всей связанной информацией.
     */
    static async findByIdWithDetails(id) {
        const [[publisher]] = await db.query('SELECT * FROM publishers WHERE id = ?', [id]);
        if (!publisher) return null;

        const [books] = await db.query('SELECT id, title, isbn, price, stock_quantity FROM books WHERE publisher_id = ? ORDER BY title ASC', [id]);

        const analyticsQuery = `
            SELECT
                SUM(b.stock_quantity) as totalStock,
                (SELECT SUM(oi.quantity * oi.price_per_item)
                 FROM order_items oi
                 JOIN books b_oi ON oi.book_id = b_oi.id
                 WHERE b_oi.publisher_id = ?) as totalRevenue
            FROM books b
            WHERE b.publisher_id = ?;
        `;
        const [[analytics]] = await db.query(analyticsQuery, [id, id]);

        return {
            ...publisher,
            books: books,
            totalBooks: books.length,
            totalStock: parseInt(analytics.totalStock) || 0,
            totalRevenue: parseFloat(analytics.totalRevenue) || 0
        };
    }
    
    static async findById(id) {
        const [[publisher]] = await db.query('SELECT * FROM publishers WHERE id = ?', [id]);
        return publisher;
    }

    /**
     * Создает новое издательство.
     */
    static async create(name) {
        const [result] = await db.query('INSERT INTO publishers (name) VALUES (?)', [name]);
        return result.insertId;
    }

    /**
     * Обновляет название издательства.
     */
    static async update(id, name) {
        const [result] = await db.query('UPDATE publishers SET name = ? WHERE id = ?', [name, id]);
        return result.affectedRows > 0;
    }

    /**
     * Удаляет издательство.
     */
    static async delete(id) {
        const [result] = await db.query('DELETE FROM publishers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Аналитический отчет по издательствам (Master-Detail)
     */
    static async getPublisherSalesReport({ startDate, endDate }) {
        let whereClause = " WHERE o.status != 'cancelled' AND b.publisher_id IS NOT NULL ";
        const params = [];
        if (startDate) { whereClause += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { whereClause += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }

        const masterQuery = `
            SELECT
                p.id as publisher_id, p.name as publisher_name,
                SUM(oi.quantity * oi.price_per_item) as total_revenue,
                SUM(oi.quantity) as total_books_sold
            FROM publishers p
            JOIN books b ON p.id = b.publisher_id
            JOIN order_items oi ON b.id = oi.book_id
            JOIN orders o ON oi.order_id = o.id
            ${whereClause}
            GROUP BY p.id, p.name ORDER BY total_revenue DESC
        `;
        const [publishers] = await db.query(masterQuery, params);

        if (publishers.length === 0) return [];

        publishers.forEach(p => {
            p.total_revenue = Number(p.total_revenue) || 0;
            p.total_books_sold = Number(p.total_books_sold) || 0;
        });

        const detailsQuery = `
            SELECT
                b.publisher_id, b.title, b.isbn, b.stock_quantity,
                SUM(oi.quantity) as sold_quantity,
                SUM(oi.quantity * oi.price_per_item) as revenue
            FROM books b
            JOIN order_items oi ON b.id = oi.book_id
            JOIN orders o ON oi.order_id = o.id
            ${whereClause}
            GROUP BY b.id, b.title, b.isbn, b.stock_quantity ORDER BY revenue DESC
        `;
        const [bookDetails] = await db.query(detailsQuery, params);
        
        bookDetails.forEach(b => { b.revenue = Number(b.revenue) || 0; });

        const detailsMap = bookDetails.reduce((acc, book) => {
            if (!acc[book.publisher_id]) acc[book.publisher_id] = [];
            acc[book.publisher_id].push(book);
            return acc;
        }, {});

        publishers.forEach(p => { p.books = detailsMap[p.publisher_id] || []; });

        return publishers;
    }
}

module.exports = Publisher;