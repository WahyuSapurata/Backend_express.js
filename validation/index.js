import { check, validationResult } from "express-validator";

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      status: false,
      message: errors.array(),
    });
  }
  next();
};

export const saveValidation = [
  check("name", "name tidak boleh kosong").notEmpty(),
  check("email", "email tidak boleh kosong")
    .notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage("email harus bertanda @"),
  check("gender", "gender tidak boleh kosong").notEmpty(),
];
