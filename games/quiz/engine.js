// 🧠 Quiz Master - Game Engine
// Multiple choice questions with scoring

class QuizMaster {
  constructor(config = {}) {
    this.difficulty = config.difficulty || 'easy'; // easy, medium, hard, expert
    this.questionsPerGame = config.questionsPerGame || 10;
    this.timePerQuestion = config.timePerQuestion || 30000; // ms
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.coinsEarned = 0;
    this.streak = 0;
    this.gameState = 'loading'; // loading, playing, finished
    this.answers = [];
    this.startTime = null;
    this.timeRemaining = this.timePerQuestion;
    this.loadQuestions();
  }

  loadQuestions() {
    // Question bank (can be extended with database)
    const allQuestions = [
      {
        id: 1,
        category: 'General Knowledge',
        difficulty: 'easy',
        question: 'Nchi ya Kenya iko katika kontina gani?',
        options: ['Asili', 'Eurasia', 'Amerika', 'Antarctica'],
        correct: 0,
        coinsReward: 10
      },
      {
        id: 2,
        category: 'General Knowledge',
        difficulty: 'easy',
        question: 'Kiongozi wa Zanzibar wa kwanza baada ya uhuru ni nani?',
        options: ['Abeid Karume', 'Amani Abeid Karume', 'Ali Hassan Mwinyi', 'Zanzibar Sultan'],
        correct: 0,
        coinsReward: 10
      },
      {
        id: 3,
        category: 'Technology',
        difficulty: 'medium',
        question: 'Java ni lugha ya programu iliyotengenezwa na nani?',
        options: ['Microsoft', 'Sun Microsystems', 'Apple', 'Google'],
        correct: 1,
        coinsReward: 20
      },
      {
        id: 4,
        category: 'Sports',
        difficulty: 'easy',
        question: 'Timu gani ya soka iko Dar es Salaam?',
        options: ['Simba SC', 'Young Africans', 'Mtibwa Premyo', 'Wazito FC'],
        correct: 1,
        coinsReward: 10
      },
      {
        id: 5,
        category: 'History',
        difficulty: 'hard',
        question: 'Tanzania iliundwa kwa muungano wa nchi zipi mbili?',
        options: ['Tanganyika na Pemba', 'Tanganyika na Zanzibar', 'Kenya na Uganda', 'Tanganyika na Rwanda'],
        correct: 1,
        coinsReward: 50
      },
      {
        id: 6,
        category: 'General Knowledge',
        difficulty: 'medium',
        question: 'Rais wa Tanzania ni mtu anayeitwa?',
        options: ['Samia Suluhu Hassan', 'Yoweri Museveni', 'Cyril Ramaphosa', 'Paul Kagame'],
        correct: 0,
        coinsReward: 20
      },
      {
        id: 7,
        category: 'Technology',
        difficulty: 'medium',
        question: 'Git ni nini?',
        options: ['Database', 'Version Control System', 'Operating System', 'Web Browser'],
        correct: 1,
        coinsReward: 20
      },
      {
        id: 8,
        category: 'Sports',
        difficulty: 'hard',
        question: 'Maajabu ya Dunia ni saba. Moja yao iko Afrika?',
        options: ['Ndiyo - Akropolis', 'Ndiyo - Piramidi za Giza', 'Ndiyo - Colosseum', 'Hapana'],
        correct: 1,
        coinsReward: 30
      },
      {
        id: 9,
        category: 'Culture',
        difficulty: 'easy',
        question: 'Mkate wa Zanzibar unaitwa nini?',
        options: ['Chapati', 'Mandazi', 'Urojo', 'Mshikaki'],
        correct: 2,
        coinsReward: 10
      },
      {
        id: 10,
        category: 'General Knowledge',
        difficulty: 'medium',
        question: 'Sauti kubwa zaidi ya wanyama ni ya?',
        options: ['Simba', 'Soko', 'Baobab', 'Babu haba'],
        correct: 0,
        coinsReward: 15
      }
    ];

    // Filter by difficulty
    const filtered = allQuestions.filter(q => 
      q.difficulty === this.difficulty || this.difficulty === 'all'
    );

    // Shuffle and select
    this.questions = filtered.sort(() => Math.random() - 0.5).slice(0, this.questionsPerGame);
    this.gameState = 'playing';
    this.startTime = Date.now();
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  answerQuestion(optionIndex) {
    if (this.gameState !== 'playing') return;

    const question = this.getCurrentQuestion();
    const isCorrect = optionIndex === question.correct;

    this.answers.push({
      questionId: question.id,
      selectedOption: optionIndex,
      correct: isCorrect,
      timeSpent: Date.now() - this.startTime
    });

    if (isCorrect) {
      this.score += question.coinsReward;
      this.coinsEarned += question.coinsReward;
      this.streak += 1;

      // Streak bonus
      if (this.streak % 5 === 0) {
        const bonusCoins = 25;
        this.coinsEarned += bonusCoins;
        this.score += bonusCoins;
      }
    } else {
      this.streak = 0;
    }

    this.currentQuestionIndex += 1;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.finishGame();
    } else {
      this.startTime = Date.now();
    }
  }

  skipQuestion() {
    this.streak = 0;
    this.currentQuestionIndex += 1;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.finishGame();
    }
  }

  finishGame() {
    this.gameState = 'finished';
    
    // Bonus for completing all questions
    this.coinsEarned += 50;
    
    // Accuracy bonus
    const correct = this.answers.filter(a => a.correct).length;
    const accuracy = (correct / this.answers.length) * 100;
    if (accuracy >= 80) {
      this.coinsEarned += 100;
    }
  }

  getGameState() {
    return {
      gameState: this.gameState,
      currentQuestion: this.currentQuestionIndex + 1,
      totalQuestions: this.questions.length,
      score: this.score,
      coinsEarned: this.coinsEarned,
      streak: this.streak,
      currentQuestionData: this.getCurrentQuestion(),
      answers: this.answers
    };
  }

  getStats() {
    const correct = this.answers.filter(a => a.correct).length;
    const accuracy = (correct / this.answers.length) * 100;

    return {
      totalQuestions: this.answers.length,
      correctAnswers: correct,
      wrongAnswers: this.answers.length - correct,
      accuracy: accuracy.toFixed(2),
      finalScore: this.score,
      totalCoins: this.coinsEarned,
      bestStreak: Math.max(...this.answers.map((_, i) => {
        let count = 1;
        for (let j = i + 1; j < this.answers.length; j++) {
          if (this.answers[j].correct) count++;
          else break;
        }
        return count;
      }), 0)
    };
  }
}

module.exports = QuizMaster;
