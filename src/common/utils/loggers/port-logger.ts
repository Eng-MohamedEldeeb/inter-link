import chalk from "chalk"

export const portLogger = (port: number) => {
  console.log(chalk.yellowBright("-".repeat(37)))

  console.log(
    chalk.yellowBright("#"),
    chalk.blue("Server is Running on Port"),
    chalk.greenBright("::"),
    chalk.yellow(port),
    chalk.yellowBright("#"),
  )

  console.log(chalk.yellowBright("-".repeat(37)))
}
