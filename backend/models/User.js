// User Model
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.username = data.username;
    this.email = data.email;
    this.phone = data.phone;
    this.passwordHash = data.passwordHash;
    this.profile = {
      avatar: data.avatar || null,
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio || '',
      level: data.level || 1,
      joinDate: data.joinDate || new Date(),
      country: data.country || 'Tanzania'
    };
    this.wallet = {
      coins: data.coins || 0,
      totalEarned: data.totalEarned || 0,
      totalWithdrawn: data.totalWithdrawn || 0
    };
    this.stats = {
      gamesPlayed: data.gamesPlayed || 0,
      gamesWon: data.gamesWon || 0,
      totalPlayTime: data.totalPlayTime || 0,
      bestScore: data.bestScore || 0
    };
    this.preferences = {
      language: data.language || 'sw',
      notifications: data.notifications !== false,
      sound: data.sound !== false,
      difficulty: data.difficulty || 'medium'
    };
    this.status = data.status || 'active'; // active, banned, suspended
  }

  addCoins(amount, source = 'game') {
    this.wallet.coins += amount;
    this.wallet.totalEarned += amount;
    return {
      previousBalance: this.wallet.coins - amount,
      newBalance: this.wallet.coins,
      added: amount,
      source
    };
  }

  removeCoins(amount, reason = 'withdrawal') {
    if (this.wallet.coins < amount) {
      throw new Error('Insufficient coins');
    }
    this.wallet.coins -= amount;
    this.wallet.totalWithdrawn += amount;
    return {
      previousBalance: this.wallet.coins + amount,
      newBalance: this.wallet.coins,
      deducted: amount,
      reason
    };
  }

  updateStats(gameData) {
    this.stats.gamesPlayed += 1;
    if (gameData.won) {
      this.stats.gamesWon += 1;
    }
    this.stats.totalPlayTime += gameData.duration || 0;
    if (gameData.score > this.stats.bestScore) {
      this.stats.bestScore = gameData.score;
    }
  }

  getWinRate() {
    if (this.stats.gamesPlayed === 0) return 0;
    return ((this.stats.gamesWon / this.stats.gamesPlayed) * 100).toFixed(2);
  }

  getProfileData() {
    return {
      id: this.id,
      username: this.username,
      profile: this.profile,
      wallet: this.wallet,
      stats: this.stats,
      winRate: this.getWinRate()
    };
  }
}

module.exports = User;
