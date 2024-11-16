const express = require("express");
const router = express.Router();
const axios = require("axios"); // Для отправки запросов к микросервису счётчика

// Главная страница с выводом списка книг
router.get("/", async (req, res) => {
  try {
    // Получаем данные из apiBooks
    const response = await axios.get('http://localhost:3000/api/books');
    const books = response.data;

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
    // Отправляем данные формы в apiBooks для создания новой книги
    await axios.post("http://localhost:3000/api/books", req.body);
    res.redirect("/books");
  } catch (err) {
    console.error("Ошибка при создании книги через API:", err);
    res.render("errors/5XX", { title: "Ошибка", message: "Не удалось создать книгу" });
  }
});

// Страница для просмотра книги по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Запрос к apiBooks для получения книги по ID
    const bookResponse = await axios.get(`http://localhost:3000/api/books/${id}`);
    const book = bookResponse.data;

    // Увеличение счётчика просмотров через микросервис
    await axios.post(`http://counter-service:4000/counter/${book._id}/incr`);

    // Получение значения счётчика просмотров книги
    const counterResponse = await axios.get(`http://counter-service:4000/counter/${book._id}`);
    const counter = counterResponse.data.count;

    // Отображаем страницу с книгой и значением счётчика просмотров
    res.render("books/view", { book, counter });
  } catch (err) {
    console.error("Ошибка получения книги через API или счётчика:", err);
    res.render("errors/404", { title: "Книга не найдена" });
  }
});

// Страница для редактирования книги
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    // Получаем книгу из apiBooks для отображения в форме
    const response = await axios.get(`http://localhost:3000/api/books/${id}`);
    const book = response.data;

    res.render("books/update", { title: "Редактировать книгу", book });
  } catch (err) {
    console.error("Ошибка при получении книги через API:", err);
    res.render("errors/404", { title: "Книга не найдена" });
  }
});

// Обработчик редактирования книги
router.post("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    // Отправляем обновлённые данные книги в apiBooks
    await axios.put(`http://localhost:3000/api/books/${id}`, req.body);
    res.redirect(`/books/${id}`);
  } catch (err) {
    console.error("Ошибка при обновлении книги через API:", err);
    res.render("errors/500", { title: "Ошибка", message: "Не удалось обновить книгу" });
  }
});

module.exports = router;
