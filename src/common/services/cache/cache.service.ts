import { cachingDB } from "../../utils/cache/cache-connection.service"
import { ICacheArgs } from "./interface/cache-service.interface"

export abstract class CacheService<T> {
  private readonly cachingDB = cachingDB()

  readonly get = async (key: string): Promise<T | null> => {
    const value = await (await this.cachingDB).get(key)

    let parsedValue: { expiresAfter: number; value: T } | null = null

    if (value) parsedValue = JSON.parse(value)

    return parsedValue?.value ?? null
  }

  readonly set = async ({
    key,
    value,
    expiresAfter,
  }: ICacheArgs): Promise<string | null> => {
    return await (
      await this.cachingDB
    ).set(key, JSON.stringify({ expiresAfter, value }), {
      ...(expiresAfter && { expiration: { type: "EX", value: expiresAfter } }),
    })
  }
}
