const User = require("../../models/user");
const Event = require("../../models/event");

const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => transformEvent(event));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  createEvent: async (
    { eventInput: { title, description, price, date } },
    req
  ) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
      });
      event.creator = req.userId;
      const createdEvent = await event.save();

      const user = await User.findById(createdEvent.creator);
      if (!user) throw new Error("User cannot found");
      user.createdEvents.push(createdEvent);
      await user.save();

      return transformEvent(createdEvent);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
