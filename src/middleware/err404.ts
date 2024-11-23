import { Request, Response } from "express";

const err404 = (req: Request, res: Response): void => {
  res.render("errors/404", {
    title: "404",
  });
};

export default err404;
