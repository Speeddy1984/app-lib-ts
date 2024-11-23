const express = require("express");
const redis = require("redis");
const app = express();
const PORT = process.env.PORT || 4000;

// Создаем Redis-клиент
const client = redis.createClient({
  url: "redis://redis:6379",
});

// Обработка подключения к Redis
async function connectRedis() {
  try {
    await client.connect();
    console.log("Подключено к Redis");
  } catch (err) {
    console.error("Ошибка подключения к Redis:", err);
  }
}

connectRedis();

app.use(express.json());

// Увеличение счётчика
app.post("/counter/:bookId/incr", async (req, res) => {
  const { bookId } = req.params;

  try {
    const count = await client.incr(`counter:${bookId}`);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка увеличения счетчика");
  }
});

// Получение значения счётчика
app.get("/counter/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const count = await client.get(`counter:${bookId}`);
    res.json({ count: count || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка получения счетчика");
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер счетчика запущен на порту: ${PORT}`);
});
