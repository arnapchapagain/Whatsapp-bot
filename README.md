# Whatsapp Unofficial API

This is an unofficial API for Whatsapp Web mainly for sending messages. It is based on the whatsapp-web.js library by @pedroslopez which runs the WhatsApp Web UI on Puppeteer.

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/31989932-b44e804b-0ddd-411c-85ff-9815db6e8b06?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D31989932-b44e804b-0ddd-411c-85ff-9815db6e8b06%26entityType%3Dcollection%26workspaceId%3D05c8df04-edb7-47ec-81f1-bf2707c45a72)

# Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
    - [Development](#development)
    - [Starting the server](#starting-the-server)
    - [Deploy in production](#deploy-in-production)
3. [API Endpoints](#api-endpoints)
    - [Verify if the a number is valid on WhatsApp](#verify-if-the-a-number-is-valid-on-whatsapp)
    - [Sending a message](#sending-a-message)
4. [Extras](#extras)
5. [TODO](#todo)  

## Installation
This should install all the dependencies for the project to run. The main ones are whatsapp-web.js and express.

```bash
npm install
OR 
yarn install
```

## Usage

### Development
To start the server in development mode, you can use the following command. This will start the server using nodemon which will restart the server whenever you make changes to the code. The port is 3000.

```bash
npm run dev
```

### Starting the server
To create the server, you need to run the following command. This will start the server on port 3000.

```bash
npm start
```

### Scan the QR code
For the first time login, you need to scan the QR code that appears on the terminal. This will create session directories. These session directories will be cached and you will not need to scan the QR code again on another runs unless you delete the session directory.

### Deploy in production
> Note: Before starting the production server make sure to first run the [start command mentioned above](#starting-the-server) to generate session file and QR code. Only after that you can deploy the server in production.

To deploy in production, we will use pm2. You should install pm2 globally using the following command.

```bash
npm install pm2 -g
```

First build the project using the following command.

```bash
npm run build
```

Then start the server using the following command.

```bash
npm run start:prod
```

## API Endpoints
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

## Extras
Whenever the status of the sent message changes (example message seen by the user), the script currently logs the status of the message on the terminal. This can be changed to whatever you want to do with the status of the message.

![Alt text](imgs/status_change.png)

## TODO
- [ ] Send media and other file types in message.
- [x] Send a message to a group.
- [ ] Create a group.
- [ ] Add a user to a group.
- [ ] Remove a user from a group.
- [ ] Get the status of a group.
- [ ] Set group user's privilages.

