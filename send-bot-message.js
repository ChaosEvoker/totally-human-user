const GENERAL_CHANNEL_ID = '575384443544535044';

var Discord = require('discord.js');
var auth = require('./auth.json');

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);
bot.on('ready', function (evt) {
    bot.channels.fetch(GENERAL_CHANNEL_ID).then((channel) => {
        channel.send(process.argv[2]).then(() => {
            process.exit();
        });
    });
});