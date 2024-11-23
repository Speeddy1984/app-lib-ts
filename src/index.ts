import express, { Request, Response, NextFunction } from "express";
import http from "http";
import socketIo, { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";

import err404 from "./middleware/err404";
import err5XX from "./middleware/err5XX";
import booksRouter from "./routes/books";
import apiBooksRouter from "./api/apiBooks";
import userRoutes from "./routes/user";

const app = express();
const server = http.createServer(app);
const io: SocketIOServer = new socketIo.Server(server);

require("./config/passport")(passport); // Подключение PassportJS

// Настройка сессий
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/library";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Успешно подключено к MongoDB"))
  .catch((err) => console.error("Ошибка подключения к MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/api/user", userRoutes);

io.on("connection", (socket) => {
  console.log("Новый клиент подключился");

  socket.on("new_comment", (data) => {
    console.log("Комментарий получен:", data);
    io.emit("broadcast_comment", data);
  });

  socket.on("disconnect", () => {
    console.log("Клиент отключился");
  });
});

// Роуты для API
app.use("/api/books", apiBooksRouter);

// new! Роуты для многостраничного интерфейса
app.use("/books", booksRouter);

// Роуты для обработки ошибок
app.use(err404);
app.use(err5XX);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
