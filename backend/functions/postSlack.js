// incoming webhook in order to send messages to slack channel (real time)
const slackHook = require("../config/keys").slackHook;
const request = require("request");

// I mean, why not? xd
const emojis = [
  ":persevere:",
  ":face_with_raised_eyebrow:",
  ":thinking_face:",
  ":disappointed_relieved:",
  ":confused:"
];

// function to send a real time message to slack whenever an SMS fails
const postSlack = (id, first_name, last_name, pb) => {
  const randomNum = Math.floor(Math.random() * 4);
  var payload = {
    text:
      "*Failed to send SMS* " +
      emojis[randomNum] +
      "\n" +
      "*Candidate ID:* " +
      id +
      "\n" +
      "*First Name:* " +
      first_name +
      "\n" +
      "*Last Name:* " +
      last_name +
      "\n" +
      "*Problem:* " +
      pb +
      "\n" +
      "--> For more details, please <http://localhost:3000| click here>"
  };
  payload = JSON.stringify(payload);

  request({ url: slackHook, body: payload, method: "POST" }, (err, data) => {
    if (data) console.log(`the message to slack is ${data.body}`);
    if (err) console.log(err);
  });
};

module.exports = postSlack;
