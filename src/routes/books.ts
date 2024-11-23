import express, { Request, Response } from "express";
import axios from "axios";
import container from "../ioc/container";
import BooksRepository from "../repositories/BooksRepository";

const router = express.Router();

// Главная страница с выводом списка книг
router.get("/", async (req: Request, res: Response) => {
  try {
    const repo = container.get(BooksRepository);
    const books = await repo.getBooks();
    res.render("index", { title: "Список книг", books });
  } catch (err) {
    console.error("Ошибка получения данных:", err);
    res.render("errors/5XX", {
      title: "Ошибка",
      message: "Ошибка загрузки книг",
    });
  }
});

// Страница для создания новой книги
router.get("/create", (req: Request, res: Response) => {
  res.render("books/create", { title: "Создать книгу" });
});

// Обработчик создания новой книги
router.post("/create", async (req: Request, res: Response) => {
  try {
    const repo = container.get(BooksRepository);
    await repo.createBook(req.body);
    res.redirect("/books");
  } catch (err) {
    console.error("Ошибка при создании книги:", err);
    res.render("errors/5XX", {
      title: "Ошибка",
      message: "Не удалось создать книгу",
    });
  }
});

// Просмотр книги по ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const repo = container.get(BooksRepository);
    const book = await repo.getBook(id);
    const counterResponse = await axios.get(
      `http://counter-service:4000/counter/${book._id}`
    );
    const counter = counterResponse.data.count;

    res.render("books/view", { book, counter });
  } catch (err) {
    console.error("Ошибка:", err);
    res.render("errors/404", { title: "Книга не найдена" });
  }
});

export default router;
