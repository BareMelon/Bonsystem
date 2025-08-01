import React, { useState, useEffect } from 'react';
import { orderAPI, menuAPI, MenuItem } from '../services/api';
import './Home.css';

const Home: React.FC = () => {
  const [formData, setFormData] = useState({
    mad: '',
    drikke: '',
    ekstra_info: '',
    telefon: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mad.trim()) {
      setMessage({ type: 'error', text: 'Venligst udfyld mad-feltet' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await orderAPI.createOrder(formData);
      setMessage({ type: 'success', text: 'Tak for din bestilling! Vi behandler den snart.' });
      setFormData({ mad: '', drikke: '', ekstra_info: '', telefon: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Der opstod en fejl. Prøv venligst igen.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">me&ma</h1>
        <p className="tagline">Bestil mad og drikke online</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center">
            <p>Indlæser menu...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mad">Mad *</label>
              <select
                id="mad"
                name="mad"
                value={formData.mad}
                onChange={handleInputChange}
                required
              >
                <option value="">Vælg mad</option>
                {foodItems.map(item => (
                  <option key={item.id} value={item.name}>
                    {item.name} - {item.price} kr
                  </option>
                ))}
              </select>
              {formData.mad && (
                <div className="item-description">
                  {foodItems.find(item => item.name === formData.mad)?.description}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="drikke">Drikke</label>
              <select
                id="drikke"
                name="drikke"
                value={formData.drikke}
                onChange={handleInputChange}
              >
                <option value="">Vælg drikke (valgfrit)</option>
                {drinkItems.map(item => (
                  <option key={item.id} value={item.name}>
                    {item.name} - {item.price} kr
                  </option>
                ))}
              </select>
              {formData.drikke && (
                <div className="item-description">
                  {drinkItems.find(item => item.name === formData.drikke)?.description}
                </div>
              )}
            </div>

          <div className="form-group">
            <label htmlFor="ekstra_info">Ekstra info</label>
            <textarea
              id="ekstra_info"
              name="ekstra_info"
              value={formData.ekstra_info}
              onChange={handleInputChange}
              placeholder="Særlige ønsker eller allergier"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefon">Telefon</label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleInputChange}
              placeholder="Dit telefonnummer (valgfrit)"
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={isSubmitting}
            style={{ width: '100%' }}
                      >
              {isSubmitting ? 'Sender...' : 'Send Bestilling'}
            </button>

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </form>
        )}
      </div>

      <div className="admin-link">
        <a href="/admin">Admin Panel</a>
      </div>
    </div>
  );
};

export default Home; 