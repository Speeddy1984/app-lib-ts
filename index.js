const express = require('express');
const err404 = require('./middleware/err404')
const err5XX = require('./middleware/err5XX')
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");

// Подключение PassportJS
require("./config/passport")(passport);

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

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/library';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Успешно подключено к MongoDB'))
.catch((err) => console.error('Ошибка подключения к MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const booksRouter = require('./routes/books');
const apiBooksRouter = require('./api/apiBooks');  // Роуты для API

const userRoutes = require("./routes/user");
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
app.use('/api/books', apiBooksRouter);

// new! Роуты для многостраничного интерфейса
app.use('/books', booksRouter);

// Роуты для обработки ошибок
app.use(err404);
app.use(err5XX);

server.listen(3000, () => {
  console.log(`Сервер запущен на порту 3000`);
});