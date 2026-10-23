import { Banknote, Smartphone, CreditCard, AlertCircle, Lock } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    key: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
  },
  {
    key: 'upi',
    label: 'UPI',
    description: 'GPay, PhonePe, Paytm, BHIM',
    icon: Smartphone,
  },
  {
    key: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
  },
];

export default function PaymentOptions({
  selected,
  onChange,
  error,
  details = {},
  onDetailsChange,
  errors = {},
}) {
  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-1">E. Payment Method</h3>
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Demo only.</strong> No real payment is processed. Do not enter real card numbers,
          CVVs, UPI PINs or any credentials. This is a college project demonstration.
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Payment method">
        {PAYMENT_METHODS.map(({ key, label, description, icon: Icon }) => (
          <div key={key} className="space-y-3">
            <label
              htmlFor={`payment-${key}`}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selected === key
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                id={`payment-${key}`}
                name="payment"
                value={key}
                checked={selected === key}
                onChange={() => onChange(key)}
                className="sr-only"
              />
              <div className={`flex-shrink-0 ${selected === key ? 'text-primary-600' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              {selected === key && (
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </label>

            {/* UPI Details Section — displayed only when UPI is selected */}
            {selected === 'upi' && key === 'upi' && (
              <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-3">
                <div>
                  <label htmlFor="upiId" className="label">
                    UPI ID / VPA <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="upiId"
                    type="text"
                    value={details.upiId || ''}
                    onChange={(e) => onDetailsChange?.('upiId', e.target.value)}
                    placeholder="e.g. mobileNumber@upi or username@okhdfcbank"
                    className={`input-field ${errors.upiId ? 'input-error' : ''}`}
                    aria-describedby={errors.upiId ? 'upiId-error' : undefined}
                    aria-invalid={!!errors.upiId}
                    autoComplete="off"
                  />
                  {errors.upiId && (
                    <p id="upiId-error" className="text-red-500 text-xs mt-1" role="alert">
                      {errors.upiId}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Supported: Google Pay, PhonePe, Paytm, BHIM &amp; any registered UPI app. A payment authorization request will be sent to your UPI handle.
                </p>
              </div>
            )}

            {/* Credit/Debit Card Details Section — displayed only when Card is selected */}
            {selected === 'card' && key === 'card' && (
              <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-3">
                <div>
                  <label htmlFor="cardholderName" className="label">
                    Cardholder Name <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cardholderName"
                    type="text"
                    value={details.cardholderName || ''}
                    onChange={(e) => onDetailsChange?.('cardholderName', e.target.value)}
                    placeholder="Full name on card"
                    className={`input-field ${errors.cardholderName ? 'input-error' : ''}`}
                    aria-describedby={errors.cardholderName ? 'cardholderName-error' : undefined}
                    aria-invalid={!!errors.cardholderName}
                    autoComplete="cc-name"
                  />
                  {errors.cardholderName && (
                    <p id="cardholderName-error" className="text-red-500 text-xs mt-1" role="alert">
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cardNumber" className="label">
                    Card Number <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    value={details.cardNumber || ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                      onDetailsChange?.('cardNumber', formatted);
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={`input-field font-mono text-sm tracking-wider ${errors.cardNumber ? 'input-error' : ''}`}
                    aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
                    aria-invalid={!!errors.cardNumber}
                    autoComplete="cc-number"
                  />
                  {errors.cardNumber && (
                    <p id="cardNumber-error" className="text-red-500 text-xs mt-1" role="alert">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="expiryDate" className="label">
                      Expiry Date <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="expiryDate"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={details.expiryDate || ''}
                      onChange={(e) => {
                        let v = e.target.value.replace(/[^\d/]/g, '');
                        if (v.length === 2 && !v.includes('/') && e.target.value.length > (details.expiryDate || '').length) {
                          v = v + '/';
                        }
                        onDetailsChange?.('expiryDate', v.slice(0, 5));
                      }}
                      placeholder="MM/YY"
                      className={`input-field font-mono text-sm text-center ${errors.expiryDate ? 'input-error' : ''}`}
                      aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                      aria-invalid={!!errors.expiryDate}
                      autoComplete="cc-exp"
                    />
                    {errors.expiryDate && (
                      <p id="expiryDate-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cvv" className="label">
                      CVV <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={details.cvv || ''}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
                        onDetailsChange?.('cvv', cleaned);
                      }}
                      placeholder="123"
                      className={`input-field font-mono text-sm text-center ${errors.cvv ? 'input-error' : ''}`}
                      aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                      aria-invalid={!!errors.cvv}
                      autoComplete="cc-csc"
                    />
                    {errors.cvv && (
                      <p id="cvv-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>256-bit SSL encrypted. Card details are processed securely and never saved.</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
    </div>
  );
}
