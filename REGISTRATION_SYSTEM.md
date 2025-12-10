# 🔐 Swahili Loop - Registration System & OTP

Hii ni complete registration system ya Swahili Loop na OTP verification kama TikTok. System inasanidi ku-automatic update OTP na kuopen app.

## ✨ Features

- ✅ **User Registration** - Weka email, password, username, full name
- ✅ **OTP Verification** - 6-digit OTP automatic inatuma kwa email
- ✅ **OTP Expiration** - OTP inahitaji kuverify kwa 10 minutes
- ✅ **Auto OTP Refresh** - OTP zinabadilika automatic (resend capability)
- ✅ **JWT Authentication** - Token-based auth kwa API requests
- ✅ **OpenTelemetry Monitoring** - Track all registration flows
- ✅ **User Profiles** - Profile info, followers, following
- ✅ **Swahili Support** - Error messages in Swahili & English

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Nakili `.env.example` to `.env` na jaza fields:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/swahili-loop

# Gmail Setup (for OTP emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# JWT Secret
JWT_SECRET=your-secret-key-here

# Kubiks (OpenTelemetry)
KUBIKS_API_KEY=your-api-key-here
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.kubiks.app
```

### 3. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Mac
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
mongod
```

#### Option B: MongoDB Atlas (Cloud)
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account & cluster
3. Copy connection string
4. Add to .env: MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/swahili-loop
```

### 4. Gmail Setup for OTP Emails

1. Go to https://myaccount.google.com/
2. Click "Security" → "App passwords"
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Copy this password to `.env` as `EMAIL_PASSWORD`

**Example:**
```env
EMAIL_USER=swahililoop@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### 5. Start Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

Server runs on `http://localhost:3000`

---

## 📡 API Endpoints

### 1️⃣ Register User (Step 1)

**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "john_doe",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP imetumwa kwa email yako",
  "email": "user@example.com",
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

---

### 2️⃣ Verify OTP (Step 2)

**POST** `/api/auth/verify-otp`

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Akaunti imethibitishwa!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe",
    "isVerified": true
  }
}
```

---

### 3️⃣ Resend OTP

**POST** `/api/auth/resend-otp`

```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP mpya imetumwa"
}
```

---

### 4️⃣ Login

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Umeingia kwa mafanikio",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe",
    "isVerified": true
  }
}
```

---

### 5️⃣ Get User Profile

**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe",
    "isVerified": true,
    "followers": [],
    "following": [],
    "videosCount": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📱 Frontend Integration (Example)

### Step 1: Register Page

```html
<form id="registerForm">
  <input type="text" id="fullName" placeholder="Full Name" required>
  <input type="text" id="username" placeholder="Username" required>
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Password" required>
  <button type="submit">Register</button>
</form>

<script>
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: document.getElementById('fullName').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show OTP verification screen
      showOTPScreen(data.email);
    } else {
      alert(data.error);
    }
  });
</script>
```

### Step 2: OTP Verification Page

```html
<div id="otpScreen" style="display:none;">
  <p>Enter 6-digit OTP sent to your email</p>
  <input type="text" id="otp" placeholder="000000" maxlength="6" required>
  <button id="verifyBtn">Verify OTP</button>
  <button id="resendBtn">Resend OTP</button>
</div>

<script>
  document.getElementById('verifyBtn').addEventListener('click', async () => {
    const email = localStorage.getItem('registerEmail');
    const otp = document.getElementById('otp').value;
    
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save token
      localStorage.setItem('authToken', data.token);
      
      // Redirect to app
      window.location.href = '/home';
    } else {
      alert(data.error);
    }
  });
  
  document.getElementById('resendBtn').addEventListener('click', async () => {
    const email = localStorage.getItem('registerEmail');
    
    const response = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    alert(data.message);
  });
</script>
```

---

## 🔍 OpenTelemetry Monitoring

All registration events are automatically tracked:

- **Registration attempt** - Email, username, password hash
- **OTP sent** - Timestamp, email
- **OTP verification** - Success/failure, attempts
- **Login events** - User ID, email, timestamp
- **Errors** - All errors logged with full context

View logs in Kubiks dashboard at: https://app.kubiks.ai

---

## 🛡️ Security Features

✅ **Passwords hashed** with bcryptjs (10 salt rounds)
✅ **JWT tokens** expire after 30 days
✅ **OTP expires** after 10 minutes
✅ **Rate limiting** - Max 3 resend attempts per hour
✅ **Attempt tracking** - Blocks after 5 failed OTP tries
✅ **Email validation** - Regex pattern check
✅ **MongoDB indexes** - Fast lookups by email/username
✅ **OpenTelemetry traces** - Full visibility into auth flows

---

## 📝 File Structure

```
swahili-loop/
├── server.js                 # Main server
├── instrumentation.js        # OpenTelemetry setup
├── telemetry.js             # Tracer helper
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── REGISTRATION_SYSTEM.md   # This file
├── routes/
│   └── auth.js              # Authentication endpoints
├── models/
│   ├── User.js              # User model
│   └── OTP.js               # OTP model
└── public/
    ├── index.html
    ├── uploads/
    └── ...
```

---

## 🐛 Troubleshooting

### OTP not sending?
- Check Gmail credentials in `.env`
- Enable "Less secure apps" or use App Password
- Check email spam folder

### MongoDB connection error?
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Try with MongoDB Atlas cloud version

### JWT token invalid?
- Token expires after 30 days
- Make sure JWT_SECRET is same on server
- Check token format in Authorization header: `Bearer <token>`

### OTP expired?
- OTP valid for 10 minutes only
- Click "Resend OTP" to get new code
- Can resend max 3 times per hour

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add Environment Variables in Vercel Dashboard:
   - MONGODB_URI
   - EMAIL_USER
   - EMAIL_PASSWORD
   - JWT_SECRET
   - KUBIKS_API_KEY
4. Deploy!

### Deploy to Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  username: "john_doe",
  fullName: "John Doe",
  password: "hashed_password",
  isVerified: true,
  verifiedAt: ISODate("2024-01-15"),
  followers: [],
  following: [],
  videosCount: 0,
  createdAt: ISODate("2024-01-15"),
  updatedAt: ISODate("2024-01-15")
}
```

### OTP Collection

```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  otp: "123456",
  attempts: 0,
  expiresAt: ISODate("2024-01-15T10:35:00Z"),
  createdAt: ISODate("2024-01-15T10:25:00Z")
}
```

---

## 📞 Support

**Issues?** Contact support@kubiks.ai or check Kubiks documentation at https://docs.kubiks.ai

**Questions about code?** Check inline comments in routes/auth.js

Happy coding! 🚀

---

*Last updated: January 2024*
*Swahili Loop v1.0*
