// create a middleware for express that checks the global IS_READY and IS_AUTHENTICATED variables

import type { NextFunction, Request, Response } from 'express'

export default function clientReadyMiddleware (req: Request, res: Response, next: NextFunction): void {
  if (!globalThis.IS_AUTHENTICATED) {
    res.status(401).send({
      error: {
        message: 'Client is not authenticated'
      }
    })
    return
  }
  if (!globalThis.IS_READY) {
    res.status(401).send({
      error: {
        message: 'Client is not ready'
      }
    })
    return
  }
  next()
}
