const bcrypt = require("bcryptjs");
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
};
