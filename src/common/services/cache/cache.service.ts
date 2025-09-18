import { createClient } from "redis"
import { ICacheArgs } from "./interface/cache-service.interface"
import chalk from "chalk"

export abstract class CacheService {
  public static readonly connect = () => {
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

  static readonly get = async <T>(key: string): Promise<T | null> => {
    const value = await (await this.connect()).get(key)

    let parsedValue: T | null = null

    if (value) parsedValue = JSON.parse(value)

    return parsedValue
  }

  static readonly set = async ({
    key,
    value,
    expiresAfter,
  }: ICacheArgs): Promise<string | null> => {
    return await (
      await this.connect()
    ).set(key, JSON.stringify(value), {
      ...(expiresAfter && { expiration: { type: "EX", value: expiresAfter } }),
    })
  }
}
