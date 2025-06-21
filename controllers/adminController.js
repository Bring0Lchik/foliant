const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const SpecialOffer = require("../models/specialOfferModel");
const Publisher = require("../models/publisherModel");
const papaparse = require("papaparse");
const db = require("../config/db");

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
    const { startDate, endDate, reportType } = req.query;
    const filters = { startDate, endDate };

    if (reportType) {
      let data, fields, filename;
      switch (reportType) {
        case "sales":
          const salesData = await Order.getDetailedSalesReport(filters);
          data = [];
          salesData.forEach((order) =>
            order.items.forEach((item) =>
              data.push({
                order_id: order.id,
                order_date: order.created_at,
                client_name: order.client_name,
                book_title: item.title,
                quantity: item.quantity,
                price: item.price_per_item,
              })
            )
          );
          fields = [
            "order_id",
            "order_date",
            "client_name",
            "book_title",
            "quantity",
            "price",
          ];
          filename = "sales_report.csv";
          break;
        case "stock":
          data = await Book.getStockReport();
          fields = ["id", "title", "stock_quantity", "price"];
          filename = "stock_report.csv";
          break;
        case "authors":
          data = await Book.getAuthorPopularityReport(filters);
          fields = ["name", "items_sold", "total_revenue"];
          filename = "authors_report.csv";
          break;
        case "publishers":
          data = await Publisher.getPopularityReport(filters);
          fields = ["name", "items_sold", "total_revenue"];
          filename = "publishers_report.csv";
          break;
        case "clients":
          data = await User.getActivityReport(filters);
          fields = [
            "full_name",
            "email",
            "order_count",
            "total_spent",
            "last_order_date",
            "review_count",
          ];
          filename = "clients_report.csv";
          break;
        case "reviews":
          [data] = await db.query(
            `SELECT r.id, r.created_at, u.full_name, b.title, r.rating, r.comment FROM reviews r JOIN users u ON r.user_id = u.id JOIN books b ON r.book_id = b.id ORDER BY r.created_at DESC`
          );
          fields = [
            "id",
            "created_at",
            "full_name",
            "title",
            "rating",
            "comment",
          ];
          filename = "reviews_report.csv";
          break;
        default:
          return res.status(400).send("Неизвестный тип отчета");
      }
      const csv = papaparse.unparse({ fields, data });
      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment(filename);
      return res.send(Buffer.from(csv, "utf8"));
    }

    const [
      salesReport,
      stockReport,
      authorReport,
      publisherReport,
      clientReport,
      reviewReport,
      salesByMonth,
      topClients,
      salesByCategory,
      topSellingBooks,
    ] = await Promise.all([
      Order.getDetailedSalesReport(filters),
      Book.getStockReport(),
      Book.getAuthorPopularityReport(filters),
      Publisher.getPopularityReport(filters),
      User.getActivityReport(filters),
      db
        .query(
          `SELECT r.id, b.title, u.full_name, r.rating FROM reviews r JOIN books b ON r.book_id=b.id JOIN users u ON r.user_id=u.id ORDER BY r.created_at DESC LIMIT 10`
        )
        .then((res) => res[0]),
      Order.getSalesByMonth(filters),
      User.getTopClients(filters),
      Book.getSalesByCategory(filters),
      Book.getTopSelling(filters),
    ]);

    res.render("pages/admin/analytics", {
      title: "Аналитика",
      salesReport,
      stockReport,
      authorReport,
      publisherReport,
      clientReport,
      reviewReport,
      salesByMonth,
      topClients,
      salesByCategory,
      topSellingBooks,
      filters,
      layout: adminLayout,
    });
  } catch (err) {
    console.error("ОШИБКА НА СТРАНИЦЕ АНАЛИТИКИ:", err);
    res.status(500).send("Ошибка сервера");
  }
};

// --- Остальные методы без изменений ---
module.exports.books_list_get = async (req, res) => {
  /*...*/
};
// ... и так далее для всех остальных методов ...
// --- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ---
module.exports.users_list_get = async (req, res) => {
  try {
    const users = await User.getAllWithRoles();
    const superAdminId = await User.getSuperAdminId();
    res.render("pages/admin/users", {
      title: "Управление пользователями",
      users,
      superAdminId,
      currentAdminId: req.user.id,
      layout: adminLayout,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
};

module.exports.user_details_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.redirect("/admin/users");
    const books = await Book.findAll({});
    const superAdminId = await User.getSuperAdminId();
    const userWithRole = await User.getAllWithRoles().then((users) =>
      users.find((u) => u.id === user.id)
    );
    res.render("pages/admin/user_details", {
      title: `Профиль: ${user.full_name}`,
      profile: {
        ...user,
        role_name: userWithRole ? userWithRole.role_name : "client",
      },
      books,
      superAdminId,
      currentAdminId: req.user.id,
      layout: adminLayout,
    });
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
    if (
      String(currentAdminId) === String(userIdToChange) &&
      userToChange.role_id == 1 &&
      new_role_id == 2
    ) {
      await User.changeRole(userIdToChange, new_role_id);
      res.cookie("jwt", "", { maxAge: 1 });
      return res.redirect("/");
    }
    const superAdminId = await User.getSuperAdminId();
    if (
      userToChange.role_id == 1 &&
      new_role_id == 2 &&
      currentAdminId !== superAdminId
    ) {
      return res
        .status(403)
        .send(
          "Только супер-администратор может понижать других администраторов."
        );
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
    await SpecialOffer.create({
      userId,
      bookId: book_id,
      offerPrice: offer_price,
      expiresAt: expires_at,
    });
    const book = await Book.findById(book_id, false);
    await Notification.create({
      userId,
      type: "special_offer",
      message: `Вам поступило персональное предложение на книгу "${book.title}"!`,
      link: "/notifications",
    });
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
    if (!name)
      return res.status(400).json({ error: "Имя не может быть пустым" });
    const newAuthor = await Book.createAuthor(name);
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports.publisher_create_ajax = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ error: "Имя не может быть пустым" });
    const newPublisher = await Book.createPublisher(name);
    res.status(201).json(newPublisher);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
