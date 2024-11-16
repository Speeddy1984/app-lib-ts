module.exports = (err, req, res, next) => {
  res.render("errors/5XX", {
    title: "Внутренняя ошибка сервера",
  });
};
