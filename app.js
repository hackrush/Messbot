var unirest = require('unirest');

// --- CONSTANTS --- //
var DEFAULT_TIMEOUT = 60;
var DEBUG = true;

var BOT_TOKEN = "276973160:AAGi_I4vVdU3D86zn37kydA3Awars9BMYuM";
var BASE_URL = "https://api.telegram.org/bot" + BOT_TOKEN + "/";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset&timeout=" + DEFAULT_TIMEOUT; // GET
var SEND_MESSAGE_URL = BASE_URL + "sendMessage" // POST

// --- INITIALIZATION --- //
var max_offset = 0; // used for getting only new messages later

// Dummy database --> in a real world application this won't be an in-memory JavaScript object, but a database connection
var questions = [
{
	q : "Birds can fly.",
	correct : true,
	answered_by : []
},
{
	q : "1 + 1 equals 3",
	correct : false,
	answered_by : []
}
];

// Array which will map a user id to the question he recently got displayed and hasn't answered yet
var active_questions = [];

// Start polling loop
poll(max_offset);

// --- APPLICATION LOGIC --- //
function poll(offset) {
	var url = POLLING_URL.replace(":offset", offset);

	if (DEBUG) console.log("Polling now.");

	unirest.get(url)
	.end(function(response) {
		if (DEBUG) console.log("Starting new request to " + url);

            // Extract HTTP body from response
            var body = response.raw_body;
            if (response.status == 200) {

            	// Parse as JSON data and take the result object, which contains an array of messages (or may be empty as well)
            	var jsonData = JSON.parse(body);
            	var result = jsonData.result;
            	if (DEBUG) console.log(JSON.stringify(result));

                // Run through every newly received message object
                if (result.length > 0) {
                	for (i in result) {
                    	// Try to interpret the text as a command and jump right to next message object, if command parsing was successful
                    	if (runCommand(result[i].message)) continue;
                    }

                    // Update the offset for the next poll to the latest received message id + 1, to only get new messages at next request
                    max_offset = parseInt(result[result.length - 1].update_id) + 1; // update max offset
                }
            }

            // Long-poll again
            poll(max_offset);
        });
};

var getquestion = function(message) {
	// Fetch a question from database.
	// We do this by randomly getting an array entry --> in a real world app you would query the database for questions the current user hasn't answered yet
	var question = questions[randomInt(questions.length - 1)];

	// Build the telegram answer message object with keyboard buttons
	var answer = {
		chat_id : message.chat.id,
		text : question.q,
		reply_markup : JSON.stringify({
			keyboard : [["/true", "/false"]],
			resize_keyboard : true,
			one_time_keyboard : true
		})
	};

	unirest.post(SEND_MESSAGE_URL)
	.send(answer)
	.end(function (response) { // empty callback
	});

	active_questions[message.chat.id] = question;
}

var answerquestion = function(message) {
	var userid = message.chat.id;
	var question = active_questions[userid];
	var answer = {};

	if (!question) return false;
	if (DEBUG) console.log ("User's answer: " + message.text);

	// We assume the message text is either "/true" or "/false" and then convert this into boolean
	var useranswer = (message.text == "/true") ? true : false;

	// Compare user's answer with correct answer and add the user to the question's answered_by array, if he was right
	if (useranswer == question.correct) {
		question.answered_by.push(userid);
		answer = {
			chat_id : message.chat.id,
			text : "You were right!",
            reply_markup : JSON.stringify({
                hide_keyboard : true
            })
		};
	}
	else {
		answer = {
			chat_id : message.chat.id,
			text : "Sorry, your answer was wrong. Try again!"
		};
	}

	unirest.post(SEND_MESSAGE_URL)
	.send(answer)
	.end(function (response) { // empty callback
	});

	// Reset current user's currently pending questions
	active_questions[userid] = null;

	return true;
}

// Define available commands and map them to functions which should be executed
// Our bot would accept command "/get", "/true" and "/false"
var COMMANDS = {
	"get" : getquestion,
	"true" : answerquestion,
	"false" : answerquestion
};

function runCommand(message) {
	var msgtext = message.text;

    // Validate message text whether it actually is a command
    if (msgtext.indexOf("/") != 0) return false; // no slash at beginning? --> no command --> return

    // Only interpret the text after the preceeding slash and to the first blank space as command, i.e. extract "mycommand" out of "/mycommand First argument"
    var command = (msgtext.indexOf(" ") == -1) ? msgtext.substring(1, msgtext.length) : msgtext.substring(1, msgtext.indexOf(" "));
    if (DEBUG) console.log("command is " + command);

    // Check whether the command exists, i.e. we have a mapping for it
    if (COMMANDS[command] == null) return false; // not a valid command?

    // Actually run the corresponding function
    COMMANDS[command](message);
    return true;
}

// Returns a random integer between 0 and max
function randomInt(max) {
	return Math.round((Math.random() * max));
}
