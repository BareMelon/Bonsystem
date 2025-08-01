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
      <div className="container">
        <div className="header">
          <h1 className="logo">me&ma</h1>
          <p className="tagline">Bestil mad og drikke online</p>
        </div>
        <div className="card text-center">
          <p>Indlæser menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">me&ma</h1>
        <p className="tagline">Bestil mad og drikke online</p>
      </div>

      <div className="card">
        <h2>🍽️ Vælg din mad</h2>
        <div className="menu-section">
          <div className="menu-grid">
            {foodItems.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-selector">
                  <div 
                    className={`circle-selector ${getFoodItems().find(cartItem => cartItem.id === item.id) ? 'selected' : ''}`}
                    onClick={() => addToCart(item, 'food')}
                  >
                    {getFoodItems().find(cartItem => cartItem.id === item.id) && (
                      <div className="checkmark">✓</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="price">{item.price} kr</span>
                  </div>
                </div>
                {getFoodItems().find(cartItem => cartItem.id === item.id) && (
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => removeFromCart(item.id, 'food')}
                    >
                      -
                    </button>
                    <span className="quantity">{getFoodItems().find(cartItem => cartItem.id === item.id)?.quantity || 0}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => addToCart(item, 'food')}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <h2>🥤 Vælg dine drikke</h2>
        <div className="menu-section">
          <div className="menu-grid">
            {drinkItems.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-selector">
                  <div 
                    className={`circle-selector ${getDrinkItems().find(cartItem => cartItem.id === item.id) ? 'selected' : ''}`}
                    onClick={() => addToCart(item, 'drink')}
                  >
                    {getDrinkItems().find(cartItem => cartItem.id === item.id) && (
                      <div className="checkmark">✓</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="price">{item.price} kr</span>
                  </div>
                </div>
                {getDrinkItems().find(cartItem => cartItem.id === item.id) && (
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => removeFromCart(item.id, 'drink')}
                    >
                      -
                    </button>
                    <span className="quantity">{getDrinkItems().find(cartItem => cartItem.id === item.id)?.quantity || 0}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => addToCart(item, 'drink')}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {cart.length > 0 && (
          <>
            <h2>📋 Din bestilling</h2>
            <div className="order-review">
              {cart.map(item => (
                <div key={`${item.id}-${item.type}`} className="order-item">
                  <div className="item-details">
                    <div className="item-header">
                      <h4>{item.name}</h4>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                    <div className="item-price">{item.price * item.quantity} kr</div>
                  </div>
                  <div className="item-notes">
                    <input
                      type="text"
                      placeholder="Tilføj noter (f.eks. 'ingen løg', 'ekstra ost')"
                      value={item.notes}
                      onChange={(e) => updateItemNotes(item.id, item.type, e.target.value)}
                      className="notes-input"
                    />
                  </div>
                </div>
              ))}
              
              <div className="order-total">
                <h3>Total: {getCartTotal()} kr</h3>
              </div>

              <div className="customer-info">
                <h3>📞 Kontaktoplysninger</h3>
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
                    placeholder="Særlige ønsker eller allergier..."
                    rows={3}
                  />
                </div>
              </div>

              <button 
                className="btn submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sender...' : 'Send Bestilling'}
              </button>
            </div>
          </>
        )}

        {cart.length === 0 && (
          <div className="empty-cart">
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
    </div>
  );
};

export default Home; 