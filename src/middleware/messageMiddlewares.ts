import type { NextFunction, Request, Response } from 'express'

/**
 * Checks if the message is in the correct format
 * @param req The request object
 * @param res The response object
 * @param next The next function
 * @returns void
 */
export default function messageFormatVerify (req: Request, res: Response, next: NextFunction): void {
  const message = req.body.message as string ?? ''

  if (message === '') {
    res.status(400).send({
      error: 'Missing message on request body'
    })
    return
  }

  if (message.length === 0) {
    res.status(400).send({
      error: 'Message is empty'
    })
    return
  }
  if (message.length > 4096) {
    res.status(400).send({
      error: 'Message is too long. Max length is 4096 characters'
    })
    return
  }
  next()
}
