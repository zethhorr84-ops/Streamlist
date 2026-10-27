import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'streamlist_demo_cards_v1';

function loadSavedCards() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function isExpiryValid(value) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

function Checkout() {
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [confirmedMockData, setConfirmedMockData] = useState(false);
  const [savedCards, setSavedCards] = useState(loadSavedCards);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards));
    } catch {
      setError('The browser could not save the demo card. Check localStorage availability.');
    }
  }, [savedCards]);

  const digitsOnly = useMemo(() => cardNumber.replace(/\D/g, ''), [cardNumber]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!cardholder.trim()) return setError('Enter the name shown on the demonstration card.');
    if (digitsOnly.length !== 16) return setError('Enter exactly 16 digits in the card number.');
    if (!isExpiryValid(expiry)) return setError('Enter a valid future expiration date in MM/YY format.');
    if (!/^\d{3,4}$/.test(cvv)) return setError('Enter a 3- or 4-digit security code for this demonstration.');
    if (!confirmedMockData) return setError('Confirm that you are using fictional test-card information only.');

    const newCard = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      cardholder: cardholder.trim(),
      // Assignment demonstration only: this field must contain a fictional test PAN.
      // Never use this browser-storage pattern with real payment-card data.
      cardNumber: formatCardNumber(digitsOnly),
      last4: digitsOnly.slice(-4),
      expiry,
      zipCode: zipCode.trim(),
      savedAt: new Date().toISOString(),
      isMockData: true,
    };

    setSavedCards((current) => [newCard, ...current]);
    setCardholder('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setZipCode('');
    setConfirmedMockData(false);
    setSuccess('Mock card details saved in this browser for the course demonstration. No payment was processed.');
  };

  const removeCard = (id) => {
    setSavedCards((current) => current.filter((card) => card.id !== id));
    setSuccess('Saved demo card removed from this browser.');
    setError('');
  };

  return (
    <section className="commerce-page">
      <header className="page-heading">
        <p className="eyebrow">Security and credit card management</p>
        <h1>Checkout</h1>
        <p>Enter fictional test details to demonstrate validation and browser persistence.</p>
      </header>

      <div className="checkout-layout">
        <section className="commerce-card checkout-form-card" aria-labelledby="card-form-heading">
          <div className="section-title-row">
            <span className="section-icon" aria-hidden="true">💳</span>
            <div>
              <h2 id="card-form-heading">Credit Card Details</h2>
              <p>All fields marked below are required for this demo.</p>
            </div>
          </div>

          <div className="notice notice-warning" role="note">
            <strong>Course demo only:</strong> Use fictional test values, never a real card. This assignment demo stores the mock card number and expiry in localStorage. The CVV is checked but never saved. Real applications should use a PCI-compliant payment provider and tokenization.
          </div>

          <form className="payment-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="cardholder">Cardholder name</label>
            <input id="cardholder" autoComplete="off" value={cardholder} onChange={(event) => setCardholder(event.target.value)} placeholder="Demo Cardholder" required />

            <label htmlFor="card-number">Card number</label>
            <input
              id="card-number"
              inputMode="numeric"
              autoComplete="off"
              value={cardNumber}
              onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
              placeholder="1234 5678 9012 3456"
              aria-describedby="card-number-help"
              maxLength={19}
              required
            />
            <p id="card-number-help" className="field-help">Format: 1234 5678 9012 3456 (16 digits).</p>

            <div className="form-row">
              <div>
                <label htmlFor="expiry">Expiration (MM/YY)</label>
                <input id="expiry" inputMode="numeric" autoComplete="off" value={expiry} onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                  setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                }} placeholder="MM/YY" maxLength={5} required />
              </div>
              <div>
                <label htmlFor="cvv">Security code (CVV)</label>
                <input id="cvv" type="password" inputMode="numeric" autoComplete="off" value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} required />
              </div>
            </div>

            <label htmlFor="zip-code">Billing ZIP/postal code (optional)</label>
            <input id="zip-code" autoComplete="off" value={zipCode} onChange={(event) => setZipCode(event.target.value.slice(0, 12))} placeholder="12345" />

            <label className="mock-data-check">
              <input type="checkbox" checked={confirmedMockData} onChange={(event) => setConfirmedMockData(event.target.checked)} />
              <span>I confirm these are fictional test-card details, not a real payment card.</span>
            </label>

            {error && <p className="notice notice-error" role="alert">{error}</p>}
            {success && <p className="notice notice-success" role="status">{success}</p>}

            <button className="primary-button" type="submit">Save Demo Card</button>
          </form>
        </section>

        <aside className="commerce-card saved-cards-card" aria-labelledby="saved-cards-heading">
          <div className="section-title-row">
            <span className="section-icon" aria-hidden="true">🗂️</span>
            <div>
              <h2 id="saved-cards-heading">Saved Demo Cards</h2>
              <p>Stored in this browser only</p>
            </div>
          </div>
          {savedCards.length === 0 ? (
            <div className="saved-cards-empty">
              <span aria-hidden="true">💳</span>
              <p>No demo cards saved yet.</p>
            </div>
          ) : (
            <ul className="saved-card-list">
              {savedCards.map((card) => (
                <li className="saved-card-item" key={card.id}>
                  <div className="saved-card-topline"><span aria-hidden="true">💳</span><strong>Demo card ending {card.last4}</strong></div>
                  <p>{card.cardholder}</p>
                  <p>Expires {card.expiry}</p>
                  <button className="text-button danger-text" type="button" onClick={() => removeCard(card.id)}>Remove demo card</button>
                </li>
              ))}
            </ul>
          )}
          <p className="storage-note"><strong>Storage note:</strong> The number shown here is mock data and persists in localStorage. Never store a real PAN or CVV in browser storage.</p>
          <Link className="secondary-button" to="/cart">← Back to Cart</Link>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
