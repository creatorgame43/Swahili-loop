# 🎮 Swahili Loop - Multi-Game Platform

> **Cheza, Pata Coins, Jiendeeza!** | Play games, earn coins, withdraw real money!

🇹🇿 **Made in Tanzania** | Payment: Vodacom • Tigo • Airtel • Halotel

---

## 📱 Platform Overview

**Swahili Loop** ni platform ya mobile gaming iliyotengenezwa Tanzania, ambapo watumiaji wanacheza magemu mengi, wanapata coins, na wanapoweza kubadilisha coins kuwa pesa halisi kwa njia ya voucher.

**Target**: 15,000 coins = 500 TZS

---

## 🎯 Games Available

### 1. 🎱 **Pool Table Pro**
- 3D pool game na physics halisi
- 8-ball & 9-ball modes
- **Coins per win**: 50-200 coins
- Muonekano wa kisasa

### 2. 🧠 **Quiz Master**
- 500+ maswali kuhusu:
  - General Knowledge
  - Sports
  - Technology
  - Culture & History
- 4 difficulty levels
- **Coins per answer**: 10-50 coins

### 3. 🍊 **Tropical Crush**
- Match 3 game (kama Candy Crush)
- 100+ levels na power-ups
- Daily leaderboard
- **Coins per level**: 20-100 coins

### 4. 🃏 **Card Masters**
- Blackjack vs AI
- Simplified Poker multiplayer
- Solitaire variants
- **Coins per game**: 30-150 coins

---

## 💰 Payment System

### 🇹🇿 Supported Operators (Tanzania)

| Operator | Phone Prefix | Status |
|----------|-------------|--------|
| **Vodacom** 📱 | 0655-0659 | ✅ Active |
| **Tigo** 📱 | 0672-0676 | ✅ Active |
| **Airtel** 📱 | 0680-0684 | ✅ Active |
| **Halotel** 📱 | 0690-0694 | ✅ Active |

### 💵 Withdrawal via Voucher

**Process**:
1. User selects **Withdraw** → Enter coins amount
2. System detects operator from phone number
3. Generates unique **voucher code**
4. User receives voucher to redeem on operator app
5. Money credited to phone within minutes

**Conversion Rate**: 30 TZS = 1 coin
- Minimum: 5,000 coins (150,000 TZS)
- Maximum: Unlimited

**Voucher Validity**: 24 hours

### 📊 Payment Flow

```
Play Games → Earn Coins → Request Withdrawal
    ↓           ↓              ↓
  +10 coins  +200 coins    15,000 coins
    ↓           ↓              ↓
  Tally      Cumulative    500 TZS
    ↓           ↓              ↓
  Total → 15,000 → Voucher Generated
                        ↓
                   User Redeems
                   (on operator app)
                        ↓
                   💰 Pesa Inapokea!
```

---

## 🔐 Authentication & Registration

### Registration Flow

**New users register with**:
- ✅ First Name (Jina la Kwanza)
- ✅ Last Name (Jina la Mwisho)
- ✅ Email
- ✅ Phone Number (Auto-detect country)
- ✅ Country (Tanzania, Kenya, Uganda, Burundi)
- ✅ Password

**Country Detection**:
- **🇹🇿 Tanzania**: +255 (0655-0659, 0672-0676, etc.)
- **🇰🇪 Kenya**: +254
- **🇺🇬 Uganda**: +256
- **🇧🇮 Burundi**: +257

System automatically detects country from phone number prefix.

---

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js** - Server
- **MongoDB/PostgreSQL** - Database
- **Socket.io** - Real-time multiplayer
- **JWT** - Authentication
- **Payment APIs** - Vodacom, Tigo, Airtel, Halotel

### Frontend
- **React.js** - Web version
- **React Native / Flutter** - Mobile app
- **Phaser.js** - Game engine

### DevOps & Monitoring
- **Vercel/AWS** - Hosting
- **Kubiks** - Observability & Real-time Analytics
- **Docker** - Containerization

---

## 📁 Project Structure

```
swahili-loop/
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   │   └── register.js (Country detection, validation)
│   │   ├── games/
│   │   │   └── start-game.js
│   │   ├── coins/
│   │   │   ├── earn.js
│   │   │   └── withdraw-voucher.js (Vodacom, Tigo, Airtel, Halotel)
│   │   ├── leaderboard/
│   │   └── payments/
│   ├── models/
│   │   └── User.js
│   ├── config/
│   │   └── payment-providers.js (Operator detection, voucher generation)
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── web/
│   │   ├── Register.jsx (Country + phone detection)
│   │   ├── WithdrawVoucher.jsx (Voucher generation & display)
│   │   ├── App.jsx
│   │   └── App.css
│   └── mobile/
├── games/
│   ├── pool-table/
│   ├── quiz/
│   ├── tropical-crush/
│   └── card-masters/
└── monitoring/
    └── instrumentation.js (Kubiks integration)
```

---

## 🚀 Quick Start

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend/web
npm install
npm start
```

### Environment Variables

```bash
# .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swahili-loop
JWT_SECRET=your_secret_key
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.kubiks.app
OTEL_EXPORTER_OTLP_HEADERS=x-kubiks-key=YOUR_API_KEY
```

---

## 📊 Monitoring (Kubiks)

Real-time tracking with Kubiks:
- **Game Performance**: FPS, load times, crashes
- **User Engagement**: Daily/Monthly active users
- **Payment Tracking**: Withdrawal success rate, voucher redemptions
- **Error Detection**: Game crashes, API failures
- **Analytics**: Top games, player retention, revenue

---

## 📈 API Endpoints

### Authentication
```
POST /api/auth/register       - User registration (country detection)
POST /api/auth/login          - User login
GET  /api/user/profile        - Get user profile
```

### Games
```
POST /api/games/start         - Start a new game
POST /api/games/finish        - Finish game & earn coins
GET  /api/games/list          - List available games
```

### Coins
```
POST /api/coins/earn          - Record coin earning from game
POST /api/coins/withdraw-voucher  - Generate voucher for withdrawal
GET  /api/coins/balance       - Get user coin balance
```

### Leaderboard
```
GET /api/leaderboard/global   - Global rankings
GET /api/leaderboard/game/:id - Game-specific leaderboard
GET /api/leaderboard/weekly   - Weekly rankings
```

---

## 🎨 UI/UX Features

✅ **Multi-language**: Swahili + English
✅ **Dark Mode**: Eye-friendly design
✅ **Responsive**: Works on all devices
✅ **Fast Loading**: <2s page load
✅ **Offline Support**: Play games offline
✅ **Push Notifications**: Game alerts, payment confirmations

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Input validation
- ✅ HTTPS everywhere
- ✅ Phone number verification
- ✅ Voucher encryption

---

## 📝 Roadmap

- [x] 4 core games (Pool Table, Quiz, Tropical Crush, Card Masters)
- [x] Registration with country detection
- [x] Coin earning system
- [x] Voucher-based withdrawal (Vodacom, Tigo, Airtel, Halotel)
- [ ] Multiplayer tournaments
- [ ] In-game chat
- [ ] Referral system (earn coins per friend)
- [ ] Daily/Weekly challenges
- [ ] Seasonal events & rewards
- [ ] Live streaming integration
- [ ] Esports tournaments
- [ ] Community features

---

## 📞 Support

- 📧 **Email**: support@swahililoop.com
- 💬 **Discord**: [Join Community](#)
- 🐛 **Issues**: [GitHub Issues](#)
- 📱 **WhatsApp**: [Contact Us](#)

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

---

## 🙏 Acknowledgments

- **Game Assets**: Free Game Assets
- **Icons**: Feather Icons
- **Monitoring**: [Kubiks](https://kubiks.ai) 📊
- **Made in Tanzania** 🇹🇿 with ❤️

---

**Version**: 1.0.0 (Beta)

🚀 **Status**: Ready for testing | Payment integration in progress

**Powered by**: Kubiks Real-time Analytics Platform 📊
