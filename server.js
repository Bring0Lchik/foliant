require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressEjsLayouts = require('express-ejs-layouts');

// Модели
const Notification = require('./models/notificationModel');
const Cart = require('./models/cartModel');
const db = require('./config/db'); 

// Роуты
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const adminRoutes = require('./routes/admin');
const { checkUser } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.disable('view cache');
}

// Настройка движка шаблонов
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Объединенное глобальное middleware
app.use(async (req, res, next) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
        res.locals.allCategories = categories;

        checkUser(req, res, async () => {
            if (res.locals.user) {
                const unreadCount = await Notification.getUnreadCount(res.locals.user.id);
                res.locals.unreadNotifications = unreadCount;
                const cartCount = await Cart.getItemsCount(res.locals.user.id);
                res.locals.cartItemCount = cartCount;
            }
            next();
        });
    } catch (err) {
        console.error("Критическая ошибка в глобальном middleware:", err);
        next(err);
    }
});

// Роуты
app.use(authRoutes);
app.use(mainRoutes);
app.use('/admin', adminRoutes);

// Обработка 404
app.use((req, res) => {
    // Явно передаем ключ на страницу ошибки
    res.status(404).render('pages/404', { 
        title: 'Страница не найдена',
        yandexApiKey: process.env.YANDEX_MAPS_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`Сервер "Фолиант" запущен на http://localhost:${PORT}`);
});