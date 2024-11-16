const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user"); // Модель пользователя

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      // Поиск пользователя по email
      try {
        console.log("Attempting to authenticate user:", email); // Лог перед поиском пользователя
        const user = await User.findOne({ email });
  
        if (!user) {
          console.log("User not found");
          return done(null, false, { message: "No user with that email" });
        }
          
        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          console.log("Password match, authenticating user");
          return done(null, user);
        } else {
          console.log("Password mismatch");
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        return done(err);
      }
    })
  );

  // Сериализация и десериализация пользователя
  passport.serializeUser((user, done) => {
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
};
