const DataLoader = require("dataloader");
const User = require("../../models/user");
const Event = require("../../models/event");

const eventLoader = new DataLoader((eventIds) => {
  return populateEvents(eventIds);
});
const userLoader = new DataLoader((userIds) => {
  return User.find({
    _id: {
      $in: userIds,
    },
  });
});

/**
 * Below we populate a user and array of events by recursive
 * One user can create many events but one event can only have one creator
 * The recursive is "control" by bind() and function-execute-on-call feature of GraphQL
 */
const populateUser = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      password: null,
      createdEvents: () => eventLoader.loadMany(user.createdEvents),
    };
  } catch (err) {
    console.log("Error in populating user");
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
    // We have to sort here because $in doesn't guarantee the order of the resulting array
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map((event) => transformEvent(event));
  } catch (err) {
    console.log("Error in populating event");
    console.error(err);
    throw err;
  }
};
// This function below is to populate a single event
// We can use populateEvents function above with array of one ID, but just do like below make thing separately
const populateSingleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

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

module.exports = { transformEvent, transformBooking };
