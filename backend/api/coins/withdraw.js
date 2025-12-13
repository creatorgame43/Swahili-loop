// Withdraw Coins API
// POST /api/coins/withdraw

const { initiateMpesaPayment } = require('../../config/payment');

module.exports = async (req, res) => {
  try {
    const { userId, coinsAmount, paymentMethod = 'mpesa', phoneNumber } = req.body;

    if (!userId || !coinsAmount || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Minimum withdrawal: 5000 coins = 167 KES
    const CONVERSION_RATE = 0.033; // 1 coin = 0.033 KES (15,000 coins = 500 KES)
    const coinsNeeded = 5000;

    if (coinsAmount < coinsNeeded) {
      return res.status(400).json({ 
        error: `Minimum withdrawal is ${coinsNeeded} coins`,
        equivalentKes: Math.floor(coinsNeeded * CONVERSION_RATE)
      });
    }

    const kesAmount = Math.floor(coinsAmount * CONVERSION_RATE);

    const withdrawal = {
      id: `wd_${Date.now()}`,
      userId,
      coinsAmount,
      kesAmount,
      paymentMethod,
      phoneNumber,
      status: 'pending',
      createdAt: new Date(),
      completedAt: null
    };

    // Initiate payment based on method
    let paymentResult;

    if (paymentMethod === 'mpesa') {
      paymentResult = await initiateMpesaPayment({
        phoneNumber,
        amount: kesAmount,
        withdrawalId: withdrawal.id
      });
    } else if (paymentMethod === 'bank_transfer') {
      paymentResult = {
        status: 'pending',
        message: 'Bank transfer initiated. You will receive funds within 2-3 business days.'
      };
    } else {
      return res.status(400).json({ error: 'Unsupported payment method' });
    }

    // In production: Save withdrawal to database
    // await createWithdrawal(withdrawal);

    res.json({
      success: true,
      withdrawal: {
        id: withdrawal.id,
        coinsConverted: coinsAmount,
        kesAmount,
        status: withdrawal.status,
        paymentMethod,
        message: `${kesAmount} KES will be sent to ${phoneNumber}`,
        estimatedTime: 'Within 2-3 minutes for M-Pesa'
      }
    });

  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal', details: error.message });
  }
};
