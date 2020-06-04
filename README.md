# Totally Human User

The code for our Discord bot.

## Getting Started

### Dependencies

* Node
* Powershell

### Installing

Just clone the repository and run in the directory:
```
npm install
```

Then create an `auth.json` file in the directory, copy the contents of `example.auth.json` into it and ask Phillip for the real key.

### Executing program

The program has two implemented commands:

To run the notification process that scans the logs for events to notify:
```
node bot.js
```

To send a one time message:
```
node send-bot-message.js "This is what I have to say"
```