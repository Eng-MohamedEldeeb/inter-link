import { connect, Mongoose } from 'mongoose'

export const dbConnection = async (): Promise<Mongoose | void> => {
  try {
    return await connect(String(process.env.DB_URI)).then(() =>
      console.log('DB Connection Established'),
    )
  } catch (error) {
    if (error instanceof Error)
      console.error({ msg: 'DB Connection Error', error })
    console.error({ msg: 'DB Connection Error', error })
  }
}
