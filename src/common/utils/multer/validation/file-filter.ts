import { Request } from "express"
import { FileFilterCallback } from "multer"
import { AcceptedFiles } from "./types/file-filter.types"

export const fileFilter = (acceptedFiles: AcceptedFiles[]) => {
  return (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!acceptedFiles.includes(file.mimetype as AcceptedFiles))
      cb(
        new Error("file not accepted: [ Invalid file formate ]", {
          cause: 415,
        }),
      )
    cb(null, true)
  }
}
