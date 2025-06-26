import { Request } from 'express'
import { FileFilterCallback } from 'multer'
import { AcceptedFiles } from './types/file-filter.types'

export const fileFilter = (acceptedFiles: AcceptedFiles[]) => {
  return (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!acceptedFiles.includes(file.mimetype as AcceptedFiles))
      cb(new Error('file not accepted: [ in-valid file formate ]'))
    cb(null, true)
  }
}
