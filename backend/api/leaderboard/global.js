// Global Leaderboard API
// GET /api/leaderboard/global

module.exports = async (req, res) => {
  try {
    const { limit = 100, period = 'all-time' } = req.query;

    // Mock leaderboard data (in production: fetch from database)
    const leaderboard = [
      {
        rank: 1,
        username: 'champion_mtoto',
        avatar: '👨',
        totalCoins: 45000,
        gamesWon: 342,
        country: 'Tanzania',
        joinDate: '2024-01-15'
      },
      {
        rank: 2,
        username: 'quiz_master_juma',
        avatar: '🧠',
        totalCoins: 38500,
        gamesWon: 298,
        country: 'Kenya',
        joinDate: '2024-02-10'
      },
      {
        rank: 3,
        username: 'pool_pro_salim',
        avatar: '🎱',
        totalCoins: 32200,
        gamesWon: 267,
        country: 'Tanzania',
        joinDate: '2024-01-20'
      },
      {
        rank: 4,
        username: 'crush_queen_amina',
        avatar: '👩',
        totalCoins: 28900,
        gamesWon: 245,
        country: 'Tanzania',
        joinDate: '2024-02-01'
      },
      {
        rank: 5,
        username: 'card_master_ali',
        avatar: '🃏',
        totalCoins: 25600,
        gamesWon: 198,
        country: 'Uganda',
        joinDate: '2024-02-05'
      }
    ];

    // Filter by period
    let filteredLeaderboard = leaderboard;
    
    if (period === 'weekly') {
      filteredLeaderboard = leaderboard.map(player => ({
        ...player,
        weeklyCoins: Math.floor(Math.random() * 5000)
      }));
    }

    // Slice by limit
    const result = filteredLeaderboard.slice(0, parseInt(limit));

    res.json({
      success: true,
      leaderboard: {
        period,
        totalPlayers: 15234,
        topPlayers: result,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
