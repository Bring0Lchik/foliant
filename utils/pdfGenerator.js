const PDFDocument = require('pdfkit');
const fs = require('fs');

// Укажите корректный путь к шрифту, поддерживающему кириллицу.
const fontPath = 'C:\\Windows\\Fonts\\arial.ttf'; 

async function generatePdf(title, filters, reportData, reportType) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
            autoFirstPage: false 
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
        
        doc.addPage();

        try {
            if (fs.existsSync(fontPath)) {
                doc.registerFont('Arial', fontPath);
                doc.font('Arial');
            } else {
                 console.warn(`Шрифт не найден по пути: ${fontPath}. Кириллица может отображаться некорректно.`);
            }
        } catch(e) {
            console.error("Ошибка регистрации шрифта:", e);
        }

        doc.fontSize(18).text(title, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Период: с ${filters.startDate || 'начала времен'} по ${filters.endDate || 'сегодня'}`, { align: 'center' });
        doc.moveDown(2);

        switch (reportType) {
            case 'sales_summary': drawSalesSummary(doc, reportData.salesSummaryReport); break;
            case 'publisher_sales': drawPublisherReport(doc, reportData.publisherSalesReport); break;
            case 'product_movement': drawProductMovementReport(doc, reportData.productMovementReport); break;
            case 'customer_activity': drawCustomerActivityReport(doc, reportData.customerActivityReport); break;
            case 'promo_effectiveness': drawPromoEffectivenessReport(doc, reportData.promoEffectivenessReport); break;
            case 'ratings_reviews': drawRatingsReviewsReport(doc, reportData.ratingsAndReviewsReport); break;
            default: doc.fontSize(12).text('Тип отчета не поддерживается.', { align: 'center' });
        }

        // БЛОК ФУТЕРА И НУМЕРАЦИИ ПОЛНОСТЬЮ УДАЛЕН

        doc.end();
    });
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ РИСОВАНИЯ (остаются без изменений) ---

function drawSalesSummary(doc, report) {
    if (!report || !report.metrics) return doc.text('Нет данных для отчета.');
    doc.fontSize(12).text('Ключевые показатели:', { underline: true }).moveDown();
    doc.fontSize(10).text(`Общая выручка: ${Number(report.metrics.totalRevenue||0).toFixed(2)} ₽`).text(`Продано книг: ${Number(report.metrics.totalBooksSold||0)} шт.`).text(`Количество заказов: ${Number(report.metrics.totalOrders||0)}`).text(`Средний чек: ${Number(report.metrics.averageCheck||0).toFixed(2)} ₽`).moveDown(2);
    if (report.groupedData.length > 0) {
        drawTable(doc, 'Статистика по периодам', report.groupedData, [
            { id: 'period', header: 'Период', width: 100 },
            { id: 'revenue', header: 'Выручка', width: 100, format: v => `${Number(v||0).toFixed(2)} ₽` },
            { id: 'books_sold', header: 'Книг (шт)', width: 80 },
            { id: 'order_count', header: 'Заказов', width: 80 },
            { id: 'avg_check', header: 'Средний чек', width: 100, format: v => `${Number(v||0).toFixed(2)} ₽` },
        ]);
    } else doc.text('Нет данных по периодам.');
}

function drawPublisherReport(doc, report) {
    if (!report || report.length === 0) return doc.text('Нет данных для отчета.');
    report.forEach((publisher, index) => {
        if (index > 0) doc.addPage();
        doc.fontSize(12).text(`Издательство: ${publisher.publisher_name}`, { underline: true }).moveDown();
        doc.fontSize(10).text(`Общая выручка: ${Number(publisher.total_revenue||0).toFixed(2)} ₽ | Всего продано: ${Number(publisher.total_books_sold||0)} шт.`).moveDown();
        if (publisher.books.length > 0) {
            drawTable(doc, '', publisher.books, [
                { id: 'title', header: 'Книга', width: 220 },
                { id: 'sold_quantity', header: 'Продано', width: 60 },
                { id: 'revenue', header: 'Выручка', width: 80, format: v => `${Number(v||0).toFixed(2)} ₽` },
                { id: 'stock_quantity', header: 'Остаток', width: 60 },
            ]);
        } else doc.text('Нет данных о продажах книг этого издательства за период.');
    });
}

function drawProductMovementReport(doc, report) {
    if (!report || report.length === 0) return doc.text('Нет данных для отчета.');
    report.forEach((category, index) => {
        if (index > 0) doc.addPage();
        doc.fontSize(12).text(`Категория: ${category.categoryName}`, { underline: true }).moveDown();
        drawTable(doc, '', category.books, [
            { id: 'title', header: 'Название', width: 180 }, { id: 'authors', header: 'Автор(ы)', width: 120 },
            { id: 'sold_for_period', header: 'Продано', width: 50 },
            { id: 'revenue_for_period', header: 'Выручка', width: 70, format: v => `${Number(v||0).toFixed(2)} ₽` },
            { id: 'stock_quantity', header: 'Остаток', width: 50 },
        ]);
    });
}

function drawCustomerActivityReport(doc, report) {
    if (!report || report.length === 0) return doc.text('Нет данных для отчета.');
    drawTable(doc, 'Активность клиентов', report, [
        { id: 'full_name', header: 'Клиент', width: 150 }, { id: 'order_count', header: 'Заказов', width: 60 },
        { id: 'ltv', header: 'Сумма (LTV)', width: 100, format: v => `${Number(v||0).toFixed(2)} ₽` },
        { id: 'avg_check', header: 'Средний чек', width: 100, format: v => `${Number(v||0).toFixed(2)} ₽` },
    ]);
}

function drawPromoEffectivenessReport(doc, report) {
    if (!report || !report.metrics) return doc.text('Нет данных для отчета.');
    doc.fontSize(12).text('Ключевые показатели:', { underline: true }).moveDown();
    doc.fontSize(10).text(`Создано предложений: ${Number(report.metrics.totalCreated||0)}`).text(`Принято предложений: ${Number(report.metrics.totalAccepted||0)}`).text(`Конверсия: ${Number(report.metrics.conversion||0).toFixed(2)} %`).text(`Доп. выручка: ${Number(report.metrics.additionalRevenue||0).toFixed(2)} ₽`).moveDown(2);
    if (report.details.length > 0) {
        drawTable(doc, 'Детализация предложений', report.details, [
            { id: 'book_title', header: 'Книга', width: 150 }, { id: 'client_name', header: 'Клиент', width: 120 },
            { id: 'offer_price', header: 'Цена', width: 70, format: v => `${Number(v||0).toFixed(2)} ₽` },
            { id: 'status', header: 'Статус', width: 80 },
        ]);
    } else doc.text('Нет данных по спец. предложениям за период.');
}

function drawRatingsReviewsReport(doc, report) {
    if (!report || report.length === 0) return doc.text('Нет данных для отчета.');
    report.forEach((book, index) => {
        if (index > 0) doc.addPage();
        doc.fontSize(12).text(`Книга: ${book.book_title}`, { underline: true }).moveDown();
        doc.fontSize(10).text(`Средний рейтинг: ${Number(book.average_rating||0).toFixed(2)}/5 | Оценок: ${book.total_ratings} | Отзывов: ${book.total_reviews}`).moveDown();
        if (book.reviews.length > 0) {
            book.reviews.forEach(review => {
                doc.fontSize(9).text(`${review.user_name} (${review.rating}/5): ${review.comment || ''}`, { indent: 20 }).moveDown(0.5);
            });
        } else doc.text('Отзывов нет.');
    });
}

function drawTable(doc, title, data, columns) {
    let y = doc.y;
    const x = doc.page.margins.left;
    const rowHeight = 25;
    const tableWidth = columns.reduce((acc, col) => acc + col.width, 0);

    if (title) {
        doc.fontSize(11).text(title, { underline: true }).moveDown(0.5);
        y = doc.y;
    }

    const checkPageBreak = () => {
        if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            y = doc.page.margins.top;
            return true;
        }
        return false;
    }

    const drawHeader = () => {
        doc.fontSize(9).fillColor('black');
        let currentX = x;
        columns.forEach(col => {
            doc.text(col.header, currentX + 3, y + 5, { width: col.width - 6, align: 'left' });
            currentX += col.width;
        });
        y += rowHeight;
        doc.moveTo(x, y).lineTo(x + tableWidth, y).strokeColor('black').stroke();
    }

    drawHeader();

    data.forEach(row => {
        const pageBroken = checkPageBreak();
        if (pageBroken) drawHeader();
        
        let currentX = x;
        columns.forEach(col => {
            let value = row[col.id];
            if (col.format) value = col.format(value);
            doc.fontSize(8).text(String(value || ''), currentX + 3, y + 5, { width: col.width - 6, align: 'left' });
            currentX += col.width;
        });
        y += rowHeight;
        doc.moveTo(x, y).lineTo(x + tableWidth, y).strokeColor('#ccc').stroke();
    });
    doc.strokeColor('black');
    doc.y = y;
}

module.exports = { generatePdf };