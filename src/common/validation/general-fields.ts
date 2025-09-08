import joi from "joi"

import { isValidMongoId, optionalMongoId } from "./is-valid"

export const file = {
  fieldname: joi.string(),
  originalname: joi.string(),
  encoding: joi.string(),
  mimetype: joi.string(),
  destination: joi.string(),
  filename: joi.string(),
  path: joi.string(),
  size: joi.number(),
}

export const generalFields = {
  mongoId: joi.string().custom(isValidMongoId),
  optionalMongoId: joi.string().custom(optionalMongoId),

  file: joi.object<Express.Multer.File>().keys(file),

  files: joi.array().items(file).min(1).max(10),

  bio: joi.string().trim().max(700),
  username: joi.string().trim().min(2).max(16),
  email: joi.string().email().trim().lowercase().messages({
    "string.empty": "email can't be empty",
    "string.email": "Invalid email",
  }),
  password: joi.string().trim().messages({
    "string.empty": "password can't be empty",
  }),
  phone: joi.string().max(11),
  birthDate: joi.date().less("now").messages({
    "string.empty": "birthDate can't be empty",
    "date.base": "enter a valid birthDate",
  }),
  otpCode: joi.string().length(4).messages({
    "string.empty": "otpCode can't be empty",
  }),

  content: joi.string().trim().messages({
    "string.empty": "content can't be empty",
  }),
  body: joi.string().trim().messages({
    "string.empty": "body can't be empty",
  }),
}
