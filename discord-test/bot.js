var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

var User = function(username, id) {
    this.username = username;
    this.id = id;
};

users = [];
bot.register = function(username, id) {
    userObj = new User(username, id);
    logger.info(userObj)
    users.push(userObj);
};

bot.ping_all = function() {
    for (var i in users) {
        var user = users[i];
        logger.info(user);
        logger.info('sending message to user ' + user.username
                    + ' with id ' + user.id);
        bot.sendMessage({
            to: user.id,
            message: 'Pong!'
        }); 
    }
};

//filters messages based on languages
bot.filter = function(msg, lang) {
  
};

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                //for(i=0;i<100;i++){
                bot.sendMessage({
                    to: userID,
                    message: 'Pong!'
                });
                //}
            case 'register':
                logger.info('registering user ' + user 
                            + ' [' + typeof user + ']');
                logger.info(user + ' has id ' + userID 
                            + ' [' + typeof userID + ']');
                logger.info(user);
                bot.register(user, userID);
						break;

            case 'ping-all':
                bot.ping_all();
            // Just add any case commands if you want to..
         }
     }
});
