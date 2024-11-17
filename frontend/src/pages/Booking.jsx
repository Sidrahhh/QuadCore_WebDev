import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Booking.css';

const Booking = () => {
  const { state } = useLocation(); // Get the activity data from navigation state
  const [formData, setFormData] = useState({
    name: '',  
    email: '',
    date: '',
    location: '',
    activity: state?.activity || '', // Set the selected activity
  });

  const [preBookings, setPreBookings] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBooking = () => {
    if (!formData.name || !formData.email || !formData.date || !formData.location) {
      alert('Please fill in all the fields.');
      return;
    }
    alert(`Booking Confirmed!\nName: ${formData.name}\nLocation: ${formData.location}\nActivity: ${formData.activity}`);
    console.log('Booking Details:', formData);
    setFormData({ name: '', email: '', date: '', location: '', activity: '' }); // Clear form
  };

  const handlePreBooking = () => {
    if (!formData.name || !formData.email || !formData.date || !formData.location) {
      alert('Please fill in all the fields.');
      return;
    }
    setPreBookings([...preBookings, formData]);
    alert('Added to Pre-Bookings!');
    setFormData({ name: '', email: '', date: '', location: '', activity: '' }); // Clear form
  };

  return (
    <div className="bookings-container">
      
      <form className="booking-form">
      <h3>Plan your journey by booking or pre-booking with us!</h3>

        {formData.activity && (
          <div className="activity-info">
            <strong>Activity:</strong> {formData.activity}
          </div>
        )}
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <div className="form-buttons">
          <button type="button" onClick={handleBooking} className="btn btn-booking">
            Confirm Booking
          </button>
          <button type="button" onClick={handlePreBooking} className="btn btn-prebooking">
            Add to Pre-Bookings
          </button>
        </div>
      </form>

      {preBookings.length > 0 && (
        <div className="prebookings-section">
          <h2>Pre-Bookings</h2>
          <ul className="prebookings-list">
            {preBookings.map((preBook, index) => (
              <li key={index}>
                <strong>Name:</strong> {preBook.name} | <strong>Location:</strong> {preBook.location} |{' '}
                <strong>Date:</strong> {preBook.date} | <strong>Activity:</strong> {preBook.activity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Booking;
