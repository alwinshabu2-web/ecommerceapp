import { Banknote, Smartphone, CreditCard, AlertCircle } from 'lucide-react';

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

export default function PaymentOptions({ selected, onChange, error }) {
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
          <label
            key={key}
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
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
    </div>
  );
}
