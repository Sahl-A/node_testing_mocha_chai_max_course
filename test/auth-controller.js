const expect = require("chai").expect;
const sinon = require("sinon");

const authController = require("../controllers/auth");
const User = require("../models/user");

describe("Auth Controller -- login", function () {
  it("should throw an error with code 500 if accessing DB fails", function (done) {
    sinon.stub(User, "findOne");
    // Make the connection to DB throws error using sinon stub throws() method
    User.findOne.throws();

    // Create dummy req.body.email & req.body.passowrd to by-pass it in login() as we don't test them
    const req = {
      body: {
        email: "test",
        password: "test",
      },
    };
    // Since the login() runs async and returns a promise, we use then to exucte our test
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        // Run done here after resolving the promise to end the test function
        done();
      });
    User.findOne.restore();
  });
});
