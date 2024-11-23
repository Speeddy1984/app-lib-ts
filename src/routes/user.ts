import { Request, Response, Router, NextFunction } from "express";
import passport from "passport";
import User from "../models/user";
import IUser from "../interfaces/IUser";

const router = Router();

// Страница логина
router.get("/login", (req: Request, res: Response) => {
  res.render("user/login", { title: "Вход в профиль" });
});

// Страница регистрации
router.get("/signup", (req: Request, res: Response) => {
  res.render("user/signup", { title: "Регистрация" });
});

// Профиль пользователя
router.get("/me", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/api/user/login");
  }
  // Если пользователь аутентифицирован, отображаем профиль
  res.render("user/profile", { title: "Ваш профиль", user: req.user });
});

// POST запрос для регистрации
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name }: Partial<IUser> = req.body;

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
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: IUser, info: { message?: string }) => {
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
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/api/user/login");
  });
});

export default router;
