const multer = require('multer');
const path = require('path');

// Определяем место хранения файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Файлы будут сохраняться в папку public/uploads/covers
    cb(null, 'public/uploads/covers');
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла, чтобы избежать конфликтов
    // Имя будет: cover-1678886400000.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтр файлов, чтобы принимать только изображения
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый формат файла! Только JPEG, PNG, WEBP.'), false);
  }
};

// Создаем и экспортируем настроенный multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB
  }
});

module.exports = upload;