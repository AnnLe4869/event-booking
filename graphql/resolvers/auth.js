const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: async ({ userInput }) => {
    try {
      if (userInput.email == null || userInput.password == null) {
        throw Error("The email or password cannot be empty");
      }
      const isEmailExisted = await User.findOne({ email: userInput.email });
      if (isEmailExisted) throw new Error("User already existed");

      const user = new User({
        email: userInput.email,
        password: await bcrypt.hash(userInput.password, 15),
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      console.error(err);
      throw err; // This is needed so that the error message is displayed in GraphQL client
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Your credentials are invalid");

      const passwordCheckResult = await bcrypt.compare(password, user.password);
      if (!passwordCheckResult) throw new Error("Your credentials are invalid");

      const token = jwt.sign(
        { userId: user._id, email },
        "asecretthatcannotbeshared",
        { expiresIn: "1h" }
      );
      return { userId: user._id, token, tokenExpiration: 1 };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
