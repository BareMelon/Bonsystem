import React, { useState, useEffect } from 'react';
import { menuAPI, MenuItem } from '../services/api';
import './MenuManager.css';

const MenuManager: React.FC = () => {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItemType, setNewItemType] = useState<'food' | 'drinks' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const [food, drinks] = await Promise.all([
        menuAPI.getFoodItems(),
        menuAPI.getDrinkItems()
      ]);
      setFoodItems(food);
      setDrinkItems(drinks);
      setError(null);
    } catch (err) {
      setError('Kunne ikke indlæse menu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem, type: 'food' | 'drinks') => {
    setEditingItem({ ...item, type } as any);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price
    });
    setNewItemType(null);
  };

  const handleAddNew = (type: 'food' | 'drinks') => {
    setNewItemType(type);
    setFormData({
      name: '',
      description: '',
      price: 0
    });
    setEditingItem(null);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        // Update existing item
        const type = (editingItem as any).type;
        if (type === 'food') {
          await menuAPI.updateFoodItem(editingItem.id, formData);
        } else {
          await menuAPI.updateDrinkItem(editingItem.id, formData);
        }
      } else if (newItemType) {
        // Create new item
        if (newItemType === 'food') {
          await menuAPI.createFoodItem(formData);
        } else {
          await menuAPI.createDrinkItem(formData);
        }
      }
      
      setEditingItem(null);
      setNewItemType(null);
      setFormData({ name: '', description: '', price: 0 });
      loadMenuItems();
    } catch (err) {
      setError('Kunne ikke gemme ændringer');
    }
  };

  const handleDelete = async (item: MenuItem, type: 'food' | 'drinks') => {
    if (window.confirm(`Er du sikker på at du vil slette "${item.name}"?`)) {
      try {
        if (type === 'food') {
          await menuAPI.deleteFoodItem(item.id);
        } else {
          await menuAPI.deleteDrinkItem(item.id);
        }
        loadMenuItems();
      } catch (err) {
        setError('Kunne ikke slette item');
      }
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewItemType(null);
    setFormData({ name: '', description: '', price: 0 });
  };

  if (loading) {
    return (
      <div className="menu-manager">
        <p>Indlæser menu...</p>
      </div>
    );
  }

  return (
    <div className="menu-manager">
      <div className="menu-section">
        <div className="section-header">
          <h3>Mad</h3>
          <button className="btn btn-secondary" onClick={() => handleAddNew('food')}>
            Tilføj Mad
          </button>
        </div>
        <div className="menu-items">
          {foodItems.map(item => (
            <div key={item.id} className="menu-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="price">{item.price} kr</span>
              </div>
              <div className="item-actions">
                <button 
                  className="action-btn secondary"
                  onClick={() => handleEdit(item, 'food')}
                >
                  Rediger
                </button>
                <button 
                  className="action-btn danger"
                  onClick={() => handleDelete(item, 'food')}
                >
                  Slet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="menu-section">
        <div className="section-header">
          <h3>Drikke</h3>
          <button className="btn btn-secondary" onClick={() => handleAddNew('drinks')}>
            Tilføj Drikke
          </button>
        </div>
        <div className="menu-items">
          {drinkItems.map(item => (
            <div key={item.id} className="menu-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="price">{item.price} kr</span>
              </div>
              <div className="item-actions">
                <button 
                  className="action-btn secondary"
                  onClick={() => handleEdit(item, 'drinks')}
                >
                  Rediger
                </button>
                <button 
                  className="action-btn danger"
                  onClick={() => handleDelete(item, 'drinks')}
                >
                  Slet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(editingItem || newItemType) && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {editingItem ? 'Rediger' : 'Tilføj'} {newItemType === 'food' || (editingItem as any)?.type === 'food' ? 'Mad' : 'Drikke'}
            </h3>
            
            <div className="form-group">
              <label htmlFor="name">Navn</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Navn på retten/drikken"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Beskrivelse</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beskrivelse og ingredienser"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Pris (kr)</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="Pris i kroner"
                min="0"
                step="1"
              />
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={handleSave}>
                Gem
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Annuller
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="message error">
          {error}
        </div>
      )}
    </div>
  );
};

export default MenuManager;