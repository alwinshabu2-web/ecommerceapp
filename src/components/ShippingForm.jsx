import { INDIAN_STATES } from '../utils/helpers';

function Field({ id, label, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ id, value, onChange, placeholder, error, type = 'text', autoComplete }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={!!error}
      className={`input-field ${error ? 'input-error' : ''}`}
    />
  );
}

export function ContactSection({ values, onChange, errors }) {
  const f = (field) => (val) => onChange({ ...values, [field]: val });
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-gray-900">A. Contact Information</h3>
      <Field id="fullName" label="Full Name" error={errors.fullName} required>
        <TextInput
          id="fullName"
          value={values.fullName}
          onChange={f('fullName')}
          placeholder="Ravi Kumar"
          error={errors.fullName}
          autoComplete="name"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="email" label="Email Address" error={errors.email} required>
          <TextInput
            id="email"
            type="email"
            value={values.email}
            onChange={f('email')}
            placeholder="ravi@example.com"
            error={errors.email}
            autoComplete="email"
          />
        </Field>
        <Field id="phone" label="Phone Number" error={errors.phone} required>
          <TextInput
            id="phone"
            type="tel"
            value={values.phone}
            onChange={f('phone')}
            placeholder="9876543210"
            error={errors.phone}
            autoComplete="tel"
          />
        </Field>
      </div>
    </div>
  );
}

export function AddressSection({ values, onChange, errors, prefix = '', title = 'B. Shipping Address' }) {
  const k = (field) => `${prefix}${field}`;
  const f = (field) => (val) => onChange({ ...values, [k(field)]: val });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <Field id={k('street')} label="House No. & Street" error={errors[k('street')]} required>
        <TextInput
          id={k('street')}
          value={values[k('street')] || ''}
          onChange={f('street')}
          placeholder="24, MG Road"
          error={errors[k('street')]}
          autoComplete="street-address"
        />
      </Field>
      <Field id={k('landmark')} label="Landmark" error={errors[k('landmark')]}>
        <TextInput
          id={k('landmark')}
          value={values[k('landmark')] || ''}
          onChange={f('landmark')}
          placeholder="Near Central Mall (optional)"
          error={errors[k('landmark')]}
          autoComplete="address-line2"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id={k('city')} label="City" error={errors[k('city')]} required>
          <TextInput
            id={k('city')}
            value={values[k('city')] || ''}
            onChange={f('city')}
            placeholder="Bengaluru"
            error={errors[k('city')]}
            autoComplete="address-level2"
          />
        </Field>
        <Field id={k('pin')} label="PIN Code" error={errors[k('pin')]} required>
          <TextInput
            id={k('pin')}
            value={values[k('pin')] || ''}
            onChange={f('pin')}
            placeholder="560001"
            error={errors[k('pin')]}
            autoComplete="postal-code"
          />
        </Field>
      </div>
      <Field id={k('state')} label="State" error={errors[k('state')]} required>
        <select
          id={k('state')}
          value={values[k('state')] || ''}
          onChange={e => f('state')(e.target.value)}
          aria-describedby={errors[k('state')] ? `${k('state')}-error` : undefined}
          aria-invalid={!!errors[k('state')]}
          autoComplete="address-level1"
          className={`input-field ${errors[k('state')] ? 'input-error' : ''}`}
        >
          <option value="">Select state…</option>
          {INDIAN_STATES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors[k('state')] && (
          <p id={`${k('state')}-error`} className="text-red-500 text-xs mt-1" role="alert">
            {errors[k('state')]}
          </p>
        )}
      </Field>
    </div>
  );
}
