const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads folder structure
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
const avatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, videosDir, thumbnailsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/mpeg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Video files tu ndio zinakubaliwa'));
    }
  }
});

// ===== API ROUTES =====

// 1. AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  const { name, username, email, password } = req.body;
  
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'Jaza fields zote!' });
  }
  
  const user = {
    id: Date.now(),
    name,
    username,
    email,
    avatar: ['⚽', '💃', '😂', '🎵', '🍽️'][Math.floor(Math.random() * 5)],
    createdAt: new Date(),
    followers: 0,
    following: 0
  };
  
  res.json({ success: true, user, message: 'Jisajili kumefanikiwa! 🎉' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email na password zote zinajifunza' });
  }
  
  res.json({ 
    success: true, 
    message: 'Karibu! 👋',
    user: { email, username: '@user' }
  });
});

// 2. VIDEO ROUTES
app.post('/api/videos/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Video haijapakiwa' });
  }
  
  const { title, description, tags } = req.body;
  
  const video = {
    id: Date.now(),
    filename: req.file.filename,
    url: `/uploads/videos/${req.file.filename}`,
    title: title || 'Video ya Moto 🔥',
    description: description || '',
    tags: tags ? tags.split(',') : [],
    fireCount: 0,
    comments: [],
    shares: 0,
    createdAt: new Date()
  };
  
  res.json({ 
    success: true, 
    video,
    message: 'Video imepakiwa! 🚀'
  });
});

app.get('/api/videos', (req, res) => {
  fs.readdir(videosDir, (err, files) => {
    if (err) {
      return res.json({ videos: [], error: 'Hakunakosa videos' });
    }
    
    const videos = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.webm', '.mov', '.mpeg'].includes(ext);
      })
      .map((file, index) => ({
        id: index,
        filename: file,
        url: `/uploads/videos/${file}`,
        title: `Video ${index + 1}`,
        fireCount: Math.floor(Math.random() * 50000),
        comments: Math.floor(Math.random() * 5000),
        shares: Math.floor(Math.random() * 2000),
        createdAt: new Date()
      }));
    
    res.json({ success: true, videos, total: videos.length });
  });
});

app.delete('/api/videos/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(videosDir, filename);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error kudelete video' });
    }
    res.json({ success: true, message: 'Video ilifutwa! ✅' });
  });
});

// 3. FIRE (REACTION) ROUTES
app.post('/api/videos/:videoId/fire', (req, res) => {
  res.json({
    success: true,
    message: 'Moto ulioongeza! 🔥',
    fireCount: Math.floor(Math.random() * 100000)
  });
});

// 4. COMMENTS ROUTES
app.post('/api/videos/:videoId/comments', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Comment haipo' });
  }
  
  res.json({
    success: true,
    comment: {
      id: Date.now(),
      text,
      user: '@user',
      createdAt: new Date()
    }
  });
});

app.get('/api/videos/:videoId/comments', (req, res) => {
  res.json({
    success: true,
    comments: [
      { id: 1, user: '@SwahiliLover', text: 'Hii ilikua fire! 🔥', likes: 234 },
      { id: 2, user: '@ComedyKing', text: 'Niliumiza tua kusoma! 😂', likes: 567 }
    ]
  });
});

// 5. GIFTS ROUTES
app.post('/api/videos/:videoId/gift', (req, res) => {
  const { giftType } = req.body;
  
  const gifts = {
    diamond: { icon: '💎', price: 1000, bonus: 500 },
    crown: { icon: '👑', price: 500, bonus: 250 },
    rose: { icon: '🌹', price: 100, bonus: 50 }
  };
  
  const gift = gifts[giftType];
  
  if (!gift) {
    return res.status(400).json({ error: 'Hadiaji haipo' });
  }
  
  res.json({
    success: true,
    message: `Hadiaji ${gift.icon} ilitumwa! Creator alipata ${gift.bonus} bonus points!`,
    gift
  });
});

// 6. SOCIAL ROUTES
app.post('/api/users/:userId/follow', (req, res) => {
  res.json({
    success: true,
    message: 'Sasa unafuata! 📢',
    following: true
  });
});

app.post('/api/videos/:videoId/share', (req, res) => {
  const { platform } = req.body;
  
  res.json({
    success: true,
    message: `Video imeshirikiwa kwenye ${platform || 'social media'}! ↗️`
  });
});

// 7. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Swahili Loop inaendelea! 🔥',
    timestamp: new Date()
  });
});

// Serve index.html for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🎬 Swahili Loop inaendelea kwenye http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
