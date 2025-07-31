import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, Order } from '../services/api';
import './Home.css';

const Home: React.FC = () => {
  const [formData, setFormData] = useState<Order>({
    mad: '',
    drikke: '',
    ekstra_info: '',
    telefon: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mad.trim()) {
      setError('Mad er påkrævet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderAPI.createOrder(formData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          mad: '',
          drikke: '',
          ekstra_info: '',
          telefon: ''
        });
      } else {
        setError(response.error || 'Der opstod en fejl ved oprettelse af bestillingen');
      }
    } catch (err) {
      setError('Der opstod en fejl ved oprettelse af bestillingen');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="home-page">
      <div className="container">
        <header className="header">
          <h1>🍽️ Bon System</h1>
          <p className="subtitle">Bestil mad og drikke online</p>
          <Link to="/admin" className="admin-link">👨‍💼 Admin Panel</Link>
        </header>

        {success ? (
          <div className="card success-card">
            <div className="success-icon">✅</div>
            <h2>Tak for din bestilling!</h2>
            <p>Din bestilling er blevet modtaget og behandles nu.</p>
            <p>Du vil modtage en bekræftelse snart.</p>
            <button onClick={handleNewOrder} className="btn new-order-btn">
              Placer ny bestilling
            </button>
          </div>
        ) : (
          <div className="card order-form-card">
            <h2>📝 Placer din bestilling</h2>
            <p className="form-description">
              Udfyld formularen nedenfor for at bestille mad og drikke
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="mad">🍽️ Mad *</label>
                <textarea
                  id="mad"
                  name="mad"
                  value={formData.mad}
                  onChange={handleInputChange}
                  placeholder="Beskriv hvad du vil bestille..."
                  required
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="drikke">🥤 Drikke</label>
                <input
                  type="text"
                  id="drikke"
                  name="drikke"
                  value={formData.drikke}
                  onChange={handleInputChange}
                  placeholder="F.eks. Cola, Vand, Kaffe..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="ekstra_info">📝 Evt. ekstra info</label>
                <textarea
                  id="ekstra_info"
                  name="ekstra_info"
                  value={formData.ekstra_info}
                  onChange={handleInputChange}
                  placeholder="Særlige ønsker, allergier, eller andre bemærkninger..."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefon">📞 Telefon (valgfrit)</label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleInputChange}
                  placeholder="+45 12 34 56 78"
                />
              </div>

              <button 
                type="submit" 
                className="btn submit-btn"
                disabled={loading}
              >
                {loading ? 'Sender bestilling...' : '📤 Send bestilling'}
              </button>
            </form>

            <div className="form-info">
              <p>💡 <strong>Tip:</strong> Jo mere detaljeret du er, jo bedre kan vi hjælpe dig!</p>
              <p>⏰ Din bestilling vil blive behandlet hurtigst muligt.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 