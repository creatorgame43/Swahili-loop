// 🇹🇿 Payment Providers - Vodacom, Tigo, Airtel, Halotel

const PAYMENT_PROVIDERS = {
  'Vodacom': {
    code: 'vodacom',
    country: 'Tanzania',
    operator: 'Vodacom Tanzania',
    flag: '🇹🇿',
    prefix: '0655|0656|0657|0658|0659',
    currency: 'TZS',
    minAmount: 1000,
    maxAmount: 10000000,
    commission: 0.015,
    apiEndpoint: 'https://api.vodacom.co.tz/payment',
    colors: { primary: '#FF6600', secondary: '#FFFFFF' }
  },
  'Tigo': {
    code: 'tigo',
    country: 'Tanzania',
    operator: 'Tigo Tanzania',
    flag: '🇹🇿',
    prefix: '0672|0673|0674|0675|0676',
    currency: 'TZS',
    minAmount: 1000,
    maxAmount: 10000000,
    commission: 0.015,
    apiEndpoint: 'https://api.tigo.co.tz/payment',
    colors: { primary: '#7030A0', secondary: '#FFFFFF' }
  },
  'Airtel': {
    code: 'airtel',
    country: 'Tanzania',
    operator: 'Airtel Tanzania',
    flag: '🇹🇿',
    prefix: '0680|0681|0682|0683|0684',
    currency: 'TZS',
    minAmount: 1000,
    maxAmount: 10000000,
    commission: 0.015,
    apiEndpoint: 'https://api.airtel.co.tz/payment',
    colors: { primary: '#FF0000', secondary: '#FFFFFF' }
  },
  'Halotel': {
    code: 'halotel',
    country: 'Tanzania',
    operator: 'Halotel Tanzania',
    flag: '🇹🇿',
    prefix: '0690|0691|0692|0693|0694',
    currency: 'TZS',
    minAmount: 1000,
    maxAmount: 10000000,
    commission: 0.02,
    apiEndpoint: 'https://api.halotel.co.tz/payment',
    colors: { primary: '#00A8E1', secondary: '#FFFFFF' }
  }
};

const detectOperator = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const localPrefix = cleanPhone.slice(-10);

  for (const [name, provider] of Object.entries(PAYMENT_PROVIDERS)) {
    const prefixes = provider.prefix.split('|');
    for (const prefix of prefixes) {
      if (localPrefix.startsWith(prefix)) {
        return { name, ...provider };
      }
    }
  }
  return null;
};

const generateVoucherCode = (provider, amount) => {
  return `${provider.code.toUpperCase()}-${amount}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

const validateVoucher = (voucherCode) => {
  const parts = voucherCode.split('-');
  if (parts.length !== 4) return { valid: false, error: 'Invalid voucher format' };
  
  const [provider, amount] = parts;
  return {
    valid: true,
    provider,
    amount: parseInt(amount),
    status: 'active',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };
};

module.exports = {
  PAYMENT_PROVIDERS,
  detectOperator,
  generateVoucherCode,
  validateVoucher
};
