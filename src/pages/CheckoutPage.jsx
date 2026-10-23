import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ContactSection, AddressSection } from '../components/ShippingForm';
import DeliveryOptions from '../components/DeliveryOptions';
import PaymentOptions from '../components/PaymentOptions';
import OrderSummary from '../components/OrderSummary';
import OrderSuccessModal from '../components/OrderSuccessModal';
import {
  validateContact,
  validateAddress,
  calcCartTotals,
  estimateDelivery,
  generateOrderId,
  formatDateTime,
  saveOrder,
  safeRead,
  safeWrite,
  formatPrice,
} from '../utils/helpers';

const FORM_STORAGE_KEY = 'ecp_checkout_form';

const emptyContact = { fullName: '', email: '', phone: '' };
const emptyAddress = { street: '', landmark: '', city: '', state: '', pin: '' };

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load persisted form data
  const saved = safeRead(FORM_STORAGE_KEY, {});

  const [contact, setContact] = useState({ ...emptyContact, ...saved.contact });
  const [shipping, setShipping] = useState({ ...emptyAddress, ...saved.shipping });
  const [sameAsBilling, setSameAsBilling] = useState(saved.sameAsBilling ?? true);
  const [billing, setBilling] = useState({ ...emptyAddress, ...saved.billing });
  const [delivery, setDelivery] = useState(saved.delivery || 'standard');
  const [payment, setPayment] = useState(saved.payment || '');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handlePaymentChange = (method) => {
    setPayment(method);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.payment;
      delete next.upiId;
      delete next.cardholderName;
      delete next.cardNumber;
      delete next.expiryDate;
      delete next.cvv;
      return next;
    });
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Persist non-sensitive fields on every change
  useEffect(() => {
    safeWrite(FORM_STORAGE_KEY, { contact, shipping, sameAsBilling, billing, delivery, payment });
  }, [contact, shipping, sameAsBilling, billing, delivery, payment]);

  const couponCode = safeRead('ecp_coupon', '');
  const { subtotal, shipping: shippingCost, discount, tax, total } = calcCartTotals(cart, delivery, couponCode);

  // If cart is empty and no order was just placed, show empty state
  if (cart.length === 0 && !createdOrder) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products before checking out.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </main>
    );
  }

  function validate() {
    const contactErrors = validateContact(contact);
    const shippingErrors = validateAddress(shipping);
    const billingErrors = !sameAsBilling ? validateAddress(billing, 'billing_') : {};
    const miscErrors = {};
    if (!delivery) miscErrors.delivery = 'Please select a delivery method.';
    if (!payment) miscErrors.payment = 'Please select a payment method.';

    if (payment === 'upi') {
      if (!paymentDetails.upiId?.trim()) {
        miscErrors.upiId = 'UPI ID is required.';
      } else if (!/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId.trim())) {
        miscErrors.upiId = 'Please enter a valid UPI ID (e.g. name@bank or mobile@upi).';
      }
    } else if (payment === 'card') {
      if (!paymentDetails.cardholderName?.trim()) {
        miscErrors.cardholderName = 'Cardholder name is required.';
      }
      const rawCardNum = (paymentDetails.cardNumber || '').replace(/\s+/g, '');
      if (!rawCardNum) {
        miscErrors.cardNumber = 'Card number is required.';
      } else if (!/^\d{15,19}$/.test(rawCardNum)) {
        miscErrors.cardNumber = 'Please enter a valid card number.';
      }
      if (!paymentDetails.expiryDate?.trim()) {
        miscErrors.expiryDate = 'Expiry date is required.';
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentDetails.expiryDate.trim())) {
        miscErrors.expiryDate = 'Enter a valid expiry date (MM/YY).';
      }
      if (!paymentDetails.cvv?.trim()) {
        miscErrors.cvv = 'CVV is required.';
      } else if (!/^\d{3,4}$/.test(paymentDetails.cvv.trim())) {
        miscErrors.cvv = 'Enter a valid 3 or 4-digit CVV.';
      }
    }

    return { ...contactErrors, ...shippingErrors, ...billingErrors, ...miscErrors };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Scroll to first error
      const firstErrorEl = document.querySelector('[aria-invalid="true"], [role="alert"]');
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    // Simulate order placement processing
    setTimeout(() => {
      const orderId = generateOrderId();
      const now = new Date();
      const orderDateISO = now.toISOString();

      const deliveryLabel = {
        standard: 'Standard Delivery',
        express: 'Express Delivery',
        overnight: 'Overnight Delivery',
      }[delivery] || 'Standard Delivery';

      const paymentMethodLabel = {
        cod: 'Cash on Delivery',
        upi: 'UPI',
        card: 'Credit/Debit Card',
      }[payment] || 'Cash on Delivery';

      const paymentStatus = payment === 'cod' ? 'Payment Pending' : 'Demo Payment Successful';

      const order = {
        id: orderId,
        date: orderDateISO,
        formattedDate: formatDateTime(orderDateISO),
        items: [...cart], // Snapshot of purchased items
        contact: { ...contact },
        shippingAddress: { ...shipping },
        billingAddress: sameAsBilling ? { ...shipping } : { ...billing },
        sameAsBilling,
        deliveryKey: delivery,
        deliveryLabel,
        deliveryCharge: shippingCost,
        estimatedDelivery: estimateDelivery(delivery),
        paymentKey: payment,
        paymentMethod: paymentMethodLabel,
        paymentStatus,
        status: 'Order Placed',
        subtotal,
        discount,
        couponCode: couponCode || null,
        tax,
        total,
      };

      // 1. Save order permanently in localStorage
      saveOrder(order);

      // 1b. Initialize tracking progression for newly created order (starts running at Order Placed)
      try {
        const raw = localStorage.getItem('ecoconstruct_order_tracking');
        const trackingMap = raw ? JSON.parse(raw) : {};
        trackingMap[orderId] = {
          status: 'Order Placed',
          mode: 'running',
          elapsed: 0,
          lastUpdated: Date.now(),
        };
        localStorage.setItem('ecoconstruct_order_tracking', JSON.stringify(trackingMap));
      } catch (err) {
        console.warn('Could not save tracking init:', err);
      }

      // 2. Clear persisted draft form and applied coupon
      safeWrite(FORM_STORAGE_KEY, {});
      localStorage.removeItem('ecp_coupon');

      // 3. Clear cart only AFTER order is successfully saved
      clearCart();
      setPaymentDetails({ upiId: '', cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });

      // 4. Save created order state and open Success Modal
      setCreatedOrder(order);
      setShowSuccessModal(true);
      setSubmitting(false);
    }, 900);
  }

  function handleViewDetails(orderId) {
    setShowSuccessModal(false);
    navigate(`/orders?id=${orderId}`);
  }

  function handleContinueShopping() {
    setShowSuccessModal(false);
    navigate('/');
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your order details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column — form sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Global validation error summary */}
              {hasErrors && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-semibold text-sm">Please fix the following errors:</p>
                    <ul className="mt-1 space-y-0.5 text-sm text-red-700 list-disc list-inside">
                      {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* A. Contact */}
              <FormSection>
                <ContactSection values={contact} onChange={setContact} errors={errors} />
              </FormSection>

              {/* B. Shipping Address */}
              <FormSection>
                <AddressSection
                  values={shipping}
                  onChange={setShipping}
                  errors={errors}
                  title="B. Shipping Address"
                />
              </FormSection>

              {/* C. Billing Address */}
              <FormSection>
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900">C. Billing Address</h3>
                  <label
                    htmlFor="same-as-shipping"
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      id="same-as-shipping"
                      checked={sameAsBilling}
                      onChange={e => setSameAsBilling(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Billing address is the same as shipping address
                    </span>
                  </label>

                  {!sameAsBilling && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                      <AddressSection
                        values={billing}
                        onChange={setBilling}
                        errors={errors}
                        prefix="billing_"
                        title="Billing Address Details"
                      />
                    </div>
                  )}
                </div>
              </FormSection>

              {/* D. Delivery */}
              <FormSection>
                <DeliveryOptions
                  selected={delivery}
                  onChange={setDelivery}
                  error={errors.delivery}
                />
              </FormSection>

              {/* E. Payment */}
              <FormSection>
                <PaymentOptions
                  selected={payment}
                  onChange={handlePaymentChange}
                  error={errors.payment}
                  details={paymentDetails}
                  onDetailsChange={handlePaymentDetailsChange}
                  errors={errors}
                />
              </FormSection>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center text-base py-4 shadow-lg shadow-primary-900/20"
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing Order…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Place Order — {formatPrice(total)}
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  🔒 Demo order — no real payment processed · No card details collected
                </p>
              </div>
            </div>

            {/* Right column — live order summary */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <OrderSummary cart={cart} deliveryKey={delivery} promoCode={couponCode} showItems />

              {/* Estimated delivery recap */}
              <div className="mt-4 bg-primary-50 border border-primary-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-primary-800 mb-1">Estimated Delivery</p>
                <p className="text-sm text-primary-700">
                  {estimateDelivery(delivery)}
                </p>
                <p className="text-xs text-primary-500 mt-1 italic">
                  Sample estimate — not a guaranteed date or service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Order Success Popup Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        order={createdOrder}
        onViewDetails={handleViewDetails}
        onContinueShopping={handleContinueShopping}
      />
    </main>
  );
}

function FormSection({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {children}
    </div>
  );
}
