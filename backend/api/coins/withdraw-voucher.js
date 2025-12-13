// 🇹🇿 Withdraw via Voucher API
// POST /api/coins/withdraw-voucher
// Generate voucher codes for Vodacom, Tigo, Airtel, Halotel

const { PAYMENT_PROVIDERS, detectOperator, generateVoucherCode } = require('../../config/payment-providers');

module.exports = async (req, res) => {
  try {
    const { userId, coinsAmount, phoneNumber, withdrawMethod = 'voucher' } = req.body;

    if (!userId || !coinsAmount || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Detect operator
    const operator = detectOperator(phoneNumber);
    
    if (!operator) {
      return res.status(400).json({ 
        error: 'Phone number not recognized. Please use Vodacom, Tigo, Airtel, or Halotel',
        supportedOperators: Object.keys(PAYMENT_PROVIDERS)
      });
    }

    // Conversion rate: 30 TZS = 1 coin
    const CONVERSION_RATE = 30;
    const tzAmount = coinsAmount * CONVERSION_RATE;
    const minWithdrawal = 5000; // 5000 coins minimum

    if (coinsAmount < minWithdrawal) {
      return res.status(400).json({ 
        error: `Minimum withdrawal is ${minWithdrawal} coins (${minWithdrawal * CONVERSION_RATE} TZS)`,
        minAmount: minWithdrawal,
        minTZS: minWithdrawal * CONVERSION_RATE
      });
    }

    // Generate voucher code
    const voucherCode = generateVoucherCode(operator, tzAmount);

    const withdrawal = {
      id: `wd_${Date.now()}`,
      userId,
      coinsAmount,
      tzAmount,
      operator: operator.name,
      operatorCode: operator.code,
      phoneNumber,
      voucherCode,
      method: 'voucher',
      status: 'pending_redemption', // pending_redemption, redeemed, expired
      createdAt: new Date(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      redeemedAt: null
    };

    // In production: Save withdrawal to database
    // await saveWithdrawal(withdrawal);

    res.json({
      success: true,
      message: 'Voucher created successfully! 🎉',
      withdrawal: {
        id: withdrawal.id,
        operatorName: operator.name,
        operatorFlag: operator.flag,
        phoneNumber: phoneNumber,
        coinsConverted: coinsAmount,
        tzAmount: tzAmount,
        voucherCode: voucherCode,
        status: withdrawal.status,
        expiryDate: withdrawal.expiryDate,
        instructions: `
          📱 How to redeem:
          1. Open your ${operator.name} app
          2. Go to "Recharge" or "Buy Vouchers"
          3. Enter voucher code: ${voucherCode}
          4. Confirm and complete payment
          5. Money will be credited within minutes
        `,
        notes: [
          `✅ This voucher expires in 24 hours`,
          `✅ Valid only on ${operator.name} network`,
          `✅ Cannot be used on other operators`,
          `✅ One-time use only`
        ]
      },
      downloadVoucher: {
        format: 'PDF',
        content: `
          ╔════════════════════════════════════════╗
          ║         🇹🇿 SWAHILI LOOP VOUCHER     ║
          ║                                        ║
          ║  Operator: ${operator.name.padEnd(25)} ║
          ║  Amount: ${tzAmount.toString().padEnd(26)} TZS ║
          ║  Code: ${voucherCode.padEnd(27)} ║
          ║                                        ║
          ║  Valid until: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()} ║
          ║  Made in Tanzania 🇹🇿                 ║
          ╚════════════════════════════════════════╝
        `
      }
    });

  } catch (error) {
    console.error('Voucher withdrawal error:', error);
    res.status(500).json({ 
      error: 'Kosa katika kuandaa voucher', 
      details: error.message 
    });
  }
};
