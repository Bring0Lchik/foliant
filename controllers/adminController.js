const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const SpecialOffer = require("../models/specialOfferModel");
const Publisher = require("../models/publisherModel");
const db = require("../config/db");
const { generatePdf } = require('../utils/pdfGenerator');
const path = require('path');
const ejs = require('ejs');

const adminLayout = "layouts/admin";

// --- ДЭШБОРД И АНАЛИТИКА ---
module.exports.dashboard_get = (req, res) => {
    res.render("pages/admin/dashboard", {
        title: "Панель администратора",
        layout: adminLayout,
    });
};

module.exports.analytics_get = async (req, res) => {
    try {
        const { startDate, endDate, export: exportType, reportType } = req.query;
        const filters = { startDate, endDate };

        if (exportType === 'pdf' && reportType) {
            let reportData = {};
            let templateName = '';
            let pdfData = { title: '', filters };

            switch (reportType) {
                case 'sales_summary':
                    reportData = { salesSummaryReport: await Order.getSalesSummaryReport(filters) };
                    pdfData.title = 'Сводный отчет по продажам';
                    templateName = 'pdf_templates/sales_summary_pdf.ejs';
                    break;
                case 'publisher_sales':
                    reportData = { publisherSalesReport: await Publisher.getPublisherSalesReport(filters) };
                    pdfData.title = 'Аналитический отчет по издательствам';
                    templateName = 'pdf_templates/publisher_sales_pdf.ejs';
                    break;
                case 'product_movement':
                    reportData = { productMovementReport: await Book.getProductMovementReport(filters) };
                    pdfData.title = 'Отчет по движению и состоянию товаров';
                    templateName = 'pdf_templates/product_movement_pdf.ejs';
                    break;
                case 'customer_activity':
                    reportData = { customerActivityReport: await User.getCustomerActivityReport(filters) };
                    pdfData.title = 'Отчет по клиентской активности';
                    templateName = 'pdf_templates/customer_activity_pdf.ejs';
                    break;
                case 'promo_effectiveness':
                    reportData = { promoEffectivenessReport: await SpecialOffer.getPromoEffectivenessReport(filters) };
                    pdfData.title = 'Отчет по эффективности промо-акций';
                    templateName = 'pdf_templates/promo_effectiveness_pdf.ejs';
                    break;
                case 'ratings_reviews':
                    reportData = { ratingsAndReviewsReport: await Book.getRatingsAndReviewsReport(filters) };
                    pdfData.title = 'Сводный отчет по рейтингам и отзывам';
                    templateName = 'pdf_templates/ratings_reviews_pdf.ejs';
                    break;
                default:
                    return res.status(400).send('Данный тип отчета не поддерживается для экспорта в PDF.');
            }

            res.render(templateName, { ...pdfData, ...reportData, layout: false }, async (err, html) => {
                if (err) {
                    console.error('Ошибка рендеринга PDF шаблона:', err);
                    return res.status(500).send('Ошибка сервера при генерации HTML для PDF. Проверьте, существует ли файл шаблона.');
                }
                
                try {
                    const pdfBuffer = await generatePdf(pdfData.title, filters, reportData, reportType);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report_${new Date().toISOString().slice(0,10)}.pdf"`);
                    return res.send(pdfBuffer);
                } catch (pdfErr) {
                    console.error('Ошибка генерации PDF:', pdfErr);
                    return res.status(500).send('Ошибка сервера при создании PDF-файла.');
                }
            });
            return;
        }
        
        const [
            salesByMonth, topClients, salesByCategory, topSellingBooks,
            salesSummaryReport, publisherSalesReport, productMovementReport,
            customerActivityReport, promoEffectivenessReport, ratingsAndReviewsReport
        ] = await Promise.all([
            Order.getSalesByMonth(filters), User.getTopClients(filters), Book.getSalesByCategory(filters),
            Book.getTopSelling(filters), Order.getSalesSummaryReport(filters), Publisher.getPublisherSalesReport(filters),
            Book.getProductMovementReport(filters), User.getCustomerActivityReport(filters),
            SpecialOffer.getPromoEffectivenessReport(filters), Book.getRatingsAndReviewsReport(filters)
        ]);
        
        res.render("pages/admin/analytics", {
            title: "Аналитика и Отчеты", layout: adminLayout, filters,
            salesByMonth, topClients, salesByCategory, topSellingBooks,
            salesSummaryReport, publisherSalesReport, productMovementReport,
            customerActivityReport, promoEffectivenessReport, ratingsAndReviewsReport
        });

    } catch (err) {
        console.error("ОШИБКА НА СТРАНИЦЕ АНАЛИТИКИ ИЛИ ЭКСПОРТА:", err);
        res.status(500).send("Ошибка сервера");
    }
};

// --- УПРАВЛЕНИЕ КНИГАМИ ---
module.exports.books_list_get = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const searchQuery = req.query.search || "";
        const { books, total } = await Book.getAllForAdmin(page, limit, searchQuery);
        const totalPages = Math.ceil(total / limit);
        res.render("pages/admin/books", {
            title: "Управление книгами", layout: adminLayout,
            books, totalPages, currentPage: page, searchQuery,
        });
    } catch (err) {
        console.error("ОШИБКА НА СТРАНИЦЕ КНИГ:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.book_add_get = async (req, res) => {
    try {
        const [authors] = await db.query("SELECT * FROM authors ORDER BY name");
        const [categories] = await db.query("SELECT * FROM categories ORDER BY name");
        const [publishers] = await db.query("SELECT * FROM publishers ORDER BY name");
        const currentYear = new Date().getFullYear();
        res.render("pages/admin/book_form", {
            title: "Добавить книгу", layout: adminLayout, book: {},
            authors, categories, publishers,
            bookAuthors: [], bookCategories: [], currentYear
        });
    } catch (err) {
        console.error("Ошибка при загрузке формы добавления книги:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.book_add_post = async (req, res) => {
    try {
        const { publication_year } = req.body;
        if (publication_year && parseInt(publication_year) > new Date().getFullYear()) {
            return res.status(400).send('Год публикации не может быть в будущем.');
        }
        const bookData = { ...req.body };
        if (req.file) { bookData.cover_image_path = `/uploads/covers/${req.file.filename}`; }
        else if (req.body.cover_image_path_manual) { bookData.cover_image_path = req.body.cover_image_path_manual; }
        await Book.create(bookData);
        res.redirect("/admin/books");
    } catch (err) {
        console.error("Ошибка при добавлении книги:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.book_edit_get = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId, false);
        if (!book) { return res.status(404).send("Книга не найдена"); }
        const [authors] = await db.query("SELECT * FROM authors ORDER BY name");
        const [categories] = await db.query("SELECT * FROM categories ORDER BY name");
        const [publishers] = await db.query("SELECT * FROM publishers ORDER BY name");
        const { bookAuthors, bookCategories } = await Book.getAssociated(bookId);
        const currentYear = new Date().getFullYear();
        res.render("pages/admin/book_form", {
            title: "Редактировать книгу", layout: adminLayout, book,
            authors, categories, publishers,
            bookAuthors, bookCategories, currentYear
        });
    } catch (err) {
        console.error("Ошибка при загрузке формы редактирования:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.book_edit_post = async (req, res) => {
    try {
        const { publication_year } = req.body;
        if (publication_year && parseInt(publication_year) > new Date().getFullYear()) {
            return res.status(400).send('Год публикации не может быть в будущем.');
        }
        const bookId = req.params.id;
        const bookData = { ...req.body };
        if (req.file) { bookData.cover_image_path = `/uploads/covers/${req.file.filename}`; }
        else if (req.body.cover_image_path_manual && req.body.cover_image_path_manual.trim() !== '') { bookData.cover_image_path = req.body.cover_image_path_manual; }
        else { delete bookData.cover_image_path; }
        await Book.update(bookId, bookData);
        res.redirect("/admin/books");
    } catch (err) {
        console.error("Ошибка при обновлении книги:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.book_delete_post = async (req, res) => {
    try {
        const bookId = req.params.id;
        await Book.delete(bookId);
        res.redirect("/admin/books");
    } catch (err) {
        console.error("Ошибка при удалении книги:", err);
        res.status(500).send("Ошибка сервера");
    }
};


// --- УПРАВЛЕНИЕ ИЗДАТЕЛЬСТВАМИ ---
module.exports.getPublishersList = async (req, res) => {
    try {
        const publishers = await Publisher.findAllWithBookCount();
        res.render('pages/admin/publishers', {
            title: 'Управление издательствами', layout: adminLayout, publishers
        });
    } catch (err) {
        console.error("Ошибка на странице издательств:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.getPublisherForm = async (req, res) => {
    try {
        let publisher = {};
        if (req.params.id) {
            publisher = await Publisher.findById(req.params.id);
            if (!publisher) { return res.status(404).send('Издательство не найдено'); }
        }
        res.render('pages/admin/publisher_form', {
            title: publisher.id ? 'Редактировать издательство' : 'Добавить издательство', layout: adminLayout, publisher
        });
    } catch (err) {
        console.error("Ошибка при загрузке формы издательства:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.postCreatePublisher = async (req, res) => {
    try {
        const { name } = req.body;
        await Publisher.create(name);
        res.redirect('/admin/publishers');
    } catch (err) {
        console.error("Ошибка при создании издательства:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.postUpdatePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await Publisher.update(id, name);
        res.redirect('/admin/publishers');
    } catch (err) {
        console.error("Ошибка при обновлении издательства:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.getPublisherDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await Publisher.findByIdWithDetails(id);
        if (!details) { return res.status(404).send('Издательство не найдено'); }
        res.render('pages/admin/publisher_details', {
            title: `Детали издательства: ${details.name}`, layout: adminLayout, details
        });
    } catch (err) {
        console.error("Ошибка на детальной странице издательства:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.postDeletePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        await Publisher.delete(id);
        res.redirect('/admin/publishers');
    } catch (err) {
        console.error("Ошибка при удалении издательства:", err);
        res.status(500).send("Ошибка сервера");
    }
};


// --- УПРАВЛЕНИЕ ЗАКАЗАМИ ---
module.exports.orders_list_get = async (req, res) => {
    try {
        const orders = await Order.getDetailedSalesReport({});
        res.render("pages/admin/orders", { title: "Управление заказами", layout: adminLayout, orders: orders, });
    } catch (err) {
        console.error("Ошибка на странице заказов:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.order_status_post = async (req, res) => {
    try {
        const { order_id, status, user_id } = req.body;
        await Order.updateStatus(order_id, status);
        await Notification.create({ userId: user_id, type: "order_status", message: `Статус вашего заказа №${order_id} изменен на "${status}".`, link: "/profile", });
        res.redirect("/admin/orders");
    } catch (err) {
        console.error("Ошибка смены статуса заказа:", err);
        res.redirect("/admin/orders?error=status_change_failed");
    }
};

module.exports.order_details_get = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findDetailsById(orderId);
        if (!order) { return res.status(404).send("Заказ не найден"); }
        res.render('pages/order_details', { title: `Детали заказа №${order.id}`, layout: adminLayout, order, backUrl: '/admin/orders' });
    } catch (err) {
        console.error("Ошибка на странице деталей заказа (админ):", err);
        res.status(500).send("Ошибка сервера");
    }
};


// --- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ---
module.exports.users_list_get = async (req, res) => {
    try {
        const users = await User.getAllWithRoles();
        const superAdminId = await User.getSuperAdminId();
        res.render("pages/admin/users", { title: "Управление пользователями", users, superAdminId, currentAdminId: req.user.id, layout: adminLayout, });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.user_details_get = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const profile = await User.findByIdWithDetails(userId);
        if (!profile) return res.redirect("/admin/users");
        const [books] = await db.query("SELECT id, title, price FROM books ORDER BY title");
        const superAdminId = await User.getSuperAdminId();
        res.render("pages/admin/user_details", { title: `Профиль: ${profile.full_name}`, profile, books, superAdminId, currentAdminId: req.user.id, layout: adminLayout, });
    } catch (err) {
        console.error("Ошибка на странице деталей пользователя:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.user_toggle_block_post = async (req, res) => {
    try {
        await User.toggleBlock(req.params.id);
        res.redirect(`/admin/user/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.user_change_role_post = async (req, res) => {
    const userIdToChange = req.params.id;
    const { new_role_id } = req.body;
    const currentAdminId = req.user.id;
    try {
        const userToChange = await User.findById(userIdToChange);
        if (!userToChange) return res.status(404).send("Пользователь не найден");
        if (String(currentAdminId) === String(userIdToChange) && userToChange.role_id == 1 && new_role_id == 2) {
            await User.changeRole(userIdToChange, new_role_id);
            res.cookie("jwt", "", { maxAge: 1 });
            return res.redirect("/");
        }
        const superAdminId = await User.getSuperAdminId();
        if (userToChange.role_id == 1 && new_role_id == 2 && currentAdminId !== superAdminId) {
            return res.status(403).send("Только супер-администратор может понижать других администраторов.");
        }
        await User.changeRole(userIdToChange, new_role_id);
        res.redirect(`/admin/user/${userIdToChange}`);
    } catch (err) {
        console.error("Ошибка смены роли:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.user_add_offer_post = async (req, res) => {
    const userId = req.params.id;
    const { book_id, offer_price, expires_at } = req.body;
    try {
        await SpecialOffer.create({ userId, bookId: book_id, offerPrice: offer_price, expiresAt: expires_at, });
        const book = await Book.findById(book_id, false);
        await Notification.create({ userId, type: "special_offer", message: `Вам поступило персональное предложение на книгу "${book.title}"!`, link: "/notifications", });
        res.redirect(`/admin/user/${userId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

// --- AJAX ХЕЛПЕРЫ ---
module.exports.author_create_ajax = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Имя не может быть пустым" });
        const newAuthor = await Book.createAuthor(name);
        res.status(201).json(newAuthor);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

module.exports.publisher_create_ajax = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Имя не может быть пустым" });
        const newPublisher = await Publisher.create(name);
        res.status(201).json(newPublisher);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

module.exports.category_create_ajax = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Название не может быть пустым" });
        const newCategory = await Book.createCategory(name);
        res.status(201).json(newCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};