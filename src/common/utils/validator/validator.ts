import joi, { CustomHelpers, CustomValidator, ErrorReport } from "joi"
import { Types } from "mongoose"

export abstract class Validator {
  protected static readonly isValidMongoId: CustomValidator = (
    v: string,
    helpers: CustomHelpers,
  ): true | ErrorReport => {
    return Types.ObjectId.isValid(v)
      ? true
      : helpers.error("string.base", { key: "id" }, { path: ["id"] })
  }

  protected static readonly optionalMongoId: CustomValidator = (
    v: string,
    helpers: CustomHelpers,
  ) => {
    return v ? this.isValidMongoId(v, helpers) : true
  }

  protected static readonly isValidNumericString: (
    path: string,
  ) => CustomValidator = (
    path: string,
  ): ((v: string, helpers: CustomHelpers) => true | ErrorReport) => {
    return (v: string, helpers: CustomHelpers): true | ErrorReport => {
      return isNaN(Number(v))
        ? helpers.error("string.base", { key: path }, { path: [path] })
        : true
    }
  }

  protected static validationMessage({
    fieldName,
    minL,
    maxL,
  }: {
    fieldName: string
    minL?: number
    maxL?: number
  }) {
    return {
      "any.required": `['${fieldName}'] is required`,
      "any.only": `${fieldName} are Not Matched`,

      "string.empty": `['${fieldName} ] can't be empty`,
      "string.min": `['${fieldName} ] can't be less then '${minL}'`,
      "string.max": `['${fieldName} ] can't be more then '${maxL}'`,
      "string.length": `['${fieldName} ] length must be '${maxL}' characters long'`,

      "string.email": "Invalid E-mail",
      "date.base": "Enter a Valid birthDate Formate (MM-DD-YYYY)",
    }
  }

  protected static readonly file = {
    fieldname: joi.string(),
    originalname: joi.string(),
    encoding: joi.string(),
    mimetype: joi.string(),
    destination: joi.string(),
    filename: joi.string(),
    path: joi.string(),
    size: joi.number(),
  }

  protected static readonly minPasswordLength = 8
  protected static readonly maxPasswordLength = 24
  protected static readonly maxPhoneLength = 11

  protected static readonly generalFields = {
    mongoId: joi.string().custom(this.isValidMongoId),
    optionalMongoId: joi.string().custom(this.optionalMongoId),

    file: joi.object<Express.Multer.File>().keys(this.file),

    files: joi.array().items(this.file).min(1).max(10),

    bio: joi.string().trim().max(700),

    username: joi
      .string()
      .trim()
      .min(2)
      .max(16)
      .messages({
        "any.required": this.validationMessage({ fieldName: "username" })[
          "any.required"
        ],
        "string.empty": this.validationMessage({ fieldName: "username" })[
          "any.required"
        ],
      }),

    email: joi
      .string()
      .email()
      .trim()
      .lowercase()
      .messages({
        "any.required": this.validationMessage({ fieldName: "email" })[
          "any.required"
        ],
        "string.empty": this.validationMessage({ fieldName: "email" })[
          "string.empty"
        ],
        "string.email": this.validationMessage({ fieldName: "email" })[
          "string.email"
        ],
      }),

    password: joi
      .string()
      .min(this.minPasswordLength)
      .max(this.maxPasswordLength)
      .trim()
      .messages({
        "any.required": this.validationMessage({
          fieldName: "password",
        })["any.required"],

        "string.empty": this.validationMessage({
          fieldName: "password",
        })["string.empty"],

        "string.min": this.validationMessage({
          fieldName: "password",
          minL: this.minPasswordLength,
        })["string.min"],

        "string.max": this.validationMessage({
          fieldName: "password",
          maxL: this.maxPasswordLength,
        })["string.max"],
      }),

    phone: joi
      .string()
      .length(this.maxPhoneLength)
      .messages({
        "string.length": this.validationMessage({
          fieldName: "phone",
          maxL: this.maxPhoneLength,
        })["string.length"],
      }),

    birthDate: joi
      .date()
      .less("now")
      .messages({
        "any.required": this.validationMessage({ fieldName: "birthDate" })[
          "any.required"
        ],
        "string.empty": this.validationMessage({ fieldName: "birthDate" })[
          "string.empty"
        ],
        "date.base": this.validationMessage({ fieldName: "birthDate" })[
          "date.base"
        ],
      }),

    otpCode: joi
      .string()
      .length(4)
      .messages({
        "any.required": this.validationMessage({ fieldName: "otpCode" })[
          "any.required"
        ],
        "string.empty": this.validationMessage({ fieldName: "otpCode" })[
          "string.empty"
        ],
      }),

    body: joi
      .string()
      .trim()
      .messages({
        "string.empty": this.validationMessage({ fieldName: "body" })[
          "string.empty"
        ],
      }),
  }
}
