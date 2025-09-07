import { ISendArgs } from "../../events/send-email/interface/send-args.interface"

import emailEvent from "../../events/send-email/send-email.event"

export class EmailService {
  private static readonly emailEvent = emailEvent

  public static readonly send = ({
    schema,
    to,
    otpCode,
    userName,
  }: ISendArgs) => {
    return this.emailEvent.emit("send", { schema, to, otpCode, userName })
  }
}
