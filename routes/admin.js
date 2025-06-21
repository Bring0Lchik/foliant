const { Router } = require('express');
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

const router = Router();

router.use(requireAdmin);

router.get('/', adminController.dashboard_get);
router.get('/analytics', adminController.analytics_get);

router.get('/books', adminController.books_list_get);
router.get('/books/add', adminController.book_add_get);
router.post('/books/add', upload.single('cover_image'), adminController.book_add_post);
router.get('/books/edit/:id', adminController.book_edit_get);
router.post('/books/edit/:id', upload.single('cover_image'), adminController.book_edit_post);
router.post('/books/delete/:id', adminController.book_delete_post);

router.get('/orders', adminController.orders_list_get);
router.post('/orders/status', adminController.order_status_post);

router.get('/users', adminController.users_list_get);
router.get('/user/:id', adminController.user_details_get); // Этот роут теперь будет работать
router.post('/user/:id/toggle-block', adminController.user_toggle_block_post);
router.post('/user/:id/change-role', adminController.user_change_role_post);
router.post('/user/:id/add-offer', adminController.user_add_offer_post);

router.post('/authors/create-ajax', adminController.author_create_ajax);
router.post('/publishers/create-ajax', adminController.publisher_create_ajax);

module.exports = router;