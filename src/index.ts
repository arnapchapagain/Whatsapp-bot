import express, {Request, Response} from 'express';
import { Chat } from 'whatsapp-web.js';
import client from './client';
import qrcode from 'qrcode-terminal';
import clientReadyMiddleware from './middleware/clientReadyMiddleware';

const app = express();
app.use(express.json());

client.initialize();

declare global {
    var IS_READY: boolean;
    var IS_AUTHENTICATED: boolean;
}

globalThis.IS_READY = false;
globalThis.IS_AUTHENTICATED = false;


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


client.on('ready', async () => {
    console.log('Client is ready!');
    globalThis.IS_READY = true;
});


client.on('authenticated', () => {
    globalThis.IS_AUTHENTICATED = true;
    console.log('Client is authenticated!');
});


client.on('authentication_failure', () => {
    console.log('Auth failure!');
});


app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World!');
});


app.get('/status', clientReadyMiddleware, async (req: Request, res: Response) => {
    res.status(200).send({
        message: 'Client is ready and authenticated'
    });
});


app.get('/me', clientReadyMiddleware, async (req: Request, res: Response) => {
    let me = await client.info.wid;
    res.status(200).send({
        me: me
    });
});


app.post('/is_valid', clientReadyMiddleware, async (req: Request, res: Response) => {
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
    
    let isValid = await client.isRegisteredUser(number);
    res.status(200).send({
        is_valid: isValid
    });
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
})

