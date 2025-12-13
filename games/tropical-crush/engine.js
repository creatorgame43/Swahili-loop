// 🍊 Tropical Crush - Match 3 Game Engine
// Candy Crush style game with tropical fruits

class TropicalCrush {
  constructor(config = {}) {
    this.gridWidth = config.gridWidth || 8;
    this.gridHeight = config.gridHeight || 8;
    this.level = config.level || 1;
    this.score = 0;
    this.coinsEarned = 0;
    this.moves = 25 + (this.level * 3);
    this.movesRemaining = this.moves;
    this.targetScore = 1000 + (this.level * 500);
    this.gameState = 'playing'; // playing, levelUp, gameOver
    this.grid = [];
    this.selectedCell = null;
    this.combo = 0;
    this.powerUps = [];
    this.initializeGrid();
  }

  // Fruit types
  fruitTypes = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍓'];

  initializeGrid() {
    for (let y = 0; y < this.gridHeight; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        this.grid[y][x] = {
          fruit: this.getRandomFruit(),
          x,
          y,
          matched: false,
          powerUp: null
        };
      }
    }
  }

  getRandomFruit() {
    return this.fruitTypes[Math.floor(Math.random() * this.fruitTypes.length)];
  }

  selectCell(x, y) {
    if (!this.isValidCell(x, y)) return;

    // If first selection or adjacent
    if (!this.selectedCell) {
      this.selectedCell = { x, y };
    } else {
      // Check if adjacent
      const distance = Math.abs(this.selectedCell.x - x) + Math.abs(this.selectedCell.y - y);
      if (distance === 1) {
        this.swap(this.selectedCell.x, this.selectedCell.y, x, y);
        this.selectedCell = null;
        this.movesRemaining -= 1;
        this.processMatches();
      } else {
        this.selectedCell = { x, y };
      }
    }
  }

  isValidCell(x, y) {
    return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
  }

  swap(x1, y1, x2, y2) {
    const temp = this.grid[y1][x1].fruit;
    this.grid[y1][x1].fruit = this.grid[y2][x2].fruit;
    this.grid[y2][x2].fruit = temp;
  }

  processMatches() {
    let found = true;
    let matchCount = 0;

    while (found) {
      found = false;

      // Check horizontal matches
      for (let y = 0; y < this.gridHeight; y++) {
        for (let x = 0; x < this.gridWidth - 2; x++) {
          const fruit = this.grid[y][x].fruit;
          if (
            fruit === this.grid[y][x + 1].fruit &&
            fruit === this.grid[y][x + 2].fruit
          ) {
            this.grid[y][x].matched = true;
            this.grid[y][x + 1].matched = true;
            this.grid[y][x + 2].matched = true;
            found = true;
            matchCount += 3;
          }
        }
      }

      // Check vertical matches
      for (let x = 0; x < this.gridWidth; x++) {
        for (let y = 0; y < this.gridHeight - 2; y++) {
          const fruit = this.grid[y][x].fruit;
          if (
            fruit === this.grid[y + 1][x].fruit &&
            fruit === this.grid[y + 2][x].fruit
          ) {
            this.grid[y][x].matched = true;
            this.grid[y + 1][x].matched = true;
            this.grid[y + 2][x].matched = true;
            found = true;
            matchCount += 3;
          }
        }
      }

      if (found) {
        this.removeMatches();
        this.applyGravity();
        this.combo += 1;
      }
    }

    if (matchCount > 0) {
      this.addScore(matchCount);
      this.checkLevelComplete();
    }
  }

  removeMatches() {
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.grid[y][x].matched) {
          this.grid[y][x].fruit = null;
          this.grid[y][x].matched = false;
        }
      }
    }
  }

  applyGravity() {
    for (let x = 0; x < this.gridWidth; x++) {
      let writeIndex = this.gridHeight - 1;

      for (let y = this.gridHeight - 1; y >= 0; y--) {
        if (this.grid[y][x].fruit !== null) {
          this.grid[writeIndex][x].fruit = this.grid[y][x].fruit;
          if (writeIndex !== y) {
            this.grid[y][x].fruit = null;
          }
          writeIndex--;
        }
      }

      // Fill empty spaces from top
      for (let y = 0; y <= writeIndex; y++) {
        this.grid[y][x].fruit = this.getRandomFruit();
      }
    }
  }

  addScore(matchCount) {
    const basePoints = matchCount * 10;
    const comboMultiplier = this.combo * 1.2;
    const points = Math.floor(basePoints * comboMultiplier);

    this.score += points;
    this.coinsEarned += Math.floor(points / 10);

    if (this.combo >= 5) {
      this.coinsEarned += 50; // Combo bonus
    }
  }

  checkLevelComplete() {
    if (this.score >= this.targetScore) {
      this.levelUp();
    } else if (this.movesRemaining <= 0) {
      this.gameState = 'gameOver';
    }
  }

  levelUp() {
    this.level += 1;
    this.gameState = 'levelUp';
    this.coinsEarned += 200 + (this.level * 50);
    
    // Reset for next level
    this.targetScore = 1000 + (this.level * 500);
    this.moves = 25 + (this.level * 3);
    this.movesRemaining = this.moves;
    this.combo = 0;
    this.gameState = 'playing';
  }

  getGameState() {
    return {
      gameState: this.gameState,
      level: this.level,
      score: this.score,
      coinsEarned: this.coinsEarned,
      movesRemaining: this.movesRemaining,
      targetScore: this.targetScore,
      combo: this.combo,
      grid: this.grid,
      selectedCell: this.selectedCell
    };
  }
}

module.exports = TropicalCrush;
