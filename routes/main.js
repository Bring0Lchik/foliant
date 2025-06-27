const { Router } = require('express');
const mainController = require('../controllers/mainController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

// Основные страницы
router.get('/', mainController.homepage_get);
router.get('/catalog', mainController.catalog_get);
router.get('/book/random', mainController.book_random_get);
router.get('/book/:id', mainController.book_get);

// Корзина
router.get('/cart', requireAuth, mainController.cart_get);
router.post('/cart/add/:id', requireAuth, mainController.cart_add_post);
router.post('/cart/update', requireAuth, mainController.cart_update_post);

// Оформление заказа (новый, двухэтапный процесс)
router.post('/checkout', requireAuth, mainController.checkout_post);
router.post('/order', requireAuth, mainController.order_post);

// Профиль, отзывы, уведомления
router.get('/profile', requireAuth, mainController.profile_get);
router.post('/profile', requireAuth, mainController.profile_post);
router.post('/review/:bookId', requireAuth, mainController.review_post);
router.get('/notifications', requireAuth, mainController.notifications_get);
router.post('/notifications/mark-read', requireAuth, mainController.notifications_mark_read_post);
router.post('/offer/:id/accept', requireAuth, mainController.offer_accept_post);
router.get('/order/:id', requireAuth, mainController.order_details_get);

module.exports = router;