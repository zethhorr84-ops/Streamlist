import { Link } from 'react-router-dom';

const cartItems = [
  { id: 'subscription', name: 'StreamList Premium (demo)', description: 'One month of premium streaming access', price: 9.99 },
  { id: 'rental-credit', name: 'Movie rental credit (demo)', description: 'One fictional movie rental credit', price: 4.99 },
];

function Cart() {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="commerce-page">
      <header className="page-heading">
        <p className="eyebrow">Review your selection</p>
        <h1>Your Cart</h1>
        <p>These sample items provide a checkout flow for the course demonstration. No payment is processed.</p>
      </header>

      <div className="commerce-card">
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item-icon" aria-hidden="true">{item.id === 'subscription' ? '📺' : '🎟️'}</div>
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
              </div>
              <strong>${item.price.toFixed(2)}</strong>
            </article>
          ))}
        </div>

        <div className="cart-total">
          <span>Demo total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>

        <Link className="primary-button checkout-button" to="/checkout">
          Proceed to Checkout <span aria-hidden="true">→</span>
        </Link>
        <p className="form-footnote">Demo items and prices only. This application does not charge a card.</p>
      </div>
    </section>
  );
}

export default Cart;
