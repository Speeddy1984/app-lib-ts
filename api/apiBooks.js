const express = require("express");
// const { v4: uuidv4 } = require("uuid");
const router = express.Router();
// const upload = require("../middleware/uploadMiddleware");
const Book = require("../models/book");

// Получить список всех книг

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить книгу по ID

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Книга не найдена" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать книгу

router.post("/", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Редактировать книгу по ID

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: "Книга не найдена" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить книгу по ID

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (deletedBook) {
      res.json({ message: "Книга удалена" });
    } else {
      res.status(404).json({ message: "Книга не найдена" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
