const expect = require("chai").expect;
const sinon = require("sinon");

const authController = require("../controllers/auth");
const User = require("../models/user");

describe("Auth Controller -- login", function () {
  it("should throw an error with code 500 if accessing DB fails", function () {
    sinon.stub(User, "findOne");
    User.findOne.throw();

    // The issue now that the below login method is running async
    // We will complete this in the next commit/video
    expect(authController.login);

    User.findOne.restore();
  });
});
