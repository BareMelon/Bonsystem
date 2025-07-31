import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderBoard from '../components/OrderBoard';
import { adminAPI, Settings, Stats } from '../services/api';
import './Admin.css';

const Admin: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsResponse, statsResponse] = await Promise.all([
        adminAPI.getSettings(),
        adminAPI.getStats()
      ]);

      if (settingsResponse.success) {
        setSettings(settingsResponse.settings || null);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats || null);
      }

      if (!settingsResponse.success || !statsResponse.success) {
        setError('Kunne ikke hente admin data');
      }
    } catch (err) {
      setError('Der opstod en fejl ved hentning af data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    fetchData();
  };

  const handleSettingUpdate = async (key: keyof Settings, value: string) => {
    if (!settings) return;

    try {
      const response = await adminAPI.updateSettings({ [key]: value });
      if (response.success) {
        setSettings(prev => prev ? { ...prev, [key]: value } : null);
      } else {
        setError(response.error || 'Kunne ikke opdatere indstilling');
      }
    } catch (err) {
      setError('Der opstod en fejl ved opdatering af indstilling');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-admin">
          <div className="loading-spinner"></div>
          <p>Indlæser admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <header className="header">
          <h1>👨‍💼 Admin Panel</h1>
          <Link to="/" className="back-btn">← Tilbage til bestilling</Link>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchData} className="retry-btn">Prøv igen</button>
          </div>
        )}

        <div className="admin-controls">
          <div className="control-buttons">
            <button 
              onClick={handleRefresh} 
              className="refresh-btn"
            >
              🔄 Opdater
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="settings-btn"
            >
              ⚙️ Indstillinger
            </button>
          </div>

          {stats && (
            <div className="stats-overview">
              <div className="stat-card">
                <span className="stat-number">{stats.total_orders}</span>
                <span className="stat-label">Total Bestillinger</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.today_orders}</span>
                <span className="stat-label">I Dag</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.new_orders}</span>
                <span className="stat-label">Nye</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.processing_orders}</span>
                <span className="stat-label">Behandles</span>
              </div>
            </div>
          )}
        </div>

        {showSettings && settings && (
          <div className="settings-panel">
            <h3>⚙️ System Indstillinger</h3>
            <div className="settings-grid">
              <div className="setting-group">
                <label>Restaurant Navn:</label>
                <input
                  type="text"
                  value={settings.restaurant_name}
                  onChange={(e) => handleSettingUpdate('restaurant_name', e.target.value)}
                  placeholder="Restaurant navn"
                />
              </div>
            </div>
          </div>
        )}

        <OrderBoard refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Admin; 