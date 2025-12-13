// 🇹🇿 Registration Component
import React, { useState } from 'react';
import './Register.css';

const COUNTRIES = {
  'Tanzania': { flag: '🇹🇿', code: '+255', prefix: '255' },
  'Kenya': { flag: '🇰🇪', code: '+254', prefix: '254' },
  'Uganda': { flag: '🇺🇬', code: '+256', prefix: '256' },
  'Burundi': { flag: '🇧🇮', code: '+257', prefix: '257' }
};

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: 'Tanzania',
    password: '',
    confirmPassword: ''
  });

  const [detectedCountry, setDetectedCountry] = useState('Tanzania');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData({ ...formData, phoneNumber: phone });

    // Detect country from phone prefix
    const cleanPhone = phone.replace(/\D/g, '');
    for (const [country, data] of Object.entries(COUNTRIES)) {
      if (cleanPhone.startsWith(data.prefix)) {
        setDetectedCountry(country);
        setFormData(prev => ({ ...prev, country }));
        break;
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess('✅ Akaunti imetengenezwa! Karibu ' + formData.firstName);
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = '/games';
      }, 2000);

    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentCountry = COUNTRIES[formData.country];

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>🎮 Swahili Loop</h1>
        <p className="subtitle">Ujisajili - Register 🇹🇿 Made in Tanzania</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Names */}
          <div className="form-row">
            <div className="form-group">
              <label>Jina la Kwanza *</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Jina la Mwisho *</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone & Country */}
          <div className="form-row">
            <div className="form-group">
              <label>Namba ya Simu * (Phone Number)</label>
              <div className="phone-input-group">
                <span className="country-flag">{currentCountry.flag}</span>
                <span className="country-code">{currentCountry.code}</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="655123456"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength="15"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nchi * (Country)</label>
              <select 
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                {Object.entries(COUNTRIES).map(([country, data]) => (
                  <option key={country} value={country}>
                    {data.flag} {country} ({data.code})
                  </option>
                ))}
              </select>
              {detectedCountry !== formData.country && (
                <small className="help-text">
                  Detected: {COUNTRIES[detectedCountry].flag} {detectedCountry}
                </small>
              )}
            </div>
          </div>

          {/* Passwords */}
          <div className="form-row">
            <div className="form-group">
              <label>Neno la Siri * (Password)</label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
            <div className="form-group">
              <label>Kagua Neno la Siri * (Confirm)</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
          >
            {loading ? 'Inaendelea...' : '✅ Jisajiri Sasa (Register)'}
          </button>
        </form>

        <p className="login-link">
          Una akaunti? <a href="/login">Ingia hapa</a>
        </p>

        <div className="info-box">
          <h4>🇹🇿 Made in Tanzania</h4>
          <p>Payment Methods: Vodacom • Tigo • Airtel • Halotel</p>
          <p>Withdrawal via Voucher 🎟️</p>
        </div>
      </div>
    </div>
  );
}
