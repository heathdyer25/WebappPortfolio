import React from 'react';

const Stats = ({ user }) => {
  // Calculate Win/Loss ratio
  const winLoss = user.losses > 0 ? (user.wins / user.losses).toFixed(2) : 'N/A';

  return (
    <div className="stats">
      {/* Battles won */}
      <div className="stat-container col">
        <h2 className="stat-title">Battles Won</h2>
        <span className="stat">{user.wins}</span>
      </div>

      {/* Win/Loss ratio */}
      <div className="stat-container col">
        <h2 className="stat-title">W/L</h2>
        <span className="stat">{winLoss}</span>
      </div>

      {/* XP */}
      <div className="stat-container col">
        <h2 className="stat-title">XP</h2>
        <span className="stat">{user.xp}</span>
      </div>

      {/* Rank */}
      <div className="stat-container col">
        <h2 className="stat-title">Trophies</h2>
        <div className='row gap'>
          <span id="rank" className="stat">{user.rank}</span>
          <img src="images/icons/trophy.png" className="icon" alt="trophy" />
        </div>
      </div>
    </div>
  );
};

export default Stats;