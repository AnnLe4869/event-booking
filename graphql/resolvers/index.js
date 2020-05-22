const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Event = require("../../models/event");

const populateUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      password: null,
      createdEvents: populateEvents.bind(this, user.createdEvents),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const populateEvents = async (eventIds) => {
  try {
    const events = await Event.find({
      _id: {
        $in: eventIds,
      },
    });
    const populatedEvents = events.map((event) => ({
      ...event._doc,
      date: Date(event.date).toString(),
      creator: populateUser.bind(this, event.creator),
    }));

    return populatedEvents;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      const populatedEvents = populateEvents(events.map((event) => event._id));
      return populatedEvents;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    try {
      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
      });
      event.creator = "5ec62298041d321859216b30";
      const createdEvent = await event.save();

      const user = await User.findById(createdEvent.creator);
      if (!user) throw new Error("User cannot found");
      user.createdEvents.push(createdEvent);
      await user.save();

      return {
        ...createdEvent._doc,
        creator: populateUser.bind(this, user._id),
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
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
