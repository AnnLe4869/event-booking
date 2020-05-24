const User = require("../../models/user");
const Event = require("../../models/event");

const transformEvent = (event) => ({
  ...event._doc,
  date: Date(event.date),
  creator: populateUser.bind(this, event.creator),
});
const transformBooking = (booking) => ({
  ...booking._doc,
  event: populateSingleEvent.bind(this, booking.event),
  user: populateUser.bind(this, booking.user),
  createdAt: Date(booking.createdAt),
  updatedAt: Date(booking.updatedAt),
});

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
    return events.map((event) => transformEvent(event));
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
    return transformEvent(event);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { transformEvent, transformBooking };
