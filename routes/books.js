const express = require("express");
const router = express.Router();
const container = require("../ioc-container"); // Подключаем IoC-контейнер
const BooksRepository = require("../repositories/BooksRepository");

// Главная страница с выводом списка книг
router.get("/", async (req, res) => {
  try {
    const repo = container.get(BooksRepository); // Получаем BooksRepository из контейнера
    const books = await repo.getBooks(); // Получаем список книг

    // Рендерим страницу с книгами, передавая данные
    res.render("index", { title: "Список книг", books });
  } catch (err) {
    console.error("Ошибка получения данных:", err);
    res.render("errors/5XX", { title: "Ошибка", message: "Ошибка загрузки книг" });
  }
});

// Страница для создания новой книги
router.get("/create", (req, res) => {
  res.render("books/create", { title: "Создать книгу" });
});

// Обработчик создания новой книги
router.post("/create", async (req, res) => {
  try {
    const repo = container.get(BooksRepository);
    await repo.createBook(req.body); // Создаём новую книгу через репозиторий
    res.redirect("/books");
  } catch (err) {
    console.error("Ошибка при создании книги:", err);
    res.render("errors/5XX", { title: "Ошибка", message: "Не удалось создать книгу" });
  }
});

// Страница для просмотра книги по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const repo = container.get(BooksRepository);
    const book = await repo.getBook(id); // Получаем книгу по ID

    // Увеличение счётчика просмотров через микросервис
    await axios.post(`http://counter-service:4000/counter/${book._id}/incr`);

    // Получение значения счётчика просмотров книги
    const counterResponse = await axios.get(`http://counter-service:4000/counter/${book._id}`);
    const counter = counterResponse.data.count;

    // Отображаем страницу с книгой и значением счётчика просмотров
    res.render("books/view", { book, counter });
  } catch (err) {
    console.error("Ошибка получения книги или счётчика:", err);
    res.render("errors/404", { title: "Книга не найдена" });
  }
});

// Страница для редактирования книги
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const repo = container.get(BooksRepository);
    const book = await repo.getBook(id); // Получаем книгу для редактирования

    res.render("books/update", { title: "Редактировать книгу", book });
  } catch (err) {
    console.error("Ошибка при получении книги:", err);
    res.render("errors/404", { title: "Книга не найдена" });
  }
});

// Обработчик редактирования книги
router.post("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const repo = container.get(BooksRepository);
    await repo.updateBook(id, req.body); // Обновляем данные книги
    res.redirect(`/books/${id}`);
  } catch (err) {
    console.error("Ошибка при обновлении книги:", err);
    res.render("errors/500", { title: "Ошибка", message: "Не удалось обновить книгу" });
  }
});

module.exports = router;
