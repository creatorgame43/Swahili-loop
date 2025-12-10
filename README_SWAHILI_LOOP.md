# 🔥 Swahili Loop - TikTok Clone in Kiswahili

**Swahili Loop** ni TikTok clone iliyotengenezwa kwa Kiswahili na kwa Waswahili!

## ✨ Features Za Core

### 🎬 Video Management
- **Upload Videos** - Pakia video zako moja kwa moja
- **Video Feed** - Scroll through endless videos (infinite scroll)
- **Video Tags** - Lebo kwa kila video (#kiswahili, #viral, nk)
- **Video Comments** - Maoni kwa kila video

### 🔥 Fire Reaction System (Badala ya Likes)
- **🔥 Moto** - React to videos with fire emoji
- **Live Counter** - Real-time fire count
- **Analytics** - See trending videos by fire count
- **Badge System** - "Moto King" badge kwa top creators

### 👥 Social Features
- **Follow System** - Fuata creators wako
- **User Profiles** - Profile page na bio
- **Messages** - Direct messages kwa followers
- **Share Videos** - Shiriki videos kwenye social media
- **Notifications** - Get notified when users interact

### 🎁 Gift System
```
💎 Diamond - 1,000 points (500 bonus to creator)
👑 Crown - 500 points (250 bonus to creator)
🌹 Rose - 100 points (50 bonus to creator)
```

### 📺 Live Streaming (Coming Soon)
- **Go Live** - Stream directly kwa followers
- **Live Chat** - Chat during streaming
- **Live Gifts** - Send gifts to live creators
- **Recording** - Auto-save live streams

### ⚙️ Settings & Customization
- **Privacy Settings** - Control who sees your content
- **Notification Controls** - Manage notifications
- **Language** - All in Kiswahili (with English fallback)
- **Account Settings** - Change email, password, bio

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/creatorgame43/Swahili-loop.git

# Navigate to directory
cd Swahili-loop

# Install dependencies
npm install

# Start the server
npm start
```

### Environment Variables

Create `.env` file:
```
PORT=3000
NODE_ENV=development
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.kubiks.app
KUBIKS_API_KEY=your_api_key_here
OTEL_SERVICE_NAME=swahili-loop
```

## 📱 User Interface

### Sidebar Navigation (🔥)
```
🏠 Home - View your personalized feed
🔍 Explore - Discover trending videos
📤 Upload - Pakia video yako
💬 Messages - Read messages
❤️ Liked - Your favorite videos
👤 Profile - Your profile page
⚙️ Settings - Account settings
```

### Video Actions
- 🔥 **Fire** - Add fire reaction (replaces likes)
- 💬 **Comments** - Andika comments
- ↗️ **Share** - Share to other platforms
- 🎁 **Gift** - Send gifts to creator

### User Experience
- ✅ Dark mode (perfect for night)
- ✅ Smooth animations & transitions
- ✅ Mobile responsive design
- ✅ All text in Kiswahili
- ✅ Fast loading & performance

## 📁 Project Structure

```
Swahili-loop/
├── public/
│   ├── index.html          # Main app UI
│   ├── css/
│   │   └── style.css       # Styles
│   ├── js/
│   │   └── main.js         # JavaScript logic
│   └── uploads/            # User uploads
│       ├── videos/
│       ├── thumbnails/
│       └── avatars/
├── api/
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   └── middleware/         # Auth, validation
├── server.js               # Express server
├── instrumentation.js      # OpenTelemetry setup
├── package.json
└── vercel.json            # Vercel configuration
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: LocalStorage (Browser) + File System
- **Deployment**: Vercel
- **Observability**: Kubiks + OpenTelemetry
- **Authentication**: Basic JWT (future)

## 🎨 Design System

### Colors
- **Primary**: #ff0050 (Fire Red)
- **Secondary**: #ff6b35 (Orange)
- **Background**: #000000 (Black)
- **Surface**: #1a1a1a (Dark Gray)
- **Border**: #333333 (Light Gray)

### Typography
- **Font**: Segoe UI, sans-serif
- **Language**: Kiswahili + English
- **Icons**: Emoji for quick recognition

## 📈 Features Roadmap

### Phase 1 (Current)
- ✅ Basic video upload/playback
- ✅ Fire reaction system
- ✅ Comments
- ✅ User profiles
- ✅ Following system

### Phase 2 (Next)
- 🔄 Live streaming
- 🔄 Stories
- 🔄 Duets & Stitches
- 🔄 Sound management
- 🔄 Filters & effects

### Phase 3 (Future)
- 📅 Creator Dashboard
- 📅 Analytics & Insights
- 📅 Monetization (Creator Fund)
- 📅 Ads & Brand partnerships
- 📅 Mobile app (iOS/Android)

## 🤝 Contributing

Unataka kusaidia? 🙌

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Licensed under MIT - feel free to use this project!

## 🎯 Vision

**Swahili Loop** ni platform kwa Waswahili na kwa Waswahili. Tunataka:
- ✨ Promote Swahili culture & creativity
- 🚀 Create opportunities for African creators
- 💪 Build strong community
- 🌍 Showcase Swahili to the world

## 📞 Contact & Support

- 📧 **Email**: support@swahililoop.com
- 💬 **Discord**: [Join our community]
- 📱 **Twitter**: @SwahiliLoop
- 📸 **Instagram**: @swahililoop.app

---

**Karibu Swahili Loop! Let your fire shine! 🔥**

Made with ❤️ by Swahili creators, for Swahili creators.
