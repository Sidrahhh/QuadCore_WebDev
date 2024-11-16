import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".hidden");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    };

    // Trigger the scroll handler on page load and scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="homepage">
      {/* Top content */}
      <img src="/local.png" alt="Local Vibes Logo" className="logo" />

      {/* Diagonal Video */}
      <video
        className="diagonal-image"
        autoPlay
        loop
        muted
        playsInline
        src="/bea.mp4" /* Path to your video */
      ></video>

      <div className="content">
        <h1>Welcome to Local Vibes!</h1>
        <p>Discover the beauty and charm of local experiences.</p>
        <Link to="/login-signup"> {/* Updated to the login-signup path */}
          <button className="start-button">Where to next?</button>
        </Link>
      </div>

      {/* Additional content */}
      <div className="additional-content hidden">
        <h2>From here, to everywhere</h2>
        <div className="image-boxes">
          <div className="image-box">
            <img src="/city.jpg" alt="City Scene" />
          </div>
          <div className="image-box">
            <img src="/mountain.png" alt="Mountain Scene" />
          </div>
          <div className="image-box">
            <img src="/forest.jpg" alt="Forest Scene" />
          </div>
        </div>
        <div className="text-box">
          <p>
            Discover a world of local experiences like never before with Local
            Vibes. Whether you're a seasoned traveler or exploring a new
            destination, our app provides real-time recommendations tailored just
            for you. From must-try cuisines to hidden gems, iconic landmarks to
            unique local products, Local Vibes ensures you make the most of your
            journey.
          </p>
        </div>
        <div className="text-box">
          <h2>Explore More About Us!</h2>
          {/* Social Media Links */}
          <div className="social-links">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
