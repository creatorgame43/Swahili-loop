// 🇹🇿 Register API - Sign Up System
// POST /api/auth/register

const User = require('../../models/User');

// Country codes and phone validation
const COUNTRIES = {
  'Tanzania': { code: '+255', flag: '🇹🇿', prefix: '255' },
  'Kenya': { code: '+254', flag: '🇰🇪', prefix: '254' },
  'Uganda': { code: '+256', flag: '🇺🇬', prefix: '256' },
  'Burundi': { code: '+257', flag: '🇧🇮', prefix: '257' }
};

const validatePhoneNumber = (phone, country) => {
  const countryData = COUNTRIES[country];
  if (!countryData) return false;
  
  // Remove any formatting
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if valid length (usually 9-10 digits after country code)
  return cleanPhone.length >= 9 && cleanPhone.length <= 12;
};

const getCountryFromPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  for (const [country, data] of Object.entries(COUNTRIES)) {
    if (cleanPhone.startsWith(data.prefix)) {
      return country;
    }
  }
  
  return null;
};

module.exports = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      country,
      password, 
      confirmPassword 
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !country || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'phoneNumber', 'country', 'password']
      });
    }

    // Validate country
    if (!COUNTRIES[country]) {
      return res.status(400).json({ 
        error: 'Invalid country',
        validCountries: Object.keys(COUNTRIES)
      });
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber, country)) {
      return res.status(400).json({ 
        error: 'Invalid phone number for ' + country,
        format: COUNTRIES[country].code + ' + local number'
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: 'Passwords do not match'
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // Format phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = COUNTRIES[country].code + cleanPhone;

    // Check if user exists (in production: check database)
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ error: 'Email already registered' });
    // }

    // Hash password (mock)
    const passwordHash = 'hashed_' + password;

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone: formattedPhone,
      phoneNumber: cleanPhone,
      passwordHash,
      country,
      avatar: COUNTRIES[country].flag,
      coins: 0,
      totalEarned: 0,
      totalWithdrawn: 0
    });

    // In production: Save to database
    // await newUser.save();

    // Generate mock auth token
    const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    res.status(201).json({
      success: true,
      message: 'Akaunti imetengenezwa! 🎉',
      user: {
        id: 'user_' + Date.now(),
        firstName,
        lastName,
        email,
        phone: formattedPhone,
        country,
        flag: COUNTRIES[country].flag,
        avatar: COUNTRIES[country].flag,
        joinDate: new Date(),
        coins: 0,
        level: 1
      },
      token,
      redirect: '/games'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Ujisajili umeshindwa', 
      details: error.message 
    });
  }
};

module.exports.COUNTRIES = COUNTRIES;
module.exports.validatePhoneNumber = validatePhoneNumber;
module.exports.getCountryFromPhone = getCountryFromPhone;
