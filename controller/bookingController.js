const { Booking } = require('../models');

// Function to create a booking
async function createBooking(req, res) {
  try {
    const {
      UserID,
      ServiceID,
      DriverID,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
      bookingStatus,
      bookingDate,
      seatType,
      userContactNumber,
      seatAmount,
      totalFare
    } = req.body;

    // Create the booking
    const booking = await Booking.create({
      UserID,
      ServiceID,
      DriverID,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
      bookingStatus,
      bookingDate,
      seatType,
      userContactNumber,
      seatAmount,
      totalFare
    });

    // Return success response
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to get all bookings
async function getAllBookings(req, res) {
  try {
    // Find all bookings
    const bookings = await Booking.findAll();

    // Return bookings
    res.json(bookings);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to get a single booking by ID
async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    // Find the booking by ID
    const booking = await Booking.findByPk(id);

    // If booking not found
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Return booking
    res.json(booking);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to update a booking by ID
async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const {
      UserID,
      ServiceID,
      DriverID,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
      bookingStatus,
      bookingDate,
      seatType,
      userContactNumber,
      seatAmount,
      totalFare
    } = req.body;

    // Find the booking by ID
    let booking = await Booking.findByPk(id);

    // If booking not found
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update booking information
    booking = await booking.update({
      UserID,
      ServiceID,
      DriverID,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
      bookingStatus,
      bookingDate,
      seatType,
      userContactNumber,
      seatAmount,
      totalFare
    });

    // Return success response
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to delete a booking by ID
async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    // Find the booking by ID
    const booking = await Booking.findByPk(id);

    // If booking not found
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete booking
    await booking.destroy();

    // Return success response
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking };
