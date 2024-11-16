import React, { useState } from 'react';

const Booking = () => {
  const [name, setName] = useState('');
  const [tourDate, setTourDate] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    alert(`Booking for ${name} on ${tourDate}`);
  };

  return (
    <div>
      <h1>Book Your Tour</h1>
      <form onSubmit={handleBooking}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Tour Date:</label>
          <input type="date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} />
        </div>
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default Booking;
