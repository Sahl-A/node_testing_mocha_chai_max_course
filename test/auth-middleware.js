const expect = require("chai").expect;

const authMiddleware = require("../middlewares/is-auth");

describe("Auth middleware", function () {
  it("should throw an error if no authorization error is present", function () {
    // Inside the authMiddleware function, it checks req.get('authorization')
    // That's why we define dummy req object with get method that always returns null
    // So, when we pass the dummy req, the function uses it and either throw an error (test pass) or
    // returns a value (test fail)
    const req = {
      get: function (header) {
        return null;
      },
    };
    // Use bind to return a reference to authMiddleware function. We don't need to run it immedietly here.
    expect(authMiddleware.bind(this, req, {}, () => {})).throw(
      "No token was sent"
    );
  });

  it("should throw an error if the authorization sent is one string without spaces", function () {
    const req = {
      get: function (header) {
        return "xyz";
      },
    };
    // With throw(), we test if it throws an error regardless the error message
    expect(authMiddleware.bind(this, req, {}, () => {})).throw();
  });
});
