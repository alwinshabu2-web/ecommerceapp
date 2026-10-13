import { SHIPPING_RATES, formatPrice, estimateDelivery } from '../utils/helpers';
import { Truck, Zap, Clock } from 'lucide-react';

const ICONS = { standard: Truck, express: Zap, overnight: Clock };

export default function DeliveryOptions({ selected, onChange, error }) {
  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-3">D. Delivery Method</h3>
      <p className="text-xs text-gray-500 mb-3">
        ⚠ Sample estimates only — not guaranteed services or real delivery commitments.
      </p>
      <div className="space-y-3" role="radiogroup" aria-label="Delivery method">
        {Object.entries(SHIPPING_RATES).map(([key, rate]) => {
          const Icon = ICONS[key] || Truck;
          const est = estimateDelivery(key);
          return (
            <label
              key={key}
              htmlFor={`delivery-${key}`}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selected === key
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                id={`delivery-${key}`}
                name="delivery"
                value={key}
                checked={selected === key}
                onChange={() => onChange(key)}
                className="sr-only"
              />
              <div className={`mt-0.5 flex-shrink-0 ${selected === key ? 'text-primary-600' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">{rate.label}</span>
                  <span className="font-bold text-gray-900 text-sm">{formatPrice(rate.charge)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {rate.days[0] === rate.days[1]
                    ? `${rate.days[0]} business day`
                    : `${rate.days[0]}–${rate.days[1]} business days`}
                  {' '}— Est. arrival: <span className="font-medium text-gray-700">{est}</span>
                </p>
              </div>
              {selected === key && (
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </label>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
    </div>
  );
}
