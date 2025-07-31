import React, { useState, useEffect } from 'react';
import { orderAPI, Order } from '../services/api';
import './OrderBoard.css';

interface OrderBoardProps {
  refreshTrigger: number;
}

const OrderBoard: React.FC<OrderBoardProps> = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      if (response.success && response.orders) {
        setOrders(response.orders);
      } else {
        setError(response.error || 'Kunne ikke hente bestillinger');
      }
    } catch (err) {
      setError('Der opstod en fejl ved hentning af bestillinger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        // Refresh orders after status update
        fetchOrders();
      } else {
        setError(response.error || 'Kunne ikke opdatere status');
      }
    } catch (err) {
      setError('Der opstod en fejl ved opdatering af status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ny': return '#FFD700'; // Guld
      case 'behandles': return '#FF6B6B'; // Rød
      case 'klar': return '#4ECDC4'; // Turkis
      case 'afsendt': return '#45B7D1'; // Blå
      case 'annulleret': return '#95A5A6'; // Grå
      default: return '#F7DC6F'; // Gul
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ny': return 'NY';
      case 'behandles': return 'BEHANDLES';
      case 'klar': return 'KLAR';
      case 'afsendt': return 'AFSENDT';
      case 'annulleret': return 'ANNULLERET';
      default: return status.toUpperCase();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="order-board">
        <div className="board-header">
          <h2>📋 Bestillingsbord</h2>
        </div>
        <div className="loading-board">
          <div className="loading-spinner"></div>
          <p>Indlæser bestillinger...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-board">
        <div className="board-header">
          <h2>📋 Bestillingsbord</h2>
        </div>
        <div className="error-board">
          <p>❌ {error}</p>
          <button onClick={fetchOrders} className="retry-btn">Prøv igen</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-board">
      <div className="board-header">
        <h2>📋 Bestillingsbord</h2>
        <div className="board-stats">
          <span className="stat-item">
            <span className="stat-number">{orders.filter(o => o.status === 'ny').length}</span>
            <span className="stat-label">Nye</span>
          </span>
          <span className="stat-item">
            <span className="stat-number">{orders.filter(o => o.status === 'behandles').length}</span>
            <span className="stat-label">Behandles</span>
          </span>
          <span className="stat-item">
            <span className="stat-number">{orders.filter(o => o.status === 'klar').length}</span>
            <span className="stat-label">Klar</span>
          </span>
        </div>
      </div>

      <div className="sticky-wall">
        {orders.length === 0 ? (
          <div className="empty-board">
            <div className="empty-note">
              <h3>🎉 Ingen bestillinger!</h3>
              <p>Alle bestillinger er færdige</p>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order.id} 
              className="sticky-note"
              style={{ backgroundColor: getStatusColor(order.status || 'ny') }}
            >
              <div className="note-header">
                <span className="order-id">#{order.id}</span>
                <span className="order-time">{formatTime(order.created_at || '')}</span>
              </div>
              
              <div className="note-content">
                <div className="order-section">
                  <strong>🍽️ Mad:</strong>
                  <p>{order.mad}</p>
                </div>
                
                {order.drikke && (
                  <div className="order-section">
                    <strong>🥤 Drikke:</strong>
                    <p>{order.drikke}</p>
                  </div>
                )}
                
                {order.ekstra_info && (
                  <div className="order-section">
                    <strong>📝 Ekstra:</strong>
                    <p>{order.ekstra_info}</p>
                  </div>
                )}
                
                {order.telefon && (
                  <div className="order-section">
                    <strong>📞 Telefon:</strong>
                    <p>{order.telefon}</p>
                  </div>
                )}
              </div>

              <div className="note-footer">
                <div className="status-badge">
                  {getStatusText(order.status || 'ny')}
                </div>
                
                <div className="action-buttons">
                  {order.status === 'ny' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id!, 'behandles')}
                      className="action-btn behandles-btn"
                    >
                      Start
                    </button>
                  )}
                  
                  {order.status === 'behandles' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id!, 'klar')}
                      className="action-btn klar-btn"
                    >
                      Færdig
                    </button>
                  )}
                  
                  {order.status === 'klar' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id!, 'afsendt')}
                      className="action-btn afsendt-btn"
                    >
                      Afsendt
                    </button>
                  )}
                  
                  {order.status !== 'afsendt' && order.status !== 'annulleret' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id!, 'annulleret')}
                      className="action-btn annuller-btn"
                    >
                      Annuller
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderBoard; 