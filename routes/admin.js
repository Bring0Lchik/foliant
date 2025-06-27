const { Router } = require('express');
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

const router = Router();

// Дэшборд и Аналитика
router.get('/', requireAdmin, adminController.dashboard_get);
router.get('/analytics', requireAdmin, adminController.analytics_get);
router.get('/analytics/export/pdf', requireAdmin, adminController.analytics_get); // Обратите внимание, что этот роут тоже здесь

// Управление книгами
router.get('/books', requireAdmin, adminController.books_list_get);
router.get('/books/add', requireAdmin, adminController.book_add_get);
router.post('/books/add', requireAdmin, upload.single('cover_image'), adminController.book_add_post);
router.get('/books/edit/:id', requireAdmin, adminController.book_edit_get);
router.post('/books/edit/:id', requireAdmin, upload.single('cover_image'), adminController.book_edit_post);
router.post('/books/delete/:id', requireAdmin, adminController.book_delete_post);

// --- ИСПРАВЛЕНИЕ ЗДЕСЬ: УПРАВЛЕНИЕ ИЗДАТЕЛЬСТВАМИ ---
router.get('/publishers', requireAdmin, adminController.getPublishersList);
router.get('/publishers/add', requireAdmin, adminController.getPublisherForm);
router.post('/publishers/add', requireAdmin, adminController.postCreatePublisher);
router.get('/publishers/:id', requireAdmin, adminController.getPublisherDetails);
router.get('/publishers/edit/:id', requireAdmin, adminController.getPublisherForm);
router.post('/publishers/edit/:id', requireAdmin, adminController.postUpdatePublisher);
router.post('/publishers/delete/:id', requireAdmin, adminController.postDeletePublisher);
// --- КОНЕЦ ИСПРАВЛЕНИЯ ---

// Управление заказами
router.get('/orders', requireAdmin, adminController.orders_list_get);
router.post('/orders/status', requireAdmin, adminController.order_status_post);
router.get('/order/:id', requireAdmin, adminController.order_details_get);

// Управление пользователями
router.get('/users', requireAdmin, adminController.users_list_get);
router.get('/user/:id', requireAdmin, adminController.user_details_get);
router.post('/user/:id/toggle-block', requireAdmin, adminController.user_toggle_block_post);
router.post('/user/:id/change-role', requireAdmin, adminController.user_change_role_post);
router.post('/user/:id/add-offer', requireAdmin, adminController.user_add_offer_post);

// AJAX-хелперы
router.post('/authors/create-ajax', requireAdmin, adminController.author_create_ajax);
router.post('/publishers/create-ajax', requireAdmin, adminController.publisher_create_ajax);
router.post('/categories/create-ajax', requireAdmin, adminController.category_create_ajax);

module.exports = router;