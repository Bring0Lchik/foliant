const { format, isPast } = require('date-fns');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Notification = require('../models/notificationModel');
const SpecialOffer = require('../models/specialOfferModel');
const db = require('../config/db');

// Хелпер, чтобы не повторять код. Он добавляет ключ API в данные для рендера.
const renderWithApiKey = (res, page, data) => {
    res.render(page, {
        ...data,
        yandexApiKey: process.env.YANDEX_MAPS_API_KEY
    });
};

module.exports.homepage_get = async (req, res) => {
    try {
        const books = await Book.findLatest(8);
        renderWithApiKey(res, 'pages/index', { title: 'Главная', books });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.catalog_get = async (req, res) => {
    try {
        const filters = req.query;
        const books = await Book.findAll(filters);
        const [authors] = await db.query('SELECT id, name FROM authors ORDER BY name');
        const [publishers] = await db.query('SELECT id, name FROM publishers ORDER BY name');
        renderWithApiKey(res, 'pages/catalog', { 
            title: 'Каталог', 
            books, 
            filters, 
            authors, 
            publishers
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.book_random_get = async (req, res) => {
    try {
        const book = await Book.findRandom();
        if (!book || !book.id) {
            return res.redirect('/catalog');
        }
        res.redirect(`/book/${book.id}`);
    } catch (err) {
        console.error('Ошибка при поиске случайной книги:', err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.book_get = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).render('pages/404', { title: 'Книга не найдена', yandexApiKey: process.env.YANDEX_MAPS_API_KEY });
        }
        const reviews = await Book.getReviews(req.params.id);
        renderWithApiKey(res, 'pages/book', { title: book.title, book, reviews });
    } catch (err) {
        console.error("ОШИБКА В book_get:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.profile_get = async (req, res) => {
    try {
        const profile = await User.findById(req.user.id);
        const orders = await Order.findByUser(req.user.id);
        renderWithApiKey(res, 'pages/profile', { 
            title: 'Личный кабинет', 
            profile, 
            orders 
        });
    } catch (err) {
        console.error("Ошибка на странице профиля:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.profile_post = async (req, res) => {
    const { full_name, delivery_address } = req.body;
    try {
        await User.updateProfile(req.user.id, full_name, delivery_address);
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.cart_get = async (req, res) => {
    try {
        const items = await Cart.getItems(req.user.id);
        const total = items.reduce((sum, item) => sum + (Number(item.effective_price) * item.quantity), 0);
        renderWithApiKey(res, 'pages/cart', { title: 'Корзина', cart: items, total });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.cart_add_post = async (req, res) => {
    try {
        await Cart.addItem(req.user.id, req.params.id, 1);
        res.redirect(req.get('referer') || '/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.cart_update_post = async (req, res) => {
    const { book_id, quantity } = req.body;
    try {
        await Cart.updateItem(req.user.id, parseInt(book_id, 10), parseInt(quantity, 10));
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
            return res.status(200).json({ success: true });
        }
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.checkout_post = async (req, res) => {
    let { selected_items } = req.body;
    if (!selected_items) {
        return res.redirect('/cart');
    }
    if (!Array.isArray(selected_items)) {
        selected_items = [selected_items];
    }
    const selectedIds = selected_items.map(id => parseInt(id, 10));

    try {
        const items = await Cart.getItems(req.user.id, selectedIds);
        if (items.length === 0) {
            return res.redirect('/cart');
        }
        const total = items.reduce((sum, item) => sum + (Number(item.effective_price) * item.quantity), 0);
        
        renderWithApiKey(res, 'pages/checkout', {
            title: 'Оформление заказа',
            items,
            total,
            user: res.locals.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.order_post = async (req, res) => {
    const { selected_items, delivery_address } = req.body;
    if (!selected_items || !delivery_address) {
        return res.redirect('/cart?error=invalid_checkout_data');
    }
    const selectedIds = Array.isArray(selected_items) ? selected_items.map(id => parseInt(id, 10)) : [parseInt(selected_items, 10)];

    try {
        await User.updateProfile(req.user.id, req.user.full_name, delivery_address);
        const cartItems = await Cart.getItems(req.user.id, selectedIds);
        if (cartItems.length === 0) {
            return res.redirect('/cart?error=no_items_valid');
        }
        const orderId = await Order.create(req.user.id, delivery_address, cartItems);
        await Cart.removeItems(req.user.id, selectedIds);

        await Notification.create({
            userId: req.user.id,
            type: 'order_status',
            message: `Ваш заказ №${orderId} успешно создан и принят в обработку.`,
            link: '/profile'
        });
        res.redirect('/profile');
    } catch (err) {
        console.error('Ошибка оформления заказа:', err);
        res.status(500).send(`Ошибка оформления заказа: ${err.message}`);
    }
};

module.exports.review_post = async (req, res) => {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    try {
        await Book.addReview(bookId, req.user.id, rating, comment);
        res.redirect(`/book/${bookId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка добавления отзыва");
    }
};

module.exports.notifications_get = async (req, res) => {
    try {
        const [notifications, specialOffers] = await Promise.all([
            Notification.findByUser(req.user.id),
            SpecialOffer.findActiveForUser(req.user.id)
        ]);
        const formattedOffers = specialOffers.map(offer => ({
            ...offer,
            expires_at_formatted: format(new Date(offer.expires_at), 'dd.MM.yyyy HH:mm'),
            is_expired: isPast(new Date(offer.expires_at))
        }));
        renderWithApiKey(res, 'pages/notifications', { 
            title: 'Уведомления', 
            notifications,
            specialOffers: formattedOffers
        });
    } catch (err) {
        console.error("Ошибка на странице уведомлений:", err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.notifications_mark_read_post = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user.id);
        res.redirect('/notifications');
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};

module.exports.offer_accept_post = async (req, res) => {
    try {
        const offer = await SpecialOffer.findById(req.params.id);
        if (!offer || offer.user_id !== req.user.id || isPast(new Date(offer.expires_at)) || offer.is_accepted) {
            return res.status(403).send("Предложение недействительно");
        }
        await Cart.addItem(req.user.id, offer.book_id, 1, offer.offer_price);
        await SpecialOffer.accept(offer.id);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
};