import { client } from "./cache-connection.service"
import { ICacheArgs } from "./interface/cache-service.interface"

export abstract class CacheService<T> {
  private readonly client = client()

  readonly get = async (key: string): Promise<T | null> => {
    const value = await (await this.client).get(key)

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
      await this.client
    ).set(key, JSON.stringify({ expiresAfter, value }), {
      ...(expiresAfter && { expiration: { type: "EX", value: expiresAfter } }),
    })
  }
}
