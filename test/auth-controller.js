const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

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

  // Test with DB
  it("should return a response with a valid user status for an existing user", function (done) {
    // Add the dummy user to the DB, so we can test getting it and checking the received status
    mongoose
      .connect("mongodb://localhost:27017/test-messages", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        const user = new User({
          email: "test",
          password: "test",
          name: "test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        const req = { userId: "5c0f66b979af55031b34728a" };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };

        authController
          .getUserStatus(req, res, () => {})
          .then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal("I'm a new user");
            done();
          });
      })
      .catch((err) => console.log(err));
  });
});
