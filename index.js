'use strict';

var TelegramBot = require('node-telegram-bot-api');

var TOKEN = '276973160:AAGi_I4vVdU3D86zn37kydA3Awars9BMYuM';
var USER = 'USER_ID';

var bot = new TelegramBot(TOKEN, {polling: {timeout: 1, interval: 100}});

var opts = {
  reply_markup: JSON.stringify(
                            {
                                  force_reply: true
                                }
                                  )};

bot.sendMessage(USER, 'How old are you?', opts)
  .then(function (sended) {
      var chatId = sended.chat.id;
      var messageId = sended.message_id;
      bot.onReplyToMessage(chatId, messageId, function (message) {
            console.log('User is %s years old', message.text);
          });
    });
