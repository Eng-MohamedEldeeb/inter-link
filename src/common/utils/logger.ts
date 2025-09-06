import chalk from "chalk"

export const portLogger = (port: number) => {
  console.log(chalk.yellowBright("-".repeat(35)))

  console.log(
    chalk.yellowBright("#"),
    chalk.blue("app is running on port"),
    chalk.greenBright("::"),
    chalk.yellow(port),
    chalk.yellowBright("#"),
  )

  console.log(chalk.yellowBright("-".repeat(35)))
}
