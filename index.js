var TelegramBot = require('node-telegram-bot-api'),
    // Be sure to replace YOUR_BOT_TOKEN with your actual bot token on this line.
    telegram = new TelegramBot("292384265:AAHb0UrO6xXLiYe5Ta0AJ7p5lFintxrlPJY", {
        polling: true
    });
var request = require('request');
var breakfast;
var lunch;
var supper;
var options = {
    method: 'GET',
    json: true,
    uri: 'http://localhost:3000/api/messes'
}
request(options, function(error, response, body) {
    if (error)
        console.log(error);
    // else console.log(body[0]);
    breakfast = body[0];
    lunch = body[1];
    supper = body[2];
    console.log(supper);
});

telegram.on("text", (message) => {
    // console.log(foods);
    telegram.sendMessage(message.chat.id, "We are Working!");
    // get message and respond
    if (message.text.toLowerCase().indexOf("breakfast") === 0) {
        var _list = breakfast;
        delete _list.type;
        delete _list.id;
        // var list = JSON.stringify(_list);
        var tea;
        console.log(_list);
        //status for tea
        if (_list.tea == true) {
            tea = "Available"
        } else {
            tea = "Not Available"
        }
        // status for coffee
        if (_list.coffee == true) {
            coffee = "Available"
        } else {
            coffee = "Not Available"
        }
        if (_list.cake == true) {
            cake = "Available"
        } else {
            cake = "Not Available"
        }
        if (_list.eggs == true) {
            eggs = "Available"
        } else {
            eggs = "Not Available"
        }
        if (_list.sandwich == true) {
            sandwich = "Available"
        } else {
            sandwich = "Not Available"
        }
        telegram.sendMessage(message.chat.id, "Breakfast Menu: " + " *TEA* is " + "*" + tea + "*!" +
            " *Coffee* is " + "*" + coffee + "*!" +
            " *Cake* is " + "*" + cake + "*!" +
            " *Eggs* is " + "*" + eggs + "*!" +
            " *Sandwich* is " + "*" + sandwich + "*!" +
            "  ", {
                parse_mode: "Markdown"
            });

    };
    if (message.text.toLowerCase().indexOf("lunch") === 0) {
        var _list = lunch;
        delete _list.type;
        if (_list.rice == true) {
            rice = "Available"
        } else {
            rice = "Not Available"
        }
        // status for coffee
        if (_list.ugali == true) {
            ugali = "Available"
        } else {
            ugali = "Not Available"
        }
        if (_list.tea == true) {
            cake = "Available"
        } else {
            tea = "Not Available"
        }
        if (_list.cabbage == true) {
            cabbage = "Available"
        } else {
            cabbage = "Not Available"
        }
        if (_list.greengrams == true) {
            greengrams = "Available"
        } else {
            greengrams = "Not Available"
        }
        if (_list.beans == true) {
            beans = "Available"
        } else {
            beans = "Not Available"
        }
        if (_list.vegstew == true) {
            vegstew = "Available"
        } else {
            vegstew = "Not Available"
        }
        telegram.sendMessage(message.chat.id, "Lunch Menu: " + " *Rice* is " + "*" + rice + "*!" +
            " *Ugali* is " + "*" + ugali + "*!" +
            " *Beans* is " + "*" + beans + "*!" +
            " *Greengrams* is " + "*" + greengrams + "*!" +
            " *Cabbage* is " + "*" + cabbage + "*!" +
            " *Tea* is " + "*" + tea + "*!" +
            " *VegStew* is " + "*" + vegstew + "*!" +

            " ", {
            parse_mode: "Markdown"
        });
    };
    if (message.text.toLowerCase().indexOf("supper") === 0) {
        var _list = supper;
        delete _list.type;

        if (_list.rice == true) {
            rice = "Available"
        } else {
            rice = "Not Available"
        }
        // status for coffee
        if (_list.ugali == true) {
            ugali = "Available"
        } else {
            ugali = "Not Available"
        }
        if (_list.tea == true) {
            tea = "Available"
        } else {
            tea = "Not Available"
        }
        if (_list.cabbage == true) {
            cabbage = "Available"
        } else {
            cabbage = "Not Available"
        }
        if (_list.greengrams == true) {
            greengrams = "Available"
        } else {
            greengrams = "Not Available"
        }
        if (_list.beans == true) {
            beans = "Available"
        } else {
            beans = "Not Available"
        }
        if (_list.vegstew == true) {
            vegstew = "Available"
        } else {
            vegstew = "Not Available"
        }
        telegram.sendMessage(message.chat.id, "Supper Menu: " + " *Rice* is " + "*" + rice + "*!" +
            " *Ugali* is " + "*" + ugali + "*!" +
            " *Beans* is " + "*" + beans + "*!" +
            " *Greengrams* is " + "*" + greengrams + "*!" +
            " *Cabbage* is " + "*" + cabbage + "*!" +
            " *Tea* is " + "*" + tea + "*!" +
            " *VegStew* is " + "*" + vegstew + "*!" +

            " ", {
            parse_mode: "Markdown"
        });

    };

})
// inline query
telegram.on("inline_query", (query) => {
  telegram.answerInlineQuery(query.id, [
    {
      type: "article",
      id: "testarticle",
      title: "Hello world",
      input_message_content: {
        message_text: "Hello, world! This was sent from my super cool inline bot."
      }
    }
  ]);
});
