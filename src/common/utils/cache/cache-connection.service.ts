import chalk from "chalk"
import { createClient } from "redis"

export const cachingDB = async () => {
  return createClient()
    .on("connect", () => {
      console.log(
        `${chalk.yellowBright("#")} ${chalk.greenBright("Caching DB Connection Established")} ${chalk.yellowBright("#")}`,
      )
      console.log(chalk.yellowBright("-".repeat(37)))
    })
    .on("error", error => {
      throw error
    })
    .connect()
}
