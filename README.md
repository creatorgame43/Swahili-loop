# 🎬 Swahili Loop - Video App

Karibu kwenye Swahili Loop! Hii ni app ya video kwa Swahili - upload, cheza, na tafuta videos zako!

## Features ✨

- 📱 **TikTok Style** - Full screen video player na looping
- 🎥 **Upload Videos** - Pakia videos zako MP4, WebM
- 🎨 **Beautiful UI** - Purple gradient, modern design
- 📊 **Gallery** - Tazama videos zako kwa grid
- ⚡ **Fast** - Built with Express.js
- 🌍 **Swahili** - All text in Swahili!

## Setup 🚀

### Requirements
- Node.js 14+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/creatorgame43/swahili-loop.git
cd swahili-loop

# Install dependencies
npm install

# Start server
npm start
```

Server runs on `http://localhost:3000`

## Usage 🎮

1. **Open** - Go to http://localhost:3000
2. **Upload** - Click "Upload" button na deki/uvute video
3. **Play** - Click "Cheza" kucheza video
4. **Navigate** - Use Nyuma/Mbele buttons
5. **Gallery** - Click "Orodha" kuona videos zako

## Files 📁

```
swahili-loop/
├── server.js           # Backend API (Express)
├── package.json        # Dependencies
├── public/
│   ├── index.html      # Frontend (TikTok style)
│   └── uploads/        # Videos storage
└── README.md
```

## API Endpoints 🔌

- `POST /api/upload` - Upload video
- `GET /api/videos` - Get all videos
- `DELETE /api/videos/:filename` - Delete video

## Deployment 🌐

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Set environment: `NODE_ENV=production`
4. Deploy!

Note: Free tier has file size limits. For production, use cloud storage (AWS S3, Cloudinary).

## Customization 🎨

### Change Logo
Edit `index.html` - find "SWAHILILOOP" text

### Change Colors
Edit CSS gradients in `<style>` section - replace `#667eea` and `#764ba2`

### Add Features
- User accounts
- Like/comment system
- Share to social media
- Advanced video editing

## License 📄

MIT - Feel free to use and modify!

## Support 💬

Questions? Issues? Let's debug together!

---

Made with ❤️ for Swahili speakers
