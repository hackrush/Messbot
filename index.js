var TelegramBot = require('node-telegram-bot-api'),
    // Be sure to replace YOUR_BOT_TOKEN with your actual bot token on this line.
    telegram = new TelegramBot("276973160:AAGi_I4vVdU3D86zn37kydA3Awars9BMYuM", {
        polling: true
    });
var request = require('request');
var foods;
var options = {
    method: 'GET',
    json: true,
    uri: 'http://localhost:3000/api/notices'
}
request(options, function(error, response, body) {
    if (error)
        console.log(error);
    // else console.log(body[0]);
    foods = body[0];
    console.log(foods);
});

telegram.on("text", (message) => {
    // console.log(foods);
    telegram.sendMessage(message.chat.id, "We are Working!");
    // get message and respond
    if (message.text.toLowerCase().indexOf("/lunch") === 0) {
        // console.log(foods);
        var lunchlist = foods.title
        telegram.sendMessage(message.chat.id, "The Menu For Lunch is *" + lunchlist + "*!", {
          parse_mode: "Markdown"

        });

    };
    if (message.text.toLowerCase().indexOf("/breakfast") === 0) {
        telegram.sendMessage(message.chat.id, "We are Working on something for Breakfast");

    };
    if (message.text.toLowerCase().indexOf("/supper") === 0) {
        telegram.sendMessage(message.chat.id, "We are Working on something for Supper");

    };

});
