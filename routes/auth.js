const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const OTP = require('../models/OTP');

const router = express.Router();

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Swahili Loop - OTP Verification Code 🔐',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin: 0 0 10px 0;">🎬 Welcome to Swahili Loop!</h2>
            <p style="color: #666; font-size: 14px; margin: 0 0 20px 0;">Karibu sana! Verify your email to continue</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">Your One-Time Password:</p>
              <h1 style="color: #667eea; letter-spacing: 8px; font-size: 36px; margin: 0; font-weight: bold; font-family: 'Courier New', monospace;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0;">⏰ This OTP will expire in <strong>10 minutes</strong></p>
            <p style="color: #e74c3c; font-size: 12px; margin: 20px 0; padding: 10px; background: #fadbd8; border-radius: 5px;">🔒 Never share this code with anyone</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 11px;">
              <p>If you didn't request this, please ignore this email.</p>
              <p>© 2024 Swahili Loop. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Register - Step 1: Create account and send OTP
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, fullName } = req.body;

    // Validation
    if (!email || !password || !username || !fullName) {
      return res.status(400).json({ 
        success: false,
        error: 'Tafadhali jaza masehemu yote (Please fill all fields)' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Email sio sahihi (Invalid email)' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Email au username tayari imesajiliwa (Email or username already registered)' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (not verified yet)
    const user = new User({
      email,
      password: hashedPassword,
      username,
      fullName,
      isVerified: false,
      createdAt: new Date()
    });

    await user.save();

    // Generate and send OTP
    const otp = generateOTP();
    const otpRecord = new OTP({
      email,
      otp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await otpRecord.save();
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({ 
        success: false,
        error: 'Imeshindwa kutuma OTP (Failed to send OTP)' 
      });
    }

    res.json({
      success: true,
      message: 'OTP imetumwa kwa email yako (OTP sent to your email)',
      email: email,
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Usajili umeshindwa (Registration failed)' 
    });
  }
});

// Verify OTP - Step 2: Confirm OTP and activate account
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Email na OTP zinahitajika (Email and OTP required)' 
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      // Increment attempts
      const existingRecord = await OTP.findOne({ email });
      if (existingRecord) {
        existingRecord.attempts = (existingRecord.attempts || 0) + 1;
        if (existingRecord.attempts >= 5) {
          await OTP.deleteOne({ email });
          return res.status(400).json({ 
            success: false,
            error: 'Jaribu nyingi za OTP. Tafadhali jisajili tena (Too many OTP attempts. Please register again)' 
          });
        }
        await existingRecord.save();
      }
      return res.status(400).json({ 
        success: false,
        error: 'OTP sio sahihi (Invalid OTP)' 
      });
    }

    // Check if OTP expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false,
        error: 'OTP imeishia. Tafadhali jisajili tena (OTP expired. Please register again)' 
      });
    }

    // Verify user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Mtumiaji haupatikani (User not found)' 
      });
    }

    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'swahili-loop-secret-key-2024',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Akaunti imethibitishwa! Karibu (Account verified! Welcome)',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        isVerified: true
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Uthibitisho umeshindwa (Verification failed)' 
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email inahitajika (Email required)' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || user.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: 'Mtumiaji haupatikani au tayari amethibitishwa (User not found or already verified)' 
      });
    }

    // Check rate limiting (not more than 3 requests per hour)
    const lastOTP = await OTP.findOne({ email });
    if (lastOTP && new Date() - lastOTP.createdAt < 60000) { // 1 minute
      return res.status(400).json({ 
        success: false,
        error: 'Subiri dakika moja kabla ya kuomba OTP mpya (Wait 1 minute before requesting new OTP)' 
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    
    // Delete old OTP
    await OTP.deleteOne({ email });

    // Create new OTP
    const otpRecord = new OTP({
      email,
      otp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      createdAt: new Date()
    });

    await otpRecord.save();
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({ 
        success: false,
        error: 'Imeshindwa kutuma OTP (Failed to send OTP)' 
      });
    }

    res.json({
      success: true,
      message: 'OTP mpya imetumwa (New OTP sent)'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Imeshindwa kutuma OTP (Failed to resend OTP)' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email na password zinahitajika (Email and password required)' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Ujumbe wa mkakati wa siri (Invalid credentials)' 
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: 'Tafadhali thibitisha email yako kwanza (Please verify your email first)',
        email: email
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ 
        success: false,
        error: 'Ujumbe wa mkakati wa siri (Invalid credentials)' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'swahili-loop-secret-key-2024',
      { expiresIn: '30d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Umeingia kwa mafanikio (Login successful)',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        isVerified: true
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Umeshindwa kuingia (Login failed)' 
    });
  }
});

// Get user profile (requires token)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token inahitajika (Token required)' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'swahili-loop-secret-key-2024');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Mtumiaji haupatikani (User not found)' 
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: 'Token sio sahihi (Invalid token)' 
    });
  }
});

module.exports = router;
