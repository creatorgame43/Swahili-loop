// Earn Coins API
// POST /api/coins/earn

module.exports = async (req, res) => {
  try {
    const { userId, gameType, coinsEarned, gameScore, duration } = req.body;

    if (!userId || !gameType || coinsEarned === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate coins (prevent abuse)
    if (coinsEarned < 0 || coinsEarned > 500) {
      return res.status(400).json({ error: 'Invalid coin amount' });
    }

    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'earn',
      gameType,
      amount: coinsEarned,
      source: 'game_completion',
      metadata: {
        score: gameScore,
        duration,
        timestamp: new Date(),
        verified: true
      }
    };

    // In production: Save to database, update user balance
    // await createTransaction(transaction);
    // await updateUserBalance(userId, coinsEarned);

    res.json({
      success: true,
      transaction: {
        id: transaction.id,
        coinsAdded: coinsEarned,
        newBalance: 1000 + coinsEarned, // Mock balance
        gameType,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Error earning coins:', error);
    res.status(500).json({ error: 'Failed to process coin earning', details: error.message });
  }
};
