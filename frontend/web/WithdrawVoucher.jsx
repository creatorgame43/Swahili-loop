// 🇹🇿 Withdraw via Voucher Component
import React, { useState } from 'react';
import './WithdrawVoucher.css';

const OPERATORS = {
  'vodacom': { name: 'Vodacom', flag: '🇹🇿', color: '#FF6600', icon: '📱' },
  'tigo': { name: 'Tigo', flag: '🇹🇿', color: '#7030A0', icon: '📱' },
  'airtel': { name: 'Airtel', flag: '🇹🇿', color: '#FF0000', icon: '📱' },
  'halotel': { name: 'Halotel', flag: '🇹🇿', color: '#00A8E1', icon: '📱' }
};

export default function WithdrawVoucher() {
  const [step, setStep] = useState(1); // 1: Form, 2: Voucher Generated
  const [formData, setFormData] = useState({
    coinsAmount: '',
    phoneNumber: '',
    operator: ''
  });
  
  const [generatedVoucher, setGeneratedVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userBalance] = useState(12450); // Mock balance

  const CONVERSION_RATE = 30; // 1 coin = 30 TZS
  const minWithdrawal = 5000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      const coinsAmount = parseInt(formData.coinsAmount);
      
      if (coinsAmount < minWithdrawal) {
        setError(`Minimum withdrawal: ${minWithdrawal} coins (${minWithdrawal * CONVERSION_RATE} TZS)`);
        setLoading(false);
        return;
      }

      if (coinsAmount > userBalance) {
        setError('Coins zaidi ya ile unayo!');
        setLoading(false);
        return;
      }

      // Call API
      const response = await fetch('/api/coins/withdraw-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_123', // Mock
          coinsAmount,
          phoneNumber: formData.phoneNumber,
          withdrawMethod: 'voucher'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate voucher');
        return;
      }

      setGeneratedVoucher(data.withdrawal);
      setStep(2); // Show voucher

    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadVoucher = () => {
    if (!generatedVoucher) return;

    const content = `
╔════════════════════════════════════════╗
║    🇹🇿 SWAHILI LOOP - VOUCHER         ║
║                                        ║
║ Operator: ${generatedVoucher.operatorName.padEnd(24)} ║
║ Amount: ${generatedVoucher.tzAmount.toString().padEnd(26)} TZS ║
║ Code: ${generatedVoucher.voucherCode.padEnd(31)} ║
║                                        ║
║ Phone: ${formData.phoneNumber.padEnd(30)} ║
║ Valid until: ${new Date(generatedVoucher.expiryDate).toLocaleDateString().padEnd(20)} ║
║                                        ║
║ Made in Tanzania 🇹🇿                  ║
╚════════════════════════════════════════╝
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `voucher_${generatedVoucher.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (step === 1) {
    return (
      <div className="withdraw-container">
        <div className="withdraw-card">
          <h2>💰 Pata Pesa (Withdraw)</h2>
          <p className="subtitle">Badilisha coins kuwa TZS kwa njia ya voucher</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Current Balance */}
            <div className="balance-info">
              <h4>Coins unazosamba</h4>
              <p className="balance">{userBalance.toLocaleString()} Coins</p>
              <p className="balance-tz">≈ {(userBalance * CONVERSION_RATE).toLocaleString()} TZS</p>
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label>Coins anzoita (Amount in Coins) *</label>
              <input
                type="number"
                name="coinsAmount"
                placeholder={minWithdrawal.toString()}
                value={formData.coinsAmount}
                onChange={handleChange}
                min={minWithdrawal}
                max={userBalance}
                required
              />
              {formData.coinsAmount && (
                <div className="conversion">
                  {parseInt(formData.coinsAmount)} coins = {(parseInt(formData.coinsAmount) * CONVERSION_RATE).toLocaleString()} TZS
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label>Namba ya Simu * (Phone Number)</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="0655 123 456 (Vodacom/Tigo/Airtel/Halotel)"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength="15"
                required
              />
              <small>🇹🇿 Phone na nchi itajulikana mwenyewe</small>
            </div>

            {/* Supported Operators */}
            <div className="operators-info">
              <h4>Waendeshaji wanaotumiwa:</h4>
              <div className="operators-grid">
                {Object.entries(OPERATORS).map(([key, op]) => (
                  <div key={key} className="operator-badge" style={{ backgroundColor: op.color }}>
                    {op.icon} {op.name}
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Inaendelea...' : '✅ Tengeneza Voucher'}
            </button>
          </form>

          <div className="disclaimer">
            <p>📌 Voucher itathalau kwa 24 saa</p>
            <p>📌 Inaweza kutumiwa mara moja</p>
            <p>📌 Kwa waendeshaji wa Tanzania</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2 && generatedVoucher) {
    return (
      <div className="voucher-display-container">
        <div className="voucher-card-large">
          <div className="voucher-header">
            <h2>🎉 Voucher Imetengenezwa!</h2>
            <p className="voucher-status">Status: Handa kutumiwa ✅</p>
          </div>

          {/* Voucher Details */}
          <div className="voucher-details">
            <div className="detail-row">
              <span className="label">Waendeshaji:</span>
              <span className="value">{generatedVoucher.operatorFlag} {generatedVoucher.operatorName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Namba ya Simu:</span>
              <span className="value">{generatedVoucher.phoneNumber}</span>
            </div>
            <div className="detail-row">
              <span className="label">Coins:</span>
              <span className="value">{generatedVoucher.coinsConverted.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Fedha (TZS):</span>
              <span className="value" style={{ fontSize: '1.3em', color: '#27ae60' }}>
                {generatedVoucher.tzAmount.toLocaleString()} TZS
              </span>
            </div>
          </div>

          {/* Voucher Code */}
          <div className="voucher-code-box">
            <h3>Koodi ya Voucher:</h3>
            <div className="voucher-code">
              <code>{generatedVoucher.voucherCode}</code>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(generatedVoucher.voucherCode);
                  alert('✅ Koodi kunakiliwa!');
                }}
              >
                📋 Nakili
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="instructions">
            <h3>📱 Jinsi ya Kutumiа:</h3>
            <ol>
              <li>Fungua programu ya {generatedVoucher.operatorName}</li>
              <li>Nenda kwa "Recharge" au "Vouchers"</li>
              <li>Ingiza koodi: <strong>{generatedVoucher.voucherCode}</strong></li>
              <li>Kubali na kamata malipo</li>
              <li>Pesa itakuja ndani ya dakika chache 💰</li>
            </ol>
          </div>

          {/* Validity */}
          <div className="validity">
            ⏰ Hii voucher inathalau mpaka: <strong>{new Date(generatedVoucher.expiryDate).toLocaleString('sw-TZ')}</strong>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn-download" onClick={downloadVoucher}>
              📥 Download Voucher
            </button>
            <button 
              className="btn-new"
              onClick={() => {
                setStep(1);
                setFormData({ coinsAmount: '', phoneNumber: '', operator: '' });
                setGeneratedVoucher(null);
              }}
            >
              ➕ Tengeneza Mpya
            </button>
            <button className="btn-home" onClick={() => window.location.href = '/games'}>
              🎮 Rudi Nyumbani
            </button>
          </div>
        </div>

        <div className="success-message">
          <h3>✅ Voucher Imetengenezwa Kwa Mafanikio!</h3>
          <p>🇹🇿 Made in Tanzania | Powered by Kubiks Analytics</p>
        </div>
      </div>
    );
  }
}
