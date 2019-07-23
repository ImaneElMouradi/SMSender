const request = require("retry-request", {
  request: require("request")
}); // default we have 3 tries

const saveCandidate = require("./saveCandidate");

// retry request 5 times before reject (err)
const opts = {
  retries: 4
};

const bulksmsToken = require("../config/keys").bulksmsToken;
const sender = "itwins"; // you can add in the API /&shortcode=${sender}/

// url for production: bulksms https://bulksms.ma/developer/sms/send?token=${bulksmsToken}&tel=${phoneNum}&message=${message}

// url used for testing purposes only, will be replaced with bulksms url
const testUrl = "https://enclxpzaktp8s.x.pipedream.net/SendSMS";

// function to send SMS - uses bulksms.ma (mock for now) - 5 tries
const postCallSMS = (res, phoneNum, id, first_name, last_name, message) => {
  request(
    {
      url: testUrl,
      method: "POST",
      json: true,
      body: `Sms sent to ${first_name} ${last_name}: ${phoneNum}, MESSAGE:${message}`
      // maxAttempts: 5,
      // retryDelay: 5000,
      // retryStrategy: request.RetryStrategies.HTTPOrNetworkError // retry on errors 5xx and network errors
    },
    opts,
    (err, response, body) => {
      if (response) {
        // console.log("The number of request attempts: " + response.attempts); // works with requestretry but had problem with it...
        res.send("send SMS to " + phoneNum);
      }
      if (err) {
        console.log(
          `sms fail to ${id} ${last_name} ${first_name}, error: ${err}`
        );
        saveCandidate("5xx or Network err", id, first_name, last_name, res);
      }
    }
  );
};

module.exports = postCallSMS;
