import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import OrderBoard from '../components/OrderBoard';
import './Admin.css';

interface Settings {
  restaurant_name?: string;
}

interface Stats {
  total_orders: number;
  new_orders: number;
  processing_orders: number;
  ready_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  today_orders: number;
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
              <div className="stat-number">{stats.total_orders}</div>
              <div className="stat-label">Total Bestillinger</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.new_orders}</div>
              <div className="stat-label">Nye</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.processing_orders}</div>
              <div className="stat-label">Behandles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.ready_orders}</div>
              <div className="stat-label">Klar</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.completed_orders}</div>
              <div className="stat-label">Afsendt</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.today_orders}</div>
              <div className="stat-label">I Dag</div>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="card">
        <h2>Indstillinger</h2>
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

      <div className="admin-link">
        <a href="/">Tilbage til Bestilling</a>
      </div>
    </div>
  );
};

export default Admin; 