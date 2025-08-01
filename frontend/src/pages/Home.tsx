import React, { useState, useEffect } from 'react';
import { orderAPI, menuAPI, MenuItem } from '../services/api';
import './Home.css';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'food' | 'drink';
  quantity: number;
  notes: string;
}

const Home: React.FC = () => {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    telefon: '',
    ekstra_info: ''
  });

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const [food, drinks] = await Promise.all([
          menuAPI.getFoodItems(),
          menuAPI.getDrinkItems()
        ]);
        setFoodItems(food);
        setDrinkItems(drinks);
      } catch (error) {
        console.error('Failed to load menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMenuItems();
  }, []);

  const addToCart = (item: MenuItem, type: 'food' | 'drink') => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === type);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id && cartItem.type === type
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        type,
        quantity: 1,
        notes: ''
      }]);
    }
  };

  const removeFromCart = (itemId: number, type: 'food' | 'drink') => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId && cartItem.type === type);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId && cartItem.type === type
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => !(cartItem.id === itemId && cartItem.type === type)));
    }
  };

  const updateItemNotes = (itemId: number, type: 'food' | 'drink', notes: string) => {
    setCart(cart.map(cartItem => 
      cartItem.id === itemId && cartItem.type === type
        ? { ...cartItem, notes }
        : cartItem
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getFoodItems = () => cart.filter(item => item.type === 'food');
  const getDrinkItems = () => cart.filter(item => item.type === 'drink');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Du skal vælge mindst én ret eller drikke' });
      return;
    }
    setIsSubmitting(true);
    try {
      const foodItems = getFoodItems();
      const drinkItems = getDrinkItems();
      const orderData = {
        mad: foodItems.map(item => `${item.name}${item.notes ? ` (${item.notes})` : ''}`).join(', '),
        drikke: drinkItems.map(item => `${item.name}${item.notes ? ` (${item.notes})` : ''}`).join(', '),
        ekstra_info: customerInfo.ekstra_info,
        telefon: customerInfo.telefon
      };
      await orderAPI.createOrder(orderData);
      setMessage({ type: 'success', text: 'Bestilling modtaget! Tak for din bestilling.' });
      setCart([]);
      setCustomerInfo({ telefon: '', ekstra_info: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Der opstod en fejl ved afsendelse af bestillingen' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container order-bg">
        <div className="header">
          <h1 className="logo">me&ma</h1>
          <p className="tagline">Bestil mad og drikke online</p>
        </div>
        <div className="order-card text-center">
          <p>Indlæser menu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container order-bg">
      <div className="header">
        <h1 className="logo restaurant-logo">me&ma</h1>
        <p className="tagline">Bestil mad og drikke online</p>
      </div>

      <div className="order-main-content">
        <div className="allergen-banner minimal-banner">
          <div className="allergen-icon">🍃</div>
          <p>Har du allergier eller særlige ønsker? Skriv det i noter eller spørg personalet</p>
        </div>

        <section className="menu-section minimal-section">
          <h2 className="section-title minimal-title">Vælg din mad</h2>
          <div className="menu-grid minimal-menu-grid">
            {foodItems.map(item => (
              <div key={item.id} className="menu-item minimal-menu-item">
                <div className="item-header-row">
                  <div className="item-title-row">
                    <span className="item-name minimal-item-name">{item.name}</span>
                    <span className="item-price minimal-item-price">{item.price} kr</span>
                  </div>
                  <div className="item-desc minimal-item-desc">{item.description}</div>
                </div>
                <div className="item-actions-row">
                  <button className="minimal-qty-btn" onClick={() => removeFromCart(item.id, 'food')} disabled={!getFoodItems().find(cartItem => cartItem.id === item.id)}>-</button>
                  <span className="minimal-qty">{getFoodItems().find(cartItem => cartItem.id === item.id)?.quantity || 0}</span>
                  <button className="minimal-qty-btn" onClick={() => addToCart(item, 'food')}>+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="menu-section minimal-section">
          <h2 className="section-title minimal-title">Vælg dine drikke</h2>
          <div className="menu-grid minimal-menu-grid">
            {drinkItems.map(item => (
              <div key={item.id} className="menu-item minimal-menu-item">
                <div className="item-header-row">
                  <div className="item-title-row">
                    <span className="item-name minimal-item-name">{item.name}</span>
                    <span className="item-price minimal-item-price">{item.price} kr</span>
                  </div>
                  <div className="item-desc minimal-item-desc">{item.description}</div>
                </div>
                <div className="item-actions-row">
                  <button className="minimal-qty-btn" onClick={() => removeFromCart(item.id, 'drink')} disabled={!getDrinkItems().find(cartItem => cartItem.id === item.id)}>-</button>
                  <span className="minimal-qty">{getDrinkItems().find(cartItem => cartItem.id === item.id)?.quantity || 0}</span>
                  <button className="minimal-qty-btn" onClick={() => addToCart(item, 'drink')}>+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {cart.length > 0 && (
          <section className="order-section minimal-order-section">
            <h2 className="section-title minimal-title">Din bestilling</h2>
            <div className="order-review minimal-order-review">
              {cart.map(item => (
                <div key={`${item.id}-${item.type}`} className="order-item minimal-order-item">
                  <div className="item-details minimal-order-details">
                    <div className="item-header minimal-order-header">
                      <span className="item-name minimal-item-name">{item.name}</span>
                      <span className="item-quantity minimal-item-quantity">x{item.quantity}</span>
                      <span className="item-price minimal-item-price">{item.price * item.quantity} kr</span>
                    </div>
                    <div className="item-notes minimal-item-notes">
                      <input
                        type="text"
                        placeholder="Tilføj noter (f.eks. 'ingen løg', 'ekstra ost')"
                        value={item.notes}
                        onChange={(e) => updateItemNotes(item.id, item.type, e.target.value)}
                        className="notes-input minimal-notes-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="order-total minimal-order-total">
                <h3>Total: {getCartTotal()} kr</h3>
              </div>
              <div className="customer-info minimal-customer-info">
                <h3>Kontaktoplysninger</h3>
                <div className="form-group">
                  <label htmlFor="telefon">Telefonnummer</label>
                  <input
                    type="tel"
                    id="telefon"
                    value={customerInfo.telefon}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, telefon: e.target.value })}
                    placeholder="+45 12 34 56 78"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ekstra_info">Ekstra information</label>
                  <textarea
                    id="ekstra_info"
                    value={customerInfo.ekstra_info}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, ekstra_info: e.target.value })}
                    placeholder="Særlige ønsker, allergier eller andre bemærkninger..."
                    rows={3}
                  />
                </div>
              </div>
              <button 
                className="btn submit-btn minimal-submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sender...' : 'Send Bestilling'}
              </button>
            </div>
          </section>
        )}

        {cart.length === 0 && (
          <div className="empty-cart minimal-empty-cart">
            <p>Vælg mad og drikke fra menuen ovenfor</p>
          </div>
        )}
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-link">
        <a href="/admin">Admin Panel</a>
      </div>

      <Footer />
    </div>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Kontakt</h4>
          <p>Har du spørgsmål eller feedback?</p>
          <a href="mailto:itsmeandma@gmail.com" className="contact-link">
            itsmeandma@gmail.com
          </a>
        </div>
        
        <div className="footer-section">
          <h4>Links</h4>
          <div className="footer-links">
            <a href="/tos" className="footer-link">Vilkår og betingelser</a>
            <a href="/privacy" className="footer-link">Privatlivspolitik</a>
            <a href="/admin" className="footer-link">Admin</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>me&ma</h4>
          <p>Bestil mad og drikke online</p>
          <div className="allergen-info">
            <div className="allergen-icon-small">🍃</div>
            <p>Har du allergier? Skriv det i noter eller spørg personalet</p>
          </div>
          <p className="copyright">© 2024 me&ma. Alle rettigheder forbeholdes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Home; 