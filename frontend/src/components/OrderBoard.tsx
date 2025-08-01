import React, { useState, useEffect } from 'react';
import { orderAPI, Order } from '../services/api';
import './OrderBoard.css';

const OrderBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  // Sound notification
  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback for browsers that don't support audio
      console.log('Notification sound played');
    });
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      const newOrders = response.orders || [];
      
      // Check if there are new orders
      if (newOrders.length > lastOrderCount && lastOrderCount > 0) {
        playNotificationSound();
      }
      
      setOrders(newOrders);
      setLastOrderCount(newOrders.length);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    
    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setUpdatingOrder(id);
    
    try {
      await orderAPI.updateOrderStatus(id, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id 
            ? { ...order, status: newStatus as any }
            : order
        )
      );
      
      console.log(`Order ${id} status updated to ${newStatus}`);
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ny': return '#3b82f6'; // blue
      case 'behandles': return '#f59e0b'; // amber
      case 'klar': return '#10b981'; // green
      case 'afsendt': return '#8b5cf6'; // purple
      case 'annulleret': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ny': return 'Ny';
      case 'behandles': return 'Behandles';
      case 'klar': return 'Klar';
      case 'afsendt': return 'Afsendt';
      case 'annulleret': return 'Annulleret';
      default: return status;
    }
  };

  const canRevertStatus = (status: string) => {
    return ['behandles', 'klar', 'afsendt', 'annulleret'].includes(status);
  };

  const getPreviousStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'behandles': return 'ny';
      case 'klar': return 'behandles';
      case 'afsendt': return 'klar';
      case 'annulleret': return 'ny';
      default: return 'ny';
    }
  };

  if (loading) {
    return (
      <div className="order-board">
        <div className="loading-message">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p>Indlæser bestillinger...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-board">
        <div className="empty-board">
          <div className="empty-dots">
            <div className="empty-dot"></div>
            <div className="empty-dot"></div>
            <div className="empty-dot"></div>
          </div>
          <h3>Ingen bestillinger endnu</h3>
          <p>Når der kommer nye bestillinger, vil de vises her</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-board">
      <div className="board-header">
        <h2>Bestillings Oversigt</h2>
        <div className="order-count">
          <span className="count-number">{orders.length}</span>
          <span className="count-label">bestillinger</span>
        </div>
      </div>
      
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-note">
            <div className="note-header">
              <div className="order-id">#{order.id}</div>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getStatusText(order.status)}
              </div>
            </div>
            
            <div className="note-content">
              {order.mad && (
                <div className="order-item">
                  <strong>🍽️ Mad:</strong> {order.mad}
                </div>
              )}
              
              {order.drikke && (
                <div className="order-item">
                  <strong>🥤 Drikke:</strong> {order.drikke}
                </div>
              )}
              
              {order.ekstra_info && (
                <div className="order-item">
                  <strong>📝 Ekstra info:</strong> {order.ekstra_info}
                </div>
              )}
              
              {order.telefon && (
                <div className="order-item">
                  <strong>📞 Telefon:</strong> {order.telefon}
                </div>
              )}
              
              <div className="order-timestamp">
                {new Date(order.created_at).toLocaleString('da-DK')}
              </div>
            </div>
            
            <div className="note-actions">
              {order.status === 'ny' && (
                <button
                  className="action-btn process-btn"
                  onClick={() => handleStatusUpdate(order.id, 'behandles')}
                  disabled={updatingOrder === order.id}
                >
                  {updatingOrder === order.id ? 'Opdaterer...' : 'Behandles'}
                </button>
              )}
              
              {order.status === 'behandles' && (
                <>
                  <button
                    className="action-btn ready-btn"
                    onClick={() => handleStatusUpdate(order.id, 'klar')}
                    disabled={updatingOrder === order.id}
                  >
                    {updatingOrder === order.id ? 'Opdaterer...' : 'Klar'}
                  </button>
                  <button
                    className="action-btn back-btn"
                    onClick={() => handleStatusUpdate(order.id, 'ny')}
                    disabled={updatingOrder === order.id}
                  >
                    {updatingOrder === order.id ? 'Opdaterer...' : 'Tilbage'}
                  </button>
                </>
              )}
              
              {order.status === 'klar' && (
                <>
                  <button
                    className="action-btn sent-btn"
                    onClick={() => handleStatusUpdate(order.id, 'afsendt')}
                    disabled={updatingOrder === order.id}
                  >
                    {updatingOrder === order.id ? 'Opdaterer...' : 'Afsendt'}
                  </button>
                  <button
                    className="action-btn back-btn"
                    onClick={() => handleStatusUpdate(order.id, 'behandles')}
                    disabled={updatingOrder === order.id}
                  >
                    {updatingOrder === order.id ? 'Opdaterer...' : 'Tilbage'}
                  </button>
                </>
              )}
              
              {order.status === 'afsendt' && (
                <button
                  className="action-btn back-btn"
                  onClick={() => handleStatusUpdate(order.id, 'klar')}
                  disabled={updatingOrder === order.id}
                >
                  {updatingOrder === order.id ? 'Opdaterer...' : 'Tilbage'}
                </button>
              )}
              
              {canRevertStatus(order.status) && (
                <button
                  className="action-btn cancel-btn"
                  onClick={() => handleStatusUpdate(order.id, 'annulleret')}
                  disabled={updatingOrder === order.id}
                >
                  {updatingOrder === order.id ? 'Opdaterer...' : 'Annuller'}
                </button>
              )}
              
              {order.status === 'annulleret' && (
                <button
                  className="action-btn reactivate-btn"
                  onClick={() => handleStatusUpdate(order.id, getPreviousStatus(order.status))}
                  disabled={updatingOrder === order.id}
                >
                  {updatingOrder === order.id ? 'Opdaterer...' : 'Genaktiver'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBoard; 