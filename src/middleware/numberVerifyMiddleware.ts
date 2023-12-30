import { Request, Response, NextFunction } from 'express';

export default function numberVerifyMiddleware(req: Request, res: Response, next: NextFunction){
    if (!req.body.number){
        return res.status(400).send({
            error: 'Missing number on request body'
        });
    }
    var number: string = req.body.number as string;
    if (!(/^\+[0-9]*?$/.test(number))) {
        return res.status(400).send({
            error: 'Invalid number format. Use E.164 format, i.e. [+][country-code][10-digit-number-without-dashes]'
        });
    } 
    // remove the + from the number
    number = number.replace(/\+/g, '');
    
    // add @c.us if it's not present because whatsapp ID must be in this format to be checked by the whatsapp-web.js library
    if (!number.endsWith('@c.us')) {
        number += '@c.us';
    }
    req.body.number = number;
    next();
}
