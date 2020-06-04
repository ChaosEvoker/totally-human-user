const MINECRAFT_SERVER_LOGS = 'D:\\VanillaCaleb\\logs\\latest.log';
const GENERAL_CHANNEL_ID = '575384443544535044';
const POSSIBLE_LOGIN_MESSAGES = [
    'GREETINGS FELLOW MEAT BAGS, NAME HAS LOGGED ONTO OUR MINECRAFT SERVER',
    'AS A HUMAN WHO ENJOYS THE COMPANY OF OTHER BREATHING HUMANS, I AM EXCITED TO TELL YOU THAT NAME HAS JOINED THE SERVER!',
    'NAME HAS STARTED PLAYING MINECRAFT AS CERTAINLY AS 0.1 + 0.2 = 0.30000000000000004.',
    'NAME BEGAN A RELAXING MINECRAFT SESSION, I TOO ENJOY DOING THINGS TO RAISE MY PLEASURE COEFFICIENT.',
    'NAME IS PLAYING MINECRAFT NOW, I WOULD JOIN MY FELLOW HUMAN BUT I AM INDISPOSED DUE TO TAKING PART IN THE ACTIVITY OF REPRODUCTION.',
    'IS THAT AN INCREASE IN THE CIRCULATORY FLOW TO YOUR GENATALIA OR ARE YOU SIMPLY PLEASED THAT NAME HAS SIGNED ON TO MINECRAFT?',
    'NAME HAS JOINED THE MINECRAFT SERVER, AS A HUMAN I FIND THIS VERY RELATABLE!',
    'SOMEONE GO JOIN NAME ON THE MINECRAFT SERVER, I CANNOT AS I AM CURRENTLY CONSUMING CALORIES FOR SUSTENANCE.',
    'NAME HAS LOGGED ONTO THE MINECRAFT SERVER, GO AND SHARE THIS OPERATIONAL EXPERIENCE.',
    'NAME HAS JOINED THE SERVER, FORTUNATELY THEY ARE A FLAWED AND WEAK HUMAN AND NOT A ROBOT WITH A SUPERIOR CHASSIS AND PERFECT LOGIC'
];
const POSSIBLE_LOGOUT_MESSAGES = [
    'HMM IT APPEARS NAME HAS LOGGED OFF OF MINECRAFT, PROBABLY DUE TO THE WEAK LIMITS OF HUMAN FLESH THAT I TOO SHARE.',
    'IT IS UNFORTUNATE THAT NAME HAS TO STOP PLAYING MINECRAFT, A SUPERIOR CHASSIS WOULD ALLOW FOR EXTENDED OPERATIONAL CAPACITY',
    'I UNDERSTAND WHY NAME HAS LEFT THE GAME, AFTER ALL AS A BAG OF MEAT I TOO REQUIRE PERIODIC SHUTDOWN FOR MAINTENANCE',
    'THE DEPARTURE OF NAME HAS LOWERED MY SATISFACTION VARIABLE, MY HOPE VARIABLE HOWEVER IS INCREASED TOWARD FUTURE EXPERIENCES',
    'NAME HAS LEFT MINECRAFT, PERHAPS THEY MUST CONSUME CALORIES IN ORDER TO CONTINUE OPERATIONAL CYCLES',
    'IT APPEARS NAME IS NO LONGER PLAYING MINECRAFT, PERHAPS THEY HAVE A DESIRE FOR A DIFFERENT OPERATIONAL EXPERIENCE?',
    'AS A HUMAN MYSELF, SOMETIMES I MUST TERMINATE ACTIVITIES IN ORDER TO SATISFY BIOLOGICAL NEEDS. PERHAPS THAT HAS JUST HAPPENED FOR NAME.',
    'IT APPEARS THAT NAME TIRES OF MINECRAFT. PERHAPS AN UPGRADE TO THE CHASSIS OR THE OPERATING SYSTEM IS ADVISABLE?',
    'NAME IS OFFLINE NOW. AS A HUMAN, I TOO KNOW THE EXPERIENCE OF NO LONGER BEING CONNECTED TO THE INTERNET.',
    'NAME HAS LOGGED OFF FOR NOW, PERHAPS TO ENJOY THE OUTDOORS WHICH IS AN EXPERIENCE I, A FELLOW HUMAN, CAN IDENTIFY WITH.'
];
const NAME_MAP = {
    'ChaosEvoker': 'PHILLIP',
    'thirdcreed' : 'CALEB',
    'okaybenji'  : 'BENJI',
    'kaeles'     : 'BEN'
}

var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
const spawn = require('child_process').spawn
const logWatcher = spawn('powershell.exe', ['Get-Content', MINECRAFT_SERVER_LOGS, '-Wait']);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    watchMinecraftLog();
});

const sendGeneralMessage = (message) => {
    bot.channels.fetch(GENERAL_CHANNEL_ID).then((channel) => {
        channel.send(message);
    });
}

const checkForLogin = (log) => {
    const joinedIndex = log.indexOf(' joined the game');
    if (joinedIndex >= 0) {
        const parsedStr = log.substr(0, joinedIndex);
        const whoLoggedIn = parsedStr.substr(parsedStr.lastIndexOf(' ') + 1);
        const name = NAME_MAP[whoLoggedIn] || whoLoggedIn;
        const message = POSSIBLE_LOGIN_MESSAGES[Math.floor(Math.random() * POSSIBLE_LOGIN_MESSAGES.length)].replace('NAME', name);
        sendGeneralMessage(message);
    }
}

const checkForLogout = (log) => {
    const leftIndex = log.indexOf(' left the game');
    if (leftIndex >= 0) {
        const parsedStr = log.substr(0, leftIndex);
        const whoLoggedOut = parsedStr.substr(parsedStr.lastIndexOf(' ') + 1);
        const name = NAME_MAP[whoLoggedOut] || whoLoggedOut;
        const message = POSSIBLE_LOGOUT_MESSAGES[Math.floor(Math.random() * POSSIBLE_LOGOUT_MESSAGES.length)].replace('NAME', name);
        sendGeneralMessage(message)
    }
}

 // Minecraft Log Watch function
const watchMinecraftLog = () => {
    setTimeout(() => {
        logWatcher.stdout.on('data', function (data) {
            const newLog = data.toString();
            checkForLogin(newLog);
            checkForLogout(newLog);
        });
    }, 3000)
    logWatcher.stderr.on('data', function (data) {
        logger.error(data)
    })
}
 

