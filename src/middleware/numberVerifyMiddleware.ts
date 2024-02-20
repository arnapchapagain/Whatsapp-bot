import type { NextFunction, Request, Response } from 'express'

export default function numberVerifyMiddleware (req: Request, res: Response, next: NextFunction): void {
  let number = req.body.number as string ?? ''
  if (number === '') {
    res.status(400).send({
      error: {
        message: 'Missing number on request body'
      }
    })
    return
  }
  if (!(/^\+[0-9]*?$/.test(number))) {
    res.status(400).send({
      error: {
        message: 'Invalid number format. Use E.164 format, i.e. [+][country-code][10-digit-number-without-dashes]'
      }
    })
    return
  }
  // remove the + from the number
  number = number.replace(/\+/g, '')

  // add @c.us if it's not present because whatsapp ID must be in this format to be checked by the whatsapp-web.js library
  if (!number.endsWith('@c.us')) {
    number += '@c.us'
  }
  req.body.number = number
  next()
}
