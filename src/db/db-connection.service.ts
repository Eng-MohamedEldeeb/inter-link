import { connect, Mongoose } from 'mongoose'
import chalk from 'chalk'

export const dbConnection = async (): Promise<Mongoose | void> => {
  try {
    return await connect(String(process.env.DB_URI)).then(() =>
      console.log(chalk.greenBright('DB Connection Established')),
    )
  } catch (error) {
    if (error instanceof Error)
      console.error({ msg: chalk.red('DB Connection Error'), error })
    console.error({ msg: chalk.red('DB Connection Error'), error })
  }
}
