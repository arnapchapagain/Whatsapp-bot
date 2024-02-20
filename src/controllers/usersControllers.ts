import type { Request, Response } from 'express'

export function getMe (req: Request, res: Response): void {
  const me = globalThis.client.info.wid
  const name = globalThis.client.info.pushname
  const platform = globalThis.client.info.platform
  res.status(200).send({
    ...me,
    name,
    platform
  })
}

export async function verifyNumber (req: Request, res: Response): Promise<void> {
  const isValid = await client.isRegisteredUser(req.body.number as string)
  const statusCode = isValid ? 200 : 400
  res.status(statusCode).send({
    is_valid: isValid
  })
}
