const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Event = require("../../models/event");
const Booking = require("../../models/booking");

/**
 * Below we populate a user and array of events by recursive
 * One user can create many events but one event can only have one creator
 * The recursive is "control" by bind() and function-execute-on-call feature of GraphQL
 */
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
      date: Date(event.date),
      creator: populateUser.bind(this, event.creator),
    }));

    return populatedEvents;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
// This function below is to populate a single event
// We can use populateEvents function above with array of one ID, but just do like below make thing separately
const populateSingleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      date: Date(event.date),
      creator: populateUser.bind(this, event.creator),
    };
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
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => ({
        ...booking._doc,
        event: populateSingleEvent.bind(this, booking.event),
        user: populateUser.bind(this, booking.user),
      }));
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
  bookEvent: async ({ eventId }) => {
    try {
      const booking = new Booking({
        event: eventId,
        user: "5ec7b8ef0ad1ea2df5aaf72a",
      });
      const result = await booking.save();
      return {
        ...result._doc,
        event: populateSingleEvent.bind(this, result.event),
        user: populateUser.bind(this, result.user),
        createdAt: Date(result.createdAt),
        updatedAt: Date(result.updatedAt),
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const deletedBooking = await Booking.findByIdAndRemove(bookingId);
      return populateSingleEvent(deletedBooking.event);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
