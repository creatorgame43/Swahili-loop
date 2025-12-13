// 🎮 Swahili Loop - Main App Component
import React, { useState, useEffect } from 'react';
import './App.css';

// Mock Components
const GameSelectionScreen = ({ onSelectGame }) => (
  <div className="game-selection">
    <h1>🎮 Swahili Loop</h1>
    <p>Cheza, Pata Coins, Jiendeeza!</p>
    
    <div className="games-grid">
      <button onClick={() => onSelectGame('pool-table')} className="game-card">
        <div className="game-icon">🎱</div>
        <h3>Pool Table Pro</h3>
        <p>50-200 coins per win</p>
      </button>

      <button onClick={() => onSelectGame('quiz')} className="game-card">
        <div className="game-icon">🧠</div>
        <h3>Quiz Master</h3>
        <p>10-50 coins per question</p>
      </button>

      <button onClick={() => onSelectGame('tropical-crush')} className="game-card">
        <div className="game-icon">🍊</div>
        <h3>Tropical Crush</h3>
        <p>20-100 coins per level</p>
      </button>

      <button onClick={() => onSelectGame('card-masters')} className="game-card">
        <div className="game-icon">🃏</div>
        <h3>Card Masters</h3>
        <p>30-150 coins per game</p>
      </button>
    </div>
  </div>
);

const LeaderboardScreen = () => (
  <div className="leaderboard">
    <h2>🏆 Leaderboard</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Country</th>
          <th>Coins</th>
          <th>Wins</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>champion_mtoto 👨</td>
          <td>🇹🇿</td>
          <td>45,000</td>
          <td>342</td>
        </tr>
        <tr>
          <td>2</td>
          <td>quiz_master_juma 🧠</td>
          <td>🇰🇪</td>
          <td>38,500</td>
          <td>298</td>
        </tr>
        <tr>
          <td>3</td>
          <td>pool_pro_salim 🎱</td>
          <td>🇹🇿</td>
          <td>32,200</td>
          <td>267</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const WalletScreen = () => (
  <div className="wallet">
    <h2>💰 My Wallet</h2>
    <div className="wallet-card">
      <div className="balance">
        <h3>Total Coins</h3>
        <p>12,450</p>
      </div>
      <button className="btn-primary">Withdraw Coins</button>
    </div>
    
    <div className="transactions">
      <h3>Recent Transactions</h3>
      <ul>
        <li>+200 coins - Pool Table Win - 2 hours ago</li>
        <li>+150 coins - Quiz Master - 5 hours ago</li>
        <li>-500 coins - Withdrawal to M-Pesa - 1 day ago</li>
      </ul>
    </div>
  </div>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('games');
  const [userBalance, setUserBalance] = useState(12450);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">🎮 Swahili Loop</div>
        <div className="nav-items">
          <button onClick={() => setCurrentScreen('games')}>Games</button>
          <button onClick={() => setCurrentScreen('leaderboard')}>Leaderboard</button>
          <button onClick={() => setCurrentScreen('wallet')}>Wallet (💰 {userBalance})</button>
        </div>
      </nav>

      <main className="main-content">
        {currentScreen === 'games' && <GameSelectionScreen onSelectGame={(game) => console.log('Selected:', game)} />}
        {currentScreen === 'leaderboard' && <LeaderboardScreen />}
        {currentScreen === 'wallet' && <WalletScreen />}
      </main>

      <footer className="footer">
        <p>Made with ❤️ in Kenya | Powered by Kubiks Analytics</p>
      </footer>
    </div>
  );
}
