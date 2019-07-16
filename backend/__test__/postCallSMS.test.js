const { postCallSMS } = require("../server.js");

it("http post request to bulksms", () => {
  return postCallSMS().then(response => {
    expect(response).toEqual();
  });
});
