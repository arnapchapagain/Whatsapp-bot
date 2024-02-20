import type { Request, Response } from 'express'

export function getMe (req: Request, res: Response): void {
  const me = globalThis.client.info.wid
  res.status(200).send({
    me
  })
}
