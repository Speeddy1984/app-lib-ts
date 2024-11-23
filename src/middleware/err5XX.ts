import { Request, Response, NextFunction } from "express";

const err5XX = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.render("errors/5XX", {
    title: "Внутренняя ошибка сервера",
  });
};

export default err5XX;
