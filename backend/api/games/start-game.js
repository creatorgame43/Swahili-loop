// Start Game API
// POST /api/games/start

const PoolTablePro = require('../../games/pool-table/engine');
const QuizMaster = require('../../games/quiz/engine');
const TropicalCrush = require('../../games/tropical-crush/engine');
const { Blackjack, SimplifiedPoker } = require('../../games/card-masters/engine');

module.exports = async (req, res) => {
  try {
    const { userId, gameType, difficulty = 'easy' } = req.body;

    // Validate input
    if (!userId || !gameType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validGames = ['pool-table', 'quiz', 'tropical-crush', 'blackjack', 'poker'];
    if (!validGames.includes(gameType)) {
      return res.status(400).json({ error: 'Invalid game type' });
    }

    let game;
    let gameState;

    // Initialize game based on type
    switch (gameType) {
      case 'pool-table':
        game = new PoolTablePro({ mode: '8ball', width: 800, height: 400 });
        gameState = game.getGameState();
        break;

      case 'quiz':
        game = new QuizMaster({ difficulty, questionsPerGame: 10 });
        gameState = game.getGameState();
        break;

      case 'tropical-crush':
        game = new TropicalCrush({ level: 1, gridWidth: 8, gridHeight: 8 });
        gameState = game.getGameState();
        break;

      case 'blackjack':
        game = new Blackjack({ bet: 50, balance: 1000 });
        gameState = game.getGameState();
        break;

      case 'poker':
        game = new SimplifiedPoker({ playerCoins: 1000, bet: 50 });
        gameState = game.getGameState();
        break;
    }

    // Store game session
    const gameSession = {
      id: `game_${Date.now()}`,
      userId,
      gameType,
      difficulty,
      startTime: new Date(),
      state: gameState,
      isActive: true
    };

    // In production, save to database
    // await saveGameSession(gameSession);

    res.json({
      success: true,
      game: {
        sessionId: gameSession.id,
        gameType: gameType,
        difficulty: difficulty,
        state: gameState
      }
    });

  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game', details: error.message });
  }
};
