import chalk from "chalk"
import { Router } from "express"

export const routeLogger = ({
  routeName,
  router,
}: {
  routeName: string
  router: Router
}) => {
  console.group(chalk.underline(chalk.cyanBright(chalk.bold(routeName))))

  console.table(
    router.stack.map(s1 => {
      return {
        method: s1.route?.stack[0].method.toUpperCase(),
        route: s1.route?.path,
      }
    }),
  )

  // router.stack.forEach(s1 => {
  //   console.log(
  //     `${chalk.yellowBright(chalk.bold(s1.route?.stack[0].method.toUpperCase()))}: ${chalk.greenBright(s1.route?.path)}`,
  //   )
  // })

  // console.log("\n")

  console.groupEnd()
}
