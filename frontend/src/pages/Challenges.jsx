import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Challenges.css';

const Challenges = () => {
  const navigate = useNavigate(); // Initialize navigation hook

  // Mock data for challenges
  const [challenges, setChallenges] = useState([
    { id: 1, title: "Visit 5 Heritage Sites", points: 50, completed: false, type: "landmark" },
    { id: 2, title: "Explore 3 Local Restaurants", points: 30, completed: false, type: "food" },
    { id: 3, title: "Attend a Local Festival", points: 20, completed: false, type: "event" },
  ]);

  const [badges, setBadges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // Example of fetching user data from backend
    // fetch('/api/user-progress').then(response => response.json()).then(data => {
    //   setChallenges(data.challenges);
    //   setUserPoints(data.points);
    //   setBadges(data.badges);
    // });
  }, []);

  const openChallengePage = (challenge) => {
    if (challenge.type === "landmark") {
      navigate('/landmarks', { state: { challenge } });
    } else if (challenge.type === "food") {
      navigate('/food', { state: { challenge } });
    } else if (challenge.type === "event") {
      navigate('/events', { state: { challenge } });
    } else {
      console.error("Unknown challenge type:", challenge.type);
    }
  };

  const completeChallenge = (id) => {
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.id === id && !challenge.completed) {
        setUserPoints((prev) => prev + challenge.points);
        unlockBadge(challenge.title);
        return { ...challenge, completed: true };
      }
      return challenge;
    });
    setChallenges(updatedChallenges);
  };

  const unlockBadge = (challengeTitle) => {
    const badge = `🏅 Badge: ${challengeTitle}`;
    setBadges((prevBadges) => [...prevBadges, badge]);
  };

  return (
    <div className="challenges-container">
      <h1>Your Challenges</h1>
      <div className="user-info">
        <p>Total Points: <strong>{userPoints}</strong></p>
        <div className="badges">
          <h3>Your Badges</h3>
          {badges.length > 0 ? (
            badges.map((badge, index) => <p key={index}>{badge}</p>)
          ) : (
            <p>No badges yet. Start exploring!</p>
          )}
        </div>
      </div>

      <div className="challenges-list">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`challenge-card ${challenge.completed ? 'completed' : ''}`}
            onClick={() => openChallengePage(challenge)} // Handle click to navigate
          >
            <h3>{challenge.title}</h3>
            <p>Points: {challenge.points}</p>
            <button
              onClick={() => completeChallenge(challenge.id)}
              disabled={challenge.completed}
            >
              {challenge.completed ? "Completed" : "Start Challenge"}
            </button>
          </div>
        ))}
      </div>

      <Link to="/leaderboard">
        <button className="start-button">Leaderboard</button>
      </Link>
    </div>
  );
};

export default Challenges;
