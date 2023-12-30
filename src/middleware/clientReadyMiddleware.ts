// create a middleware for express that checks the global IS_READY and IS_AUTHENTICATED variables

import { Request, Response, NextFunction } from 'express';

export default function clientReadyMiddleware(req: Request, res: Response, next: NextFunction){
    if (!globalThis.IS_AUTHENTICATED){
        return res.status(401).send({
            error: 'Client is not authenticated'
        });
    }
    if (!globalThis.IS_READY){
        return res.status(401).send({
            error: 'Client is not ready'
        });
    }
    next();
}
