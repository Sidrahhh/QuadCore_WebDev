import React from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const users = [
    { name: "cymzoom", score: 100 },
    { name: "b1", score: 50 },
    { name: "c", score: 50 },
    { name: "C1", score: 50 },
    { name: "Cynthia", score: 30 },
  ];

  // Generate initials for each user
  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0].toUpperCase());
    return initials.join("");
  };

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <div className="leaderboard-container">
        {users.map((user, index) => (
          <div
            key={index}
            className={`leaderboard-item ${
              index === 0
                ? "first-place"
                : index === 1
                ? "second-place"
                : index === 2
                ? "third-place"
                : ""
            }`}
          >
            <div className="avatar-container">
              <div className="avatar-placeholder">
                {getInitials(user.name)}
              </div>
              <div className="badge">{index + 1}</div>
            </div>
            <div className="info">
              <h2 className="name">{user.name}</h2>
              <p className="score">{user.score} points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
