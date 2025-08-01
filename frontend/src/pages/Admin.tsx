import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import OrderBoard from '../components/OrderBoard';
import MenuManager from '../components/MenuManager';
import './Admin.css';

interface Settings {
  restaurant_name?: string;
  admin_phone?: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  twilio_phone_number?: string;
}

interface Stats {
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  readyOrders: number;
  sentOrders: number;
  cancelledOrders: number;
}

const Admin: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, statsData] = await Promise.all([
        adminAPI.getSettings(),
        adminAPI.getStats()
      ]);
      setSettings(settingsData);
      setStats(statsData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Kunne ikke indlæse data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (newSettings: Settings) => {
    try {
      await adminAPI.updateSettings(newSettings);
      setSettings(newSettings);
      setMessage({ type: 'success', text: 'Indstillinger opdateret' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Kunne ikke opdatere indstillinger' });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="logo">me&ma</h1>
          <p className="tagline">Admin Panel</p>
        </div>
        <div className="card text-center">
          <p>Indlæser...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">me&ma</h1>
        <p className="tagline">Admin Panel</p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="card">
          <h2>Statistik</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalOrders}</div>
              <div className="stat-label">Total Bestillinger</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.newOrders}</div>
              <div className="stat-label">Nye</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.processingOrders}</div>
              <div className="stat-label">Behandles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.readyOrders}</div>
              <div className="stat-label">Klar</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.sentOrders}</div>
              <div className="stat-label">Afsendt</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.cancelledOrders}</div>
              <div className="stat-label">Annulleret</div>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="card">
        <h2>Indstillinger</h2>
        
        <h3>Grundlæggende</h3>
        <div className="form-group">
          <label htmlFor="restaurant_name">Restaurant Navn</label>
          <input
            type="text"
            id="restaurant_name"
            value={settings.restaurant_name || ''}
            onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
            placeholder="me&ma"
          />
        </div>

        <h3>SMS Notifikationer (Twilio)</h3>
        <div className="form-group">
          <label htmlFor="admin_phone">Admin Telefon</label>
          <input
            type="tel"
            id="admin_phone"
            value={settings.admin_phone || ''}
            onChange={(e) => setSettings({ ...settings, admin_phone: e.target.value })}
            placeholder="+45 12 34 56 78"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="twilio_account_sid">Twilio Account SID</label>
          <input
            type="text"
            id="twilio_account_sid"
            value={settings.twilio_account_sid || ''}
            onChange={(e) => setSettings({ ...settings, twilio_account_sid: e.target.value })}
            placeholder="AC..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="twilio_auth_token">Twilio Auth Token</label>
          <input
            type="password"
            id="twilio_auth_token"
            value={settings.twilio_auth_token || ''}
            onChange={(e) => setSettings({ ...settings, twilio_auth_token: e.target.value })}
            placeholder="Auth Token"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="twilio_phone_number">Twilio Telefon</label>
          <input
            type="tel"
            id="twilio_phone_number"
            value={settings.twilio_phone_number || ''}
            onChange={(e) => setSettings({ ...settings, twilio_phone_number: e.target.value })}
            placeholder="+1234567890"
          />
        </div>

        <button 
          className="btn" 
          onClick={() => handleSettingsUpdate(settings)}
        >
          Gem Indstillinger
        </button>
      </div>

      {/* Order Board */}
      <div className="card">
        <h2>Bestillinger</h2>
        <OrderBoard />
      </div>

      {/* Menu Management */}
      <div className="card">
        <h2>Menu Styring</h2>
        <MenuManager />
      </div>

      <div className="admin-link">
        <a href="/">Tilbage til Bestilling</a>
      </div>
    </div>
  );
};

export default Admin; 