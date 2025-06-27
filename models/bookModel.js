const db = require('../config/db');

class Book {

    static async updateAverageRating(bookId) {
        const [result] = await db.query(
            'SELECT AVG(rating) as averageRating FROM reviews WHERE book_id = ?',
            [bookId]
        );
        const averageRating = result[0].averageRating || 0;
        await db.query(
            'UPDATE books SET rating = ? WHERE id = ?',
            [averageRating, bookId]
        );
    }

    static async findAll({ searchTerm, categoryId, authorId, publisherId, minPrice, maxPrice, startYear, endYear, sortBy = 'newest' }) {
        let query = `
            SELECT
                b.id, b.title, b.cover_image_path, b.price, b.rating,
                GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as authors,
                (SELECT COUNT(oi.id) FROM order_items oi WHERE oi.book_id = b.id) as sales_count
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

        query += ` GROUP BY b.id, b.title, b.cover_image_path, b.price, b.rating`;

        let orderByClause = '';
        switch (sortBy) {
            case 'popularity_desc': orderByClause = ' ORDER BY sales_count DESC, b.title ASC'; break;
            case 'rating_desc': orderByClause = ' ORDER BY b.rating DESC, b.title ASC'; break;
            case 'price_asc': orderByClause = ' ORDER BY b.price ASC'; break;
            case 'price_desc': orderByClause = ' ORDER BY b.price DESC'; break;
            case 'title_asc': orderByClause = ' ORDER BY b.title ASC'; break;
            case 'oldest': orderByClause = ' ORDER BY b.id ASC'; break;
            case 'newest': default: orderByClause = ' ORDER BY b.id DESC'; break;
        }

        query += orderByClause;
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async findById(bookId, forClient = true) {
        const query = `
            SELECT b.*, p.name as publisher_name,
            GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as authors,
            GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') as categories
            FROM books b
            LEFT JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN book_authors ba ON b.id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.id
            LEFT JOIN book_categories bc ON b.id = bc.book_id
            LEFT JOIN categories c ON bc.category_id = c.id
            WHERE b.id = ?
            GROUP BY b.id;
        `;
        const [rows] = await db.query(query, [bookId]);
        return rows[0];
    }
    
    static async getReviews(bookId) {
        const [rows] = await db.query('SELECT r.*, u.full_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.book_id = ? ORDER BY r.created_at DESC', [bookId]);
        return rows;
    }

    static async addReview(bookId, userId, rating, comment) {
        await db.query('INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [bookId, userId, rating, comment]);
        await this.updateAverageRating(bookId);
    }

    static async findLatest(limit) {
        const query = `
            SELECT b.id, b.title, b.cover_image_path, b.price, b.rating,
            GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as authors
            FROM books b
            LEFT JOIN book_authors ba ON b.id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.id
            WHERE b.stock_quantity > 0
            GROUP BY b.id
            ORDER BY b.id DESC
            LIMIT ?;
        `;
        const [rows] = await db.query(query, [limit]);
        return rows;
    }

    static async findRandom() {
        const [rows] = await db.query('SELECT id FROM books WHERE stock_quantity > 0 ORDER BY RAND() LIMIT 1');
        return rows[0];
    }
    
    static async getAllForAdmin(page = 1, limit = 10, searchTerm = "") {
        const offset = (page - 1) * limit;
        let booksQuery = `
            SELECT b.*, GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as authors
            FROM books b
            LEFT JOIN book_authors ba ON b.id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.id
        `;
        const params = [];
        let countQuery = `SELECT COUNT(*) as total FROM books`;

        if (searchTerm) {
            booksQuery += ` WHERE b.title LIKE ?`;
            params.push(`%${searchTerm}%`);
            countQuery += ` WHERE title LIKE ?`;
        }
        
        booksQuery += ` GROUP BY b.id ORDER BY b.id DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const countParams = searchTerm ? [`%${searchTerm}%`] : [];
        const [books] = await db.query(booksQuery, params);
        const [[{ total }]] = await db.query(countQuery, countParams);

        return { books, total, limit };
    }

    static async getAssociated(bookId) {
        const [bookAuthors] = await db.query('SELECT author_id FROM book_authors WHERE book_id = ?', [bookId]);
        const [bookCategories] = await db.query('SELECT category_id FROM book_categories WHERE book_id = ?', [bookId]);
        return { 
            bookAuthors: bookAuthors.map(a => a.author_id), 
            bookCategories: bookCategories.map(c => c.category_id) 
        };
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

            if (authors && authors.length > 0) {
                const authorIds = Array.isArray(authors) ? authors : [authors];
                const authorValues = authorIds.map(authorId => [bookId, parseInt(authorId)]);
                await connection.query('INSERT INTO book_authors (book_id, author_id) VALUES ?', [authorValues]);
            }
            
            if (categories && categories.length > 0) {
                const categoryIds = Array.isArray(categories) ? categories : [categories];
                const categoryValues = categoryIds.map(categoryId => [bookId, parseInt(categoryId)]);
                await connection.query('INSERT INTO book_categories (book_id, category_id) VALUES ?', [categoryValues]);
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
            if (cover_image_path && cover_image_path.length > 0) {
                updateQuery += ', cover_image_path=?';
                params.push(cover_image_path);
            }
            updateQuery += ' WHERE id=?';
            params.push(bookId);
            await connection.query(updateQuery, params);

            await connection.query('DELETE FROM book_authors WHERE book_id = ?', [bookId]);
            if (authors && authors.length > 0) {
                const authorIds = Array.isArray(authors) ? authors : [authors];
                const authorValues = authorIds.map(authorId => [bookId, parseInt(authorId)]);
                await connection.query('INSERT INTO book_authors (book_id, author_id) VALUES ?', [authorValues]);
            }
            
            await connection.query('DELETE FROM book_categories WHERE book_id = ?', [bookId]);
            if (categories && categories.length > 0) {
                const categoryIds = Array.isArray(categories) ? categories : [categories];
                const categoryValues = categoryIds.map(categoryId => [bookId, parseInt(categoryId)]);
                await connection.query('INSERT INTO book_categories (book_id, category_id) VALUES ?', [categoryValues]);
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

    static async createCategory(name) {
        const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        return { id: result.insertId, name };
    }

    static async getTopSelling({ startDate, endDate }, limit = 5) {
        let query = `SELECT b.title, SUM(oi.quantity) as total_quantity FROM order_items oi JOIN books b ON oi.book_id = b.id JOIN orders o ON oi.order_id = o.id WHERE o.status != 'cancelled' `;
        const params = [];
        if (startDate) { query += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        query += ' GROUP BY b.id, b.title ORDER BY total_quantity DESC LIMIT ?';
        params.push(limit);
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getSalesByCategory({ startDate, endDate }) {
        let query = `SELECT c.name as category_name, SUM(oi.quantity * oi.price_per_item) as total_revenue FROM order_items oi JOIN books b ON oi.book_id = b.id JOIN book_categories bc ON b.id = bc.book_id JOIN categories c ON bc.category_id = c.id JOIN orders o ON oi.order_id = o.id WHERE o.status != 'cancelled' `;
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

    static async getProductMovementReport({ startDate, endDate }) {
        let salesQuery = `
            SELECT 
                oi.book_id,
                SUM(oi.quantity) as sold_quantity,
                SUM(oi.quantity * oi.price_per_item) as sales_revenue
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status != 'cancelled'
        `;
        const params = [];
        if (startDate) { salesQuery += ' AND o.created_at >= ?'; params.push(startDate); }
        if (endDate) { salesQuery += ' AND o.created_at <= ?'; params.push(endDate + ' 23:59:59'); }
        salesQuery += ' GROUP BY oi.book_id';

        const [salesData] = await db.query(salesQuery, params);
        const salesMap = new Map(salesData.map(item => [item.book_id, item]));

        const [allBooks] = await db.query(`
            SELECT 
                b.id,
                b.title,
                b.price,
                b.stock_quantity,
                c.name as category_name,
                c.id as category_id,
                GROUP_CONCAT(a.name SEPARATOR ', ') as authors
            FROM books b
            LEFT JOIN book_authors ba ON b.id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.id
            LEFT JOIN book_categories bc ON b.id = bc.book_id
            LEFT JOIN categories c ON bc.category_id = c.id
            GROUP BY b.id, c.id
            ORDER BY c.name, b.title
        `);

        const reportByCategory = allBooks.reduce((acc, book) => {
            const categoryId = book.category_id || 0;
            const categoryName = book.category_name || 'Без категории';

            if (!acc[categoryId]) {
                acc[categoryId] = {
                    categoryName: categoryName,
                    books: []
                };
            }

            const sales = salesMap.get(book.id) || { sold_quantity: 0, sales_revenue: 0 };
            
            acc[categoryId].books.push({
                ...book,
                price: Number(book.price) || 0,
                revenue_for_period: Number(sales.sales_revenue) || 0,
                sold_for_period: Number(sales.sold_quantity) || 0
            });

            return acc;
        }, {});

        return Object.values(reportByCategory);
    }

    static async getRatingsAndReviewsReport({ startDate, endDate }) {
        let query = `
            SELECT
                r.id as review_id,
                r.rating,
                r.comment,
                r.created_at,
                b.id as book_id,
                b.title as book_title,
                u.full_name as user_name
            FROM reviews r
            JOIN books b ON r.book_id = b.id
            JOIN users u ON r.user_id = u.id
        `;
        const params = [];
        if (startDate || endDate) {
            query += ' WHERE ';
            const dateConditions = [];
            if (startDate) {
                dateConditions.push('r.created_at >= ?');
                params.push(startDate);
            }
            if (endDate) {
                dateConditions.push('r.created_at <= ?');
                params.push(endDate + ' 23:59:59');
            }
            query += dateConditions.join(' AND ');
        }
        query += ' ORDER BY b.title, r.created_at DESC';

        const [reviews] = await db.query(query, params);

        const reportByBook = reviews.reduce((acc, review) => {
            const bookId = review.book_id;
            if (!acc[bookId]) {
                acc[bookId] = {
                    book_id: bookId,
                    book_title: review.book_title,
                    total_ratings: 0,
                    total_reviews: 0,
                    sum_ratings: 0,
                    average_rating: 0,
                    reviews: []
                };
            }

            acc[bookId].total_ratings++;
            acc[bookId].sum_ratings += review.rating;
            if (review.comment && review.comment.trim() !== '') {
                acc[bookId].total_reviews++;
            }
            
            acc[bookId].reviews.push({
                user_name: review.user_name,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at
            });

            return acc;
        }, {});

        Object.values(reportByBook).forEach(book => {
            if (book.total_ratings > 0) {
                book.average_rating = Number(book.sum_ratings / book.total_ratings);
            }
        });

        return Object.values(reportByBook);
    }
}

module.exports = Book;