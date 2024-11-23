import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user";

export default function configurePassport(passport: PassportStatic) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      // Поиск пользователя по email
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "No user with that email" });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  
  // Сериализация и десериализация пользователя
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
