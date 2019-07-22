const request = require("retry-request", {
  request: require("request")
}); // default we have 3 tries

const saveCandidate = require("./saveCandidate");

// retry request 5 times before reject (err)
const opts = {
  retries: 4
};

// url used for testing purposes only
const testUrl = "https://ent96e99nqgs.x.pipedream.net/testSMS";

// function to send SMS - uses bulksms.ma (mock for now) - 5 tries
const postCallSMS = (res, phoneNum, id, first_name, last_name) => {
  request(
    {
      url: testUrl,
      method: "POST",
      json: true
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
