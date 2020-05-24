const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => transformBooking(booking));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const booking = new Booking({
        event: eventId,
        user: req.userId,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const deletedBooking = await Booking.findByIdAndRemove(
        bookingId
      ).populate("event");
      return transformEvent(deletedBooking.event);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
