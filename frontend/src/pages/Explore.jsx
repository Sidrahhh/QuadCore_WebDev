import React from "react";
import { Link } from "react-router-dom";
import "./Explore.css"; // Add styles in a separate CSS file

const Explore = () => {
  const categories = [
    {
      id: 1,
      name: "Food",
      description: "Discover the best local cuisine.",
      path: "/food",
    },
    {
      id: 2,
      name: "Activities",
      description: "Explore fun activities in the area.",
      path: "/activities",
    },
    {
      id: 3,
      name: "Landmarks",
      description: "Visit famous local landmarks.",
      path: "/landmarks",
    },
    {
      id: 4,
      name: "Guided Tours",
      description: "Book tours with expert guides.",
      path: "/guided-tours",
    },
  ];

  return (
    <div className="full-explore">
      <h1>Location</h1>
      <div className="weather">Weather Information</div>
      <div className="explore-container">
        <h1>Explore Local Highlights</h1>
        <div className="explore-cards">
          {categories.map((category) => (
            <Link key={category.id} to={category.path} className="explore-card">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
