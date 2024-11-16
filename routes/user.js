const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Страница логина
router.get("/login", (req, res) => {
  res.render("user/login", { title: "Вход в профиль" });
});

// Страница регистрации
router.get("/signup", (req, res) => {
  res.render("user/signup", { title: "Регистрация" });
});

// Профиль пользователя
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/api/user/login");
  }
  // Если пользователь аутентифицирован, отображаем профиль
  res.render("user/profile", { title: "Ваш профиль", user: req.user });
});

// POST запрос для регистрации
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Проверка, существует ли пользователь с таким email
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Такой пользователь уже существует" });
    }

    // Создание нового пользователя
    user = new User({ email, password, name });
    await user.save();

    res.redirect("/api/user/login");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// POST запрос для логина
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).send("Внутренняя ошибка сервера");
    }
    if (!user) {
      return res.status(400).send(info.message || "Ошибка аутентификации");
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).send("Внутренняя ошибка сервера");
      }
      return res.redirect("/api/user/me");
    });
  })(req, res, next);
});

// Запрос Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/api/user/login");
  });
});

module.exports = router;
