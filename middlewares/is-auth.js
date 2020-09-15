const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check if any authorization headers is sent
  const authData = req.get("Authorization");
  if (!authData) {
    const error = new Error("No token was sent");
    error.statusCode = 401;
    throw error;
  }
  // Get the token from the authorization headers
  const token = authData.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      token,
      "SECRET KEY TO GENERATEE THE TOKEN<, SHOULD BE COMPLICATED"
    );
  } catch (err) {
    // ERR when decoding the token using the secret & the received one
    err.statusCode = 500;
    throw err;
  }
  // If it failed to verify the received token from the secret key
  if (!decodedToken) {
    const error = new Error("Not Authorized");
    error.statusCode = 401;
    throw error;
  }
  // Since we reached this line of code, it means that the token was decoded successfully
  // Set userId in the token in the request
  // This is to use userId for authentication later when deleting posts
  req.userId = decodedToken.userId;
  next();
};
