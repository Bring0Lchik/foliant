// utils/reportGenerator.js
const db = require('../config/db');
const papaparse = require('papaparse');

async function generateSalesReport() {
    const [salesData] = await db.query(`
        SELECT 
            oi.book_id,
            b.title,
            SUM(oi.quantity) as total_quantity_sold,
            SUM(oi.quantity * oi.price_per_item) as total_revenue
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        GROUP BY oi.book_id, b.title
        ORDER BY total_revenue DESC
    `);
    return papaparse.unparse(salesData);
}

async function generateStockReport() {
    const [stockData] = await db.query(`
        SELECT id, title, stock_quantity, price FROM books ORDER BY stock_quantity ASC
    `);
    return papaparse.unparse(stockData);
}

module.exports = {
    generateSalesReport,
    generateStockReport
};