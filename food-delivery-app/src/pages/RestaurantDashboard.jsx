import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Plus, Store, Package, Image as Bell } from 'lucide-react';
import api from '../api';
import '../styles/RestaurantDashboard.css';

export default function RestaurantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [pickupRequests, setPickupRequests] = useState([]);
  
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    location: '',
    contact: '',
    image: ''
  });

  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    quantity: '',
    category: 'Main Course',
    expiryTime: '',
    image: null
  });

  const categories = ['Main Course', 'Rice', 'Bread', 'Dessert', 'Snacks', 'Beverages', 'Side Dish'];

  useEffect(() => {
    if (!user || user.role !== 'restaurant') {
      navigate('/login');
      return;
    }

    const loadDataInsideEffect = async () => {
      try {
        setLoading(true);
        let currentRestaurant = restaurant;
        
        try {
          const res = await api.get('/restaurants/my-restaurant');
          currentRestaurant = res.data;
          setRestaurant(currentRestaurant);
        } catch (err) {
          if (err.response?.status === 404) {
            setShowRestaurantForm(true);
            currentRestaurant = null;
          }
        }

        if (currentRestaurant) {
          try {
            const itemsRes = await api.get('/menu-items/my-items');
            setMenuItems(itemsRes.data);
          } catch (err) {
            console.error('Error loading menu items:', err);
          }

          try {
            const pickupsRes = await api.get('/pickups/my-restaurant');
            setPickupRequests(pickupsRes.data || []);
          } catch (err) {
            console.error('Error loading pickup requests:', err);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDataInsideEffect();
  }, [user, navigate]);

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (restaurant) {
        res = await api.put('/restaurants/my-restaurant', restaurantForm);
      } else {
        res = await api.post('/restaurants', restaurantForm);
      }
      setRestaurant(res.data);
      setShowRestaurantForm(false);
      alert('Restaurant profile saved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save restaurant profile');
    }
  };

  const handleMenuItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', menuItemForm.name);
      formData.append('quantity', menuItemForm.quantity);
      formData.append('category', menuItemForm.category);
      formData.append('expiryTime', menuItemForm.expiryTime);
      
      if (menuItemForm.image) {
        if (menuItemForm.image instanceof File) {
          formData.append('image', menuItemForm.image);
        } else if (typeof menuItemForm.image === 'string' && menuItemForm.image.trim()) {
          formData.append('image', menuItemForm.image);
        }
      }

      if (editingItem) {
        await api.put(`/menu-items/${editingItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Menu item updated successfully!');
      } else {
        await api.post('/menu-items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Menu item added successfully!');
      }

      setShowMenuItemForm(false);
      setEditingItem(null);
      setMenuItemForm({ name: '', quantity: '', category: 'Main Course', expiryTime: '', image: null });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/menu-items/${id}`);
      alert('Menu item deleted successfully!');
      // reload menu items after deletion
      const itemsRes = await api.get('/menu-items/my-items');
      setMenuItems(itemsRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setMenuItemForm({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      expiryTime: item.expiryTime,
      image: null
    });
    setShowMenuItemForm(true);
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
    return `${backendUrl}${image}`;
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="restaurant-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>🍽️ Restaurant Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="header-actions">
          <button onClick={logout} className="btn-secondary">Logout</button>
        </div>
      </div>

      {/* Restaurant Profile Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <Store size={24} />
          <h2>Restaurant Profile</h2>
          {restaurant && !showRestaurantForm && (
            <button onClick={() => {
              setRestaurantForm({
                name: restaurant.name || '',
                location: restaurant.location || '',
                contact: restaurant.contact || '',
                image: restaurant.image || ''
              });
              setShowRestaurantForm(true);
            }} className="btn-edit">Edit Profile</button>
          )}
        </div>

        {showRestaurantForm ? (
          <form onSubmit={handleRestaurantSubmit} className="restaurant-form">
            <div className="form-row">
              <div className="form-group">
                <label>Restaurant Name *</label>
                <input
                  type="text"
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={restaurantForm.location}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, location: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="text"
                  value={restaurantForm.contact}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, contact: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={restaurantForm.image}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Save Profile</button>
              {restaurant && (
                <button type="button" onClick={() => setShowRestaurantForm(false)} className="btn-cancel">
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : restaurant ? (
          <div className="restaurant-info">
            <div className="info-card">
              <h3>{restaurant.name}</h3>
              <p><strong>Location:</strong> {restaurant.location}</p>
              {restaurant.contact && <p><strong>Contact:</strong> {restaurant.contact}</p>}
            </div>
          </div>
        ) : null}
      </div>

      {/* Menu Items Section */}
      {restaurant && (
        <div className="dashboard-section">
          <div className="section-header">
            <Package size={24} />
            <h2>Menu Items</h2>
            <button onClick={() => {
              setEditingItem(null);
              setMenuItemForm({ name: '', quantity: '', category: 'Main Course', expiryTime: '', image: null });
              setShowMenuItemForm(true);
            }} className="btn-primary">
              <Plus size={18} />
              Add Menu Item
            </button>
          </div>

          {showMenuItemForm && (
            <form onSubmit={handleMenuItemSubmit} className="menu-item-form" encType="multipart/form-data">
              {/* --- Menu form fields remain unchanged --- */}
            </form>
          )}

          <div className="menu-items-grid">
            {menuItems.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>No menu items yet. Add your first item!</p>
              </div>
            ) : (
              menuItems.map((item) => {
                const imageUrl = getImageUrl(item.image);
                return (
                  <div key={item._id} className="menu-item-card">
                    {/* --- Menu item card remains unchanged --- */}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Pickup Requests Section */}
      {restaurant && (
        <div className="dashboard-section">
          <div className="section-header">
            <Bell size={24} />
            <h2>Pickup Requests</h2>
            {pickupRequests.length > 0 && (
              <span className="pickup-badge">{pickupRequests.length}</span>
            )}
          </div>
          {/* --- Pickup requests JSX unchanged --- */}
        </div>
      )}
    </div>
  );
}


