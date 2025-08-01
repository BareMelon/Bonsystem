import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './OrderBoard.css';

interface Order {
  id: number;
  mad: string;
  drikke?: string;
  ekstra_info?: string;
  telefon?: string;
  status: 'ny' | 'behandles' | 'klar' | 'afsendt' | 'annulleret';
  created_at: string;
  updated_at: string;
}

const OrderBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderAPI.getAllOrders();
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError('Kunne ikke hente bestillinger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      console.log('Calling API...');
      const result = await orderAPI.updateOrderStatus(orderId, newStatus);
      console.log('API result:', result);
      console.log('Status updated successfully');
      // Refresh orders after update
      await fetchOrders();
    } catch (err) {
      console.error('Status update error:', err);
      console.error('Error details:', err);
      setError('Kunne ikke opdatere status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ny': 'Ny',
      'behandles': 'Behandles',
      'klar': 'Klar',
      'afsendt': 'Afsendt',
      'annulleret': 'Annulleret'
    };
    return statusMap[status] || status;
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow: { [key: string]: string } = {
      'ny': 'behandles',
      'behandles': 'klar',
      'klar': 'afsendt'
    };
    return statusFlow[currentStatus];
  };

  if (loading) {
    return (
      <div className="order-board">
        <div className="loading-state">
          <p>Indlæser bestillinger...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-board">
        <div className="empty-state">
          <p>{error}</p>
          <button className="btn" onClick={fetchOrders}>
            Prøv igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-board">
      <div className="order-board-header">
        <h2 className="order-board-title">Bestillinger</h2>
        <button className="refresh-btn" onClick={fetchOrders}>
          Opdater
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>Ingen bestillinger endnu</h3>
          <p>Når kunder bestiller, vises de her som sticky notes</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-note">
              <div className="order-header">
                <span className="order-id">#{order.id}</span>
                <span className="order-time">{formatTime(order.created_at)}</span>
              </div>

              <div className="order-content">
                <div className="order-mad">{order.mad}</div>
                {order.drikke && (
                  <div className="order-drikke">🥤 {order.drikke}</div>
                )}
                {order.ekstra_info && (
                  <div className="order-ekstra">💬 {order.ekstra_info}</div>
                )}
                {order.telefon && (
                  <div className="order-telefon">📞 {order.telefon}</div>
                )}
              </div>

              <div className={`status-badge status-${order.status}`}>
                {getStatusText(order.status)}
              </div>

              <div className="order-actions">
                {getNextStatus(order.status) && (
                  <button
                    className="action-btn primary"
                    onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status)!)}
                    disabled={updatingOrder === order.id}
                  >
                    {updatingOrder === order.id ? 'Opdaterer...' : getStatusText(getNextStatus(order.status)!)}
                  </button>
                )}
                
                {order.status !== 'annulleret' && (
                  <button
                    className="action-btn danger"
                    onClick={() => handleStatusUpdate(order.id, 'annulleret')}
                    disabled={updatingOrder === order.id}
                  >
                    {updatingOrder === order.id ? 'Opdaterer...' : 'Annuller'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderBoard; 