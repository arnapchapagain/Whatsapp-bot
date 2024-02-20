# Whatsapp Unofficial API

This is an unofficial API for Whatsapp Web mainly for sending messages. It is based on the whatsapp-web.js library by @pedroslopez which runs the WhatsApp Web UI on Puppeteer.

## Installation
This should install all the dependencies for the project to run. The main ones are whatsapp-web.js and express.

```bash
npm install
```

## Usage

### Starting the server
To create the server, you need to run the following command. This will start the server on port 3000.

```bash
npm start
```

For the first time login, you need to scan the QR code that appears on the terminal. This will create a session file in the project directory. This session file will be used to login the next time you start the server without verifying the QR again.

### Verify if the a number is valid on WhatsApp
To verify if a number is registered on WhatsApp, you need to send a GET request to the following endpoint.

The format of the number should be in the [international E.164 format](https://www.twilio.com/docs/glossary/what-e164).

```bash
POST /is_valid
```

The body of the request should be in the following format.
```json
{
    "number": "+9779810059586"
}
```

This will return a JSON response with the following format.

```json
{
    "is_valid": true || false
}
```

### Sending a message

To send a message, you need to send a POST request to the following endpoint with the following body.

The format of the number should be in the [international E.164 format](https://www.twilio.com/docs/glossary/what-e164).

```bash
POST /send_message
```
The body of the request should be in the following format.
```json
{
    "number": "+9779810059586",
    "message": "Hello World!"
}
```
This will return a JSON response with the following format.

```json
{
    "status": "Pending to be seen",
    "sent_to": "9779810059586",
    "message_id": {
        "fromMe": true,
        "remote": {
            "server": "c.us",
            "user": "9779810059586",
            "_serialized": "9779810059586@c.us"
        },
        "id": "3EB0ACFF56C525C50D0CE2",
        "_serialized": "true_9779810059586@c.us_3EB0ACFF56C525C50D0CE2"
    }
}
```

### Extras
Whenever the status of the sent message changes (example message seen by the user), the script currently logs the status of the message on the terminal. This can be changed to whatever you want to do with the status of the message.

![Alt text](imgs/status_change.png)

### Note
This is a very basic API and is not meant to be used in production. It is just a proof of concept. The API can be extended to do a lot more things as per your needs. Feel free to fork the repo and make changes as per your needs.
