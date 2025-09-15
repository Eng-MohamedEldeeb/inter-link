import { generate, GenerateOptions } from "randomstring"

export class RandomString {
  public static generateCode = ({
    length,
    charset,
  }: Pick<GenerateOptions, "length" | "charset">): string => {
    return generate({ length, charset })
  }
}
