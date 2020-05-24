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

      return transformEvent(createdEvent);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
