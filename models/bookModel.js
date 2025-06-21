const db = require('../config/db');

class Book {
    static async findAll({ searchTerm, categoryId, authorId, publisherId, minPrice, maxPrice, startYear, endYear }) {
        let query = `
            SELECT 
                b.id, b.title, b.cover_image_path, b.price,
                GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as authors
            FROM books b
            LEFT JOIN book_authors ba ON b.id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.id
            LEFT JOIN book_categories bc ON b.id = bc.book_id
            WHERE b.stock_quantity > 0
        `;
        const params = [];

        if (searchTerm) { query += ` AND b.title LIKE ?`; params.push(`%${searchTerm}%`); }
        if (categoryId) { query += ` AND bc.category_id = ?`; params.push(categoryId); }
        if (authorId) { query += ` AND ba.author_id = ?`; params.push(authorId); }
        if (publisherId) { query += ` AND b.publisher_id = ?`; params.push(publisherId); }
        if (minPrice) { query += ` AND b.price >= ?`; params.push(minPrice); }
        if (maxPrice) { query += ` AND b.price <= ?`; params.push(maxPrice); }
        if (startYear) { query += ` AND b.publication_year >= ?`; params.push(startYear); }
        if (endYear) { query += ` AND b.publication_year <= ?`; params.push(endYear); }

        query += ` GROUP BY b.id ORDER BY b.title ASC`;
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async findById(bookId, forClient = true) {
        if (forClient) {
            const query = `SELECT b.*, p.name as publisher_name, GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as authors, GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') as categories FROM books b LEFT JOIN publishers p ON b.publisher_id = p.id LEFT JOIN book_authors ba ON b.id = ba.book_id LEFT JOIN authors a ON ba.author_id = a.id LEFT JOIN book_categories bc ON b.id = bc.book_id LEFT JOIN categories c ON bc.category_id = c.id WHERE b.id = ? AND b.stock_quantity > 0 GROUP BY b.id;`;
            const [rows] = await db.query(query, [bookId]);
            return rows[0];
        } else {
            const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [bookId]);
            return rows[0];
        }
    }

    static async getReviews(bookId) {
        const [rows] = await db.query('SELECT r.*, u.full_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.book_id = ? ORDER BY r.created_at DESC', [bookId]);
        return rows;
    }

    static async addReview(bookId, userId, rating, comment) {
        await db.query('INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',[bookId, userId, rating, comment]);
    }

    static async findLatest(limit) {
        const [rows] = await db.query(`SELECT b.id, b.title, b.cover_image_path, b.price, GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as authors FROM books b LEFT JOIN book_authors ba ON b.id = ba.book_id LEFT JOIN authors a ON ba.author_id = a.id WHERE b.stock_quantity > 0 GROUP BY b.id ORDER BY b.id DESC LIMIT ?;`, [limit]);
        return rows;
    }

    static async findRandom() {
        const [rows] = await db.query('SELECT id FROM books WHERE stock_quantity > 0 ORDER BY RAND() LIMIT 1');
        return rows[0];
    }
    
    static async getAllForAdmin(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [books] = await db.query('SELECT * FROM books ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM books');
        return { books, total, limit };
    }

    static async getAssociated(bookId) {
        const [bookAuthors] = await db.query('SELECT author_id FROM book_authors WHERE book_id = ?', [bookId]);
        const [bookCategories] = await db.query('SELECT category_id FROM book_categories WHERE book_id = ?', [bookId]);
        return { bookAuthors: bookAuthors.map(a => a.author_id), bookCategories: bookCategories.map(c => c.category_id) };
    }
    
    static async create(bookData) {
        const { title, isbn, description, publisher_id, publication_year, pages, cover_image_path, price, stock_quantity, authors, categories } = bookData;
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO books (title, isbn, description, publisher_id, publication_year, pages, cover_image_path, price, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [title, isbn, description, publisher_id || null, publication_year, pages, cover_image_path || '/images/placeholder.jpg', price, stock_quantity]
            );
            const bookId = result.insertId;

            if (authors) {
                const authorIds = Array.isArray(authors) ? authors : [authors];
                for (const authorId of authorIds) {
                    await connection.query('INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)', [bookId, authorId]);
                }
            }
            if (categories) {
                const categoryIds = Array.isArray(categories) ? categories : [categories];
                for (const categoryId of categoryIds) {
                    await connection.query('INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)', [bookId, categoryId]);
                }
            }
            await connection.commit();
            return bookId;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    static async update(bookId, bookData) {
        const { title, isbn, description, publisher_id, publication_year, pages, cover_image_path, price, stock_quantity, authors, categories } = bookData;
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            let updateQuery = 'UPDATE books SET title=?, isbn=?, description=?, publisher_id=?, publication_year=?, pages=?, price=?, stock_quantity=?';
            const params = [title, isbn, description, publisher_id || null, publication_year, pages, price, stock_quantity];
            
            if (cover_image_path) {
                updateQuery += ', cover_image_path=?';
                params.push(cover_image_path);
            }
            
            updateQuery += ' WHERE id=?';
            params.push(bookId);

            await connection.query(updateQuery, params);

            await connection.query('DELETE FROM book_authors WHERE book_id = ?', [bookId]);
            if (authors) {
                const authorIds = Array.isArray(authors) ? authors : [authors];
                for (const authorId of authorIds) {
                    await connection.query('INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)', [bookId, authorId]);
                }
            }

            await connection.query('DELETE FROM book_categories WHERE book_id = ?', [bookId]);
            if (categories) {
                const categoryIds = Array.isArray(categories) ? categories : [categories];
                for (const categoryId of categoryIds) {
                    await connection.query('INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)', [bookId, categoryId]);
                }
            }
            
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
    
    static async delete(bookId) {
        await db.query('DELETE FROM books WHERE id = ?', [bookId]);
    }
    
    static async createAuthor(name) {
        const [result] = await db.query('INSERT INTO authors (name) VALUES (?)', [name]);
        return { id: result.insertId, name };
    }

    static async createPublisher(name) {
        const [result] = await db.query('INSERT INTO publishers (name) VALUES (?)', [name]);
        return { id: result.insertId, name };
    }
   
    static async getTopSelling({ startDate, endDate }, limit = 5) {
        let query = `SELECT b.title, SUM(oi.quantity) as total_quantity FROM order_items oi JOIN books b ON oi.book_id = b.id JOIN orders o ON oi.order_id = o.id WHERE 1=1 `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY b.id, b.title ORDER BY total_quantity DESC LIMIT ?';
        params.push(limit);
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getSalesByCategory({ startDate, endDate }) {
        let query = `SELECT c.name as category_name, SUM(oi.quantity * oi.price_per_item) as total_revenue FROM order_items oi JOIN books b ON oi.book_id = b.id JOIN book_categories bc ON b.id = bc.book_id JOIN categories c ON bc.category_id = c.id JOIN orders o ON oi.order_id = o.id WHERE 1=1 `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY c.name ORDER BY total_revenue DESC';
        const [rows] = await db.query(query, params);
        return rows;
    }
    
    static async getStockReport() {
        const [rows] = await db.query(`SELECT id, title, stock_quantity, price FROM books ORDER BY stock_quantity ASC`);
        return rows;
    }

    static async getAuthorPopularityReport({ startDate, endDate }) {
        let query = `SELECT a.name, COUNT(oi.id) as items_sold, SUM(oi.quantity * oi.price_per_item) as total_revenue FROM order_items oi JOIN books b ON oi.book_id = b.id JOIN book_authors ba ON b.id = ba.book_id JOIN authors a ON ba.author_id = a.id JOIN orders o ON oi.order_id = o.id WHERE 1=1 `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY a.name ORDER BY total_revenue DESC';
        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = Book;