import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Users, Store, Package, ShoppingCart, Handshake, IndianRupee,
  TrendingUp, Clock, CheckCircle, XCircle, Edit, Trash2, Eye,
  RefreshCw, LogOut, BarChart3, Building2, FileText, Briefcase,
  Mail, Phone, MapPin, Calendar, User, CreditCard,
  IndianRupeeIcon, Shield
} from 'lucide-react';
import api from '../api';
import '../styles/AdminDashboard.css';
import '../styles/DashboardLayout.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, restaurantsRes, usersRes, pickupsRes, volunteersRes, menuItemsRes, partnershipsRes, donationsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/restaurants'),
        api.get('/admin/users'),
        api.get('/admin/pickups'),
        api.get('/admin/volunteers'),
        api.get('/admin/menu-items'),
        api.get('/admin/partnerships'),
        api.get('/admin/donations')
      ]);
      setStats(statsRes.data);
      setRestaurants(restaurantsRes.data);
      setUsers(usersRes.data);
      setPickups(pickupsRes.data);
      setVolunteers(volunteersRes.data);
      setMenuItems(menuItemsRes.data);
      setPartnerships(partnershipsRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      alert('User role updated successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!window.confirm('Are you sure you want to delete this restaurant and all its menu items?')) return;
    try {
      await api.delete(`/admin/restaurants/${restaurantId}`);
      alert('Restaurant deleted successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete restaurant');
    }
  };

  const handleUpdateVolunteerStatus = async (volunteerId, status) => {
    try {
      await api.put(`/admin/volunteers/${volunteerId}/status`, { status });
      alert('Volunteer status updated successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update volunteer status');
    }
  };

  const handleDeleteVolunteer = async (volunteerId) => {
    if (!window.confirm('Are you sure you want to delete this volunteer application?')) return;
    try {
      await api.delete(`/admin/volunteers/${volunteerId}`);
      alert('Volunteer application deleted successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete volunteer application');
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/admin/menu-items/${itemId}`);
      alert('Menu item deleted successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleUpdatePickupStatus = async (pickupId, status) => {
    try {
      await api.put(`/admin/pickups/${pickupId}/status`, { status });
      alert('Pickup status updated successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update pickup status');
    }
  };

  const handleUpdatePartnershipStatus = async (partnershipId, status, notes) => {
    try {
      await api.put(`/admin/partnerships/${partnershipId}/status`, { status, notes });
      alert('Partnership status updated successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update partnership status');
    }
  };

  const handleDeletePartnership = async (partnershipId) => {
    if (!window.confirm('Are you sure you want to delete this partnership?')) return;
    try {
      await api.delete(`/admin/partnerships/${partnershipId}`);
      alert('Partnership deleted successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete partnership');
    }
  };

  const handleUpdateDonationStatus = async (donationId, paymentStatus, status, notes) => {
    try {
      await api.put(`/admin/donations/${donationId}/status`, { paymentStatus, status, notes });
      alert('Donation status updated successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update donation status');
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      await api.delete(`/admin/donations/${donationId}`);
      alert('Donation deleted successfully');
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete donation');
    }
  };

  if (loading) {
    return <div className="admin-loading" style={{ color: '#333' }}>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
      <nav className="dashboard-top-nav">
        <div className="dashboard-nav-logo">
          <Shield size={24} color="#f97316" />
          MealConnect Admin
        </div>
        <div className="dashboard-nav-menu">
          <div className="dashboard-user-info">
            Welcome, <strong>{user?.name}</strong>
          </div>
          <button onClick={logout} className="dashboard-logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Body with Sidebar and Content */}
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-title">Menu</div>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} />
            Overview
          </button>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurants')}
          >
            <Store size={18} />
            Restaurants ({restaurants.length})
          </button>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Users ({users.length})
          </button>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'pickups' ? 'active' : ''}`}
            onClick={() => setActiveTab('pickups')}
          >
            <ShoppingCart size={18} />
            Pickups ({pickups.length})
          </button>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteers')}
          >
            <Handshake size={18} />
            Volunteers ({volunteers.length})
          </button>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'menu-items' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu-items')}
          >
            <Package size={18} />
            Menu Items ({menuItems.length})
          </button>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'partnerships' ? 'active' : ''}`}
            onClick={() => setActiveTab('partnerships')}
          >
            <Briefcase size={18} />
            Partnerships ({partnerships.length})
          </button>
          <button
            className={`dashboard-sidebar-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <IndianRupee size={18} />
            Donations ({donations.length})
          </button>
        </aside>

        <main className="dashboard-content-area">
          <div className="dashboard-header-simple">
            <h1>Admin Dashboard</h1>
            <button onClick={loadDashboardData} className="btn-refresh" style={{ background: 'white', border: '1px solid #e5e7eb' }}>
              <RefreshCw size={16} />
              Refresh Data
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'white', color: '#667eea' }}>
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: 'white' }}>{stats.users.total}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>Total Users</p>
              <div className="stat-breakdown">
                <span>Restaurants: {stats.users.byRole.restaurant || 0}</span>
                <span>NGOs: {stats.users.byRole.ngo || 0}</span>
                <span>Users: {stats.users.byRole.user || 0}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'white', color: '#48bb78' }}>
              <Store size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: 'white' }}>{stats.restaurants.total}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>Partner Restaurants</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'white', color: '#f56565' }}>
              <Package size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: 'white' }}>{stats.menuItems.active}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>Active Menu Items</p>
              <small style={{ color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>Total: {stats.menuItems.total}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'white', color: '#ed8936' }}>
              <ShoppingCart size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: 'white' }}>{stats.pickups.total}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>Total Pickups</p>
              <div className="stat-breakdown">
                <span>Pending: {stats.pickups.pending}</span>
                <span>Completed: {stats.pickups.completed}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'white', color: '#9f7aea' }}>
              <IndianRupeeIcon size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: 'white' }}>₹{stats.donations.totalAmount.toLocaleString()}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>Total Donations</p>
              <div className="stat-breakdown">
                <span>Standalone: {stats.donations.totalStandaloneDonations || 0}</span>
                <span>Completed: {stats.donations.completed || 0}</span>
                <span>Pending: {stats.donations.pending || 0}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'white', color: '#4299e1' }}>
              <Handshake size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: 'white' }}>{stats.volunteers.total}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>Volunteer Applications</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'white', color: '#ed8936' }}>
              <Briefcase size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: 'white' }}>{stats.partnerships.total}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>Partnerships</p>
              <div className="stat-breakdown">
                <span>Active: {stats.partnerships.active}</span>
                <span>Pending: {stats.partnerships.pending}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Quick Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Pickups</h3>
                <div className="recent-list">
                  {pickups.slice(0, 5).map(pickup => (
                    <div key={pickup._id} className="recent-item">
                      <span>{pickup.requestedBy?.name || pickup.requesterName}</span>
                      <span className={`status-badge status-${pickup.status}`}>
                        {pickup.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="overview-card">
                <h3>Recent Restaurants</h3>
                <div className="recent-list">
                  {restaurants.slice(0, 5).map(restaurant => (
                    <div key={restaurant._id} className="recent-item">
                      <span>{restaurant.name}</span>
                      <span>{restaurant.location}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="overview-card">
                <h3>Recent Partnerships</h3>
                <div className="recent-list">
                  {partnerships.slice(0, 5).map(partnership => (
                    <div key={partnership._id} className="recent-item">
                      <span>{partnership.businessName}</span>
                      <span className={`status-badge status-${partnership.status}`}>
                        {partnership.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="table-section">
            <h2>All Restaurants</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Owner</th>
                    <th>Menu Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map(restaurant => (
                    <tr key={restaurant._id}>
                      <td>{restaurant.name}</td>
                      <td>{restaurant.location}</td>
                      <td>{restaurant.contact || 'N/A'}</td>
                      <td>{restaurant.user?.name || 'N/A'}</td>
                      <td>{menuItems.filter(item => item.restaurant?._id === restaurant._id).length}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteRestaurant(restaurant._id)}
                          className="btn-delete-small"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="table-section">
            <h2>All Users</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(userItem => (
                    <tr key={userItem._id}>
                      <td>{userItem.name}</td>
                      <td>{userItem.email}</td>
                      <td>
                        <select
                          value={userItem.role}
                          onChange={(e) => handleUpdateUserRole(userItem._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="ngo">NGO</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(userItem._id)}
                          className="btn-delete-small"
                          disabled={userItem._id === user._id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pickups' && (
          <div className="table-section">
            <h2>All Pickup Requests</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pickups.map(pickup => (
                    <tr key={pickup._id}>
                      <td>{pickup.requestedBy?.name || pickup.requesterName}</td>
                      <td>{pickup.items.length} items</td>
                      <td>₹{pickup.totalAmount || 0}</td>
                      <td>
                        <select
                          value={pickup.status}
                          onChange={(e) => handleUpdatePickupStatus(pickup._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge status-${pickup.paymentStatus}`}>
                          {pickup.paymentStatus} ({pickup.paymentMethod || 'N/A'})
                        </span>
                      </td>
                      <td>{new Date(pickup.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() => {
                            const details = `Pickup Details:\nRequester: ${pickup.requestedBy?.name || pickup.requesterName}\nItems: ${pickup.items.length}\nAmount: ₹${pickup.totalAmount || 0}\nStatus: ${pickup.status}\nPayment: ${pickup.paymentStatus}`;
                            alert(details);
                          }}
                          className="btn-view"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="table-section">
            <h2>Volunteer Applications</h2>
            {volunteers.length === 0 ? (
              <div className="empty-state">
                <Handshake size={48} />
                <p>No volunteer applications yet</p>
              </div>
            ) : (
              <div className="volunteers-list">
                {volunteers.map(volunteer => (
                  <div key={volunteer._id} className="volunteer-card">
                    <div className="volunteer-header">
                      <div>
                        <h3>{volunteer.name}</h3>
                        <div className="volunteer-meta">
                          <span className={`status-badge status-${volunteer.status}`}>
                            {volunteer.status}
                          </span>
                          <span className="volunteer-date">
                            <Calendar size={16} />
                            {new Date(volunteer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="volunteer-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <Mail size={16} />
                          <span><strong>Email:</strong> {volunteer.email}</span>
                        </div>
                        <div className="detail-item">
                          <Phone size={16} />
                          <span><strong>Phone:</strong> {volunteer.phone}</span>
                        </div>
                        <div className="detail-item">
                          <Clock size={16} />
                          <span><strong>Availability:</strong> {volunteer.availability}</span>
                        </div>
                      </div>
                    </div>

                    <div className="volunteer-actions">
                      <select
                        value={volunteer.status}
                        onChange={(e) => handleUpdateVolunteerStatus(volunteer._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {volunteer.verificationProofUrl && (
                          <a
                            href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${volunteer.verificationProofUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-view"
                            title="View Proof"
                          >
                            <Eye size={16} />
                            View Proof
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteVolunteer(volunteer._id)}
                          className="btn-delete-small"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu-items' && (
          <div className="table-section">
            <h2>All Menu Items</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Restaurant</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.restaurant?.name || 'N/A'}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.expiryTime || 'N/A'}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteMenuItem(item._id)}
                          className="btn-delete-small"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'partnerships' && (
          <div className="table-section">
            <h2>Partnership Applications</h2>
            {partnerships.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={48} />
                <p>No partnership applications yet</p>
              </div>
            ) : (
              <div className="partnerships-list">
                {partnerships.map(partnership => (
                  <div key={partnership._id} className="partnership-card">
                    <div className="partnership-header">
                      <div>
                        <h3>{partnership.businessName}</h3>
                        <div className="partnership-meta">
                          <span className="partnership-type-badge">
                            {partnership.partnershipType === 'food' && '🍽️ Food Partner'}
                            {partnership.partnershipType === 'logistics' && '🚚 Logistics Partner'}
                            {partnership.partnershipType === 'ngo' && '🤝 NGO Partner'}
                            {partnership.partnershipType === 'sponsor' && '💼 Corporate Sponsor'}
                          </span>
                          <span className={`status-badge status-${partnership.status}`}>
                            {partnership.status}
                          </span>
                        </div>
                      </div>
                      <div className="partnership-date">
                        <Calendar size={16} />
                        {new Date(partnership.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="partnership-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <User size={16} />
                          <span><strong>Contact:</strong> {partnership.contactPerson}</span>
                        </div>
                        <div className="detail-item">
                          <Mail size={16} />
                          <span><strong>Email:</strong> {partnership.email}</span>
                        </div>
                        <div className="detail-item">
                          <Phone size={16} />
                          <span><strong>Phone:</strong> {partnership.phone}</span>
                        </div>
                        <div className="detail-item">
                          <Building2 size={16} />
                          <span><strong>Type:</strong> {partnership.businessType}</span>
                        </div>
                        <div className="detail-item">
                          <MapPin size={16} />
                          <span><strong>City:</strong> {partnership.city}</span>
                        </div>
                        {partnership.address && (
                          <div className="detail-item">
                            <MapPin size={16} />
                            <span><strong>Address:</strong> {partnership.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="partnership-message">
                        <strong>Message:</strong>
                        <p>{partnership.message}</p>
                      </div>

                      {partnership.notes && (
                        <div className="partnership-notes">
                          <strong>Admin Notes:</strong>
                          <p>{partnership.notes}</p>
                        </div>
                      )}

                      {partnership.approvedBy && (
                        <div className="partnership-approved">
                          <CheckCircle size={16} />
                          Approved by {partnership.approvedBy?.name} on {new Date(partnership.approvedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="partnership-actions">
                      <select
                        value={partnership.status}
                        onChange={(e) => {
                          const notes = window.prompt('Add notes (optional):', partnership.notes || '');
                          if (notes !== null) {
                            handleUpdatePartnershipStatus(partnership._id, e.target.value, notes);
                          }
                        }}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button
                        onClick={() => handleDeletePartnership(partnership._id)}
                        className="btn-delete-small"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="table-section">
            <h2>All Donations</h2>
            {donations.length === 0 ? (
              <div className="empty-state">
                <IndianRupeeIcon size={48} />
                <p>No donations yet</p>
              </div>
            ) : (
              <div className="donations-list">
                {donations.map(donation => (
                  <div key={donation._id} className="donation-card">
                    <div className="donation-header">
                      <div>
                        <h3>{donation.donorName}</h3>
                        <div className="donation-meta">
                          <span className="donation-amount-badge">
                            ₹{donation.amount.toLocaleString()}
                          </span>
                          <span className={`status-badge status-${donation.paymentStatus}`}>
                            {donation.paymentStatus}
                          </span>
                          <span className={`status-badge status-${donation.status}`}>
                            {donation.status}
                          </span>
                          <span className="donation-date">
                            <Calendar size={16} />
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="donation-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <Mail size={16} />
                          <span><strong>Email:</strong> {donation.donorEmail}</span>
                        </div>
                        <div className="detail-item">
                          <Phone size={16} />
                          <span><strong>Phone:</strong> {donation.donorPhone}</span>
                        </div>
                        <div className="detail-item">
                          <CreditCard size={16} />
                          <span><strong>Payment Method:</strong> {donation.paymentMethod.toUpperCase()}</span>
                        </div>
                        {donation.transactionId && (
                          <div className="detail-item">
                            <FileText size={16} />
                            <span><strong>Transaction ID:</strong> {donation.transactionId}</span>
                          </div>
                        )}
                        {donation.panCard && (
                          <div className="detail-item">
                            <User size={16} />
                            <span><strong>PAN Card:</strong> {donation.panCard}</span>
                          </div>
                        )}
                      </div>

                      {donation.notes && (
                        <div className="donation-notes">
                          <strong>Notes:</strong>
                          <p>{donation.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="donation-actions">
                      <select
                        value={donation.paymentStatus}
                        onChange={(e) => {
                          const notes = window.prompt('Add notes (optional):', donation.notes || '');
                          if (notes !== null) {
                            handleUpdateDonationStatus(donation._id, e.target.value, donation.status, notes);
                          }
                        }}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <select
                        value={donation.status}
                        onChange={(e) => {
                          const notes = window.prompt('Add notes (optional):', donation.notes || '');
                          if (notes !== null) {
                            handleUpdateDonationStatus(donation._id, donation.paymentStatus, e.target.value, notes);
                          }
                        }}
                        className="status-select"
                      >
                        <option value="active">Active</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <button
                        onClick={() => handleDeleteDonation(donation._id)}
                        className="btn-delete-small"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
        </main>
      </div>
    </div>
  );
}

