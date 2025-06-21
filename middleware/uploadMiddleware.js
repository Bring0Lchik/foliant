// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Настройка хранилища для файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Указываем папку для загрузки изображений
        cb(null, 'public/images/uploads/');
    },
    filename: function (req, file, cb) {
        // Генерируем уникальное имя файла, чтобы избежать конфликтов
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Фильтр для проверки типа файла (только изображения)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        cb(new Error('Неверный тип файла, разрешены только изображения!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    }
});

module.exports = upload;