// 🎱 Pool Table Pro - Game Engine
// 3D Pool game with realistic physics

class PoolTablePro {
  constructor(config = {}) {
    this.width = config.width || 800;
    this.height = config.height || 400;
    this.friction = config.friction || 0.98;
    this.balls = [];
    this.pocketedBalls = [];
    this.score = 0;
    this.coinsEarned = 0;
    this.gameMode = config.mode || '8ball'; // 8ball or 9ball
    this.gameState = 'aiming'; // aiming, shooting, playing
    this.cueAngle = 0;
    this.cuePower = 0;
    this.initializeBalls();
  }

  initializeBalls() {
    // Cue ball (white)
    this.cueBall = {
      x: 100,
      y: this.height / 2,
      radius: 8,
      vx: 0,
      vy: 0,
      mass: 1,
      color: '#fff'
    };

    // Rack 15 balls
    const colors = ['#f00', '#f00', '#00f', '#00f', '#ffff00', '#000'];
    let ballIndex = 0;
    const rackX = 600;
    const rackY = this.height / 2;
    const ballRadius = 8;
    const spacing = ballRadius * 2.1;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const x = rackX + row * spacing;
        const y = rackY + (col - row / 2) * spacing;
        const color = colors[ballIndex % colors.length];

        this.balls.push({
          x,
          y,
          radius: ballRadius,
          vx: 0,
          vy: 0,
          mass: 1,
          color,
          number: ballIndex + 1,
          pocketed: false
        });
        ballIndex++;
      }
    }
  }

  updateCueAngle(angle) {
    this.cueAngle = angle;
  }

  updateCuePower(power) {
    this.cuePower = Math.min(power, 100);
  }

  shoot() {
    if (this.gameState !== 'aiming') return;

    const power = this.cuePower / 100;
    const speed = 15 * power;

    this.cueBall.vx = Math.cos(this.cueAngle) * speed;
    this.cueBall.vy = Math.sin(this.cueAngle) * speed;

    this.gameState = 'playing';
    this.coinsEarned += 2;
  }

  update(deltaTime) {
    if (this.gameState !== 'playing') return;

    // Move cue ball
    this.moveBall(this.cueBall, deltaTime);

    // Move all balls
    this.balls.forEach(ball => {
      if (!ball.pocketed) {
        this.moveBall(ball, deltaTime);
      }
    });

    // Check collisions
    this.checkBallCollisions();
    this.checkPockets();

    // Check if game is finished
    if (this.isGameFinished()) {
      this.gameState = 'finished';
      this.calculateScore();
    }
  }

  moveBall(ball, dt) {
    ball.vx *= this.friction;
    ball.vy *= this.friction;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Wall collision
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx *= -0.8;
    }
    if (ball.x + ball.radius > this.width) {
      ball.x = this.width - ball.radius;
      ball.vx *= -0.8;
    }
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy *= -0.8;
    }
    if (ball.y + ball.radius > this.height) {
      ball.y = this.height - ball.radius;
      ball.vy *= -0.8;
    }
  }

  checkBallCollisions() {
    // Cue ball vs other balls
    this.balls.forEach(ball => {
      if (!ball.pocketed) {
        this.checkBallCollision(this.cueBall, ball);
      }
    });

    // Ball vs ball
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        if (!this.balls[i].pocketed && !this.balls[j].pocketed) {
          this.checkBallCollision(this.balls[i], this.balls[j]);
        }
      }
    }
  }

  checkBallCollision(ball1, ball2) {
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = ball1.radius + ball2.radius;

    if (distance < minDist) {
      const angle = Math.atan2(dy, dx);
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      // Swap velocities
      const vx1 = ball1.vx * cos + ball1.vy * sin;
      const vy1 = ball1.vy * cos - ball1.vx * sin;
      const vx2 = ball2.vx * cos + ball2.vy * sin;
      const vy2 = ball2.vy * cos - ball2.vx * sin;

      ball1.vx = vx2 * cos - vy1 * sin;
      ball1.vy = vy1 * cos + vx2 * sin;
      ball2.vx = vx1 * cos - vy2 * sin;
      ball2.vy = vy2 * cos + vx1 * sin;

      // Separate balls
      const overlap = (minDist - distance) / 2;
      ball1.x -= overlap * cos;
      ball1.y -= overlap * sin;
      ball2.x += overlap * cos;
      ball2.y += overlap * sin;

      this.coinsEarned += 5;
    }
  }

  checkPockets() {
    const pockets = [
      { x: 0, y: 0 },
      { x: this.width / 2, y: 0 },
      { x: this.width, y: 0 },
      { x: 0, y: this.height },
      { x: this.width / 2, y: this.height },
      { x: this.width, y: this.height }
    ];

    this.balls.forEach(ball => {
      if (ball.pocketed) return;

      pockets.forEach(pocket => {
        const dx = ball.x - pocket.x;
        const dy = ball.y - pocket.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          ball.pocketed = true;
          ball.vx = 0;
          ball.vy = 0;
          this.pocketedBalls.push(ball);
          this.coinsEarned += 10;
        }
      });
    });

    // Check cue ball in pocket
    pockets.forEach(pocket => {
      const dx = this.cueBall.x - pocket.x;
      const dy = this.cueBall.y - pocket.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20) {
        this.gameState = 'scratch';
        this.coinsEarned -= 20;
      }
    });
  }

  isGameFinished() {
    const pocketedCount = this.pocketedBalls.length;
    return pocketedCount === 15; // All balls pocketed except cue
  }

  calculateScore() {
    this.score = this.pocketedBalls.length * 10;
    if (this.gameState === 'finished') {
      this.coinsEarned += 100; // Bonus for completing game
    }
  }

  getGameState() {
    return {
      gameState: this.gameState,
      score: this.score,
      coinsEarned: this.coinsEarned,
      pocketedCount: this.pocketedBalls.length,
      cueBall: this.cueBall,
      balls: this.balls,
      cueAngle: this.cueAngle,
      cuePower: this.cuePower
    };
  }
}

module.exports = PoolTablePro;
