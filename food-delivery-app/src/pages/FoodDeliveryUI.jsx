import React, { useEffect, useState } from 'react';
import { ShoppingCart, User, Star, Package, Clock, MapPin, Plus, Minus, Menu as MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/FoodDeliveryUI.css';
import '../styles/Menu.css';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext.jsx';

import api from '../api';

export default function FoodDeliveryUI() {
  const { user } = useAuth();
  // Donation-based food items (now from live API)
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const { data } = await api.get('/menu-items');
        const mapped = data.slice(0, 15).map((item) => ({
          id: item._id,
          name: item.name,
          image: item.image || '',
          restaurant: item.restaurant,
          restaurantName: item.restaurant?.name || 'Unknown',
          restaurantLocation: item.restaurant?.location || '',
          quantity: item.quantity,
          category: item.category,
          expiryTime: item.expiryTime,
          price: Math.floor(Math.random() * 300) + 50,
          rating: (4 + Math.random() * 1).toFixed(1)
        }));
        setFoodItems(mapped);
      } catch (error) {
        console.error('Error loading menu items:', error);
        setFoodItems([]);
      }
    };
    loadMenuItems();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('mealconnect_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  // Update cart in localStorage when it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('mealconnect_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('mealconnect_cart');
    }
  }, [cart]);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
    return `${backendUrl}${image}`;
  };

  const getCartQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? (cartItem.cartQuantity || 1) : 0;
  };

  const handleAddToCart = (item) => {
    const existingCartItem = cart.find(c => c.id === item.id);
    
    let newCart;
    if (existingCartItem) {
      newCart = cart.map(c => 
        c.id === item.id 
          ? { ...c, cartQuantity: (c.cartQuantity || 1) + 1 }
          : c
      );
    } else {
      const cartItem = {
        ...item,
        restaurantName: item.restaurant?.name || item.restaurantName || 'Unknown',
        restaurantLocation: item.restaurant?.location || item.restaurantLocation || '',
        restaurant: item.restaurant,
        restaurantId: item.restaurant?._id || item.restaurant?.id || item.restaurantId,
        cartId: Date.now(),
        cartQuantity: 1
      };
      newCart = [...cart, cartItem];
    }
    setCart(newCart);
  };

  const handleUpdateQuantity = (itemId, change) => {
    const cartItem = cart.find(item => item.id === itemId);
    if (!cartItem) return;
    
    const newQuantity = (cartItem.cartQuantity || 1) + change;
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === itemId
        ? { ...item, cartQuantity: newQuantity }
        : item
    );
    setCart(newCart);
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.mealconnect.in/#org",
        "name": "MealConnect",
        "alternateName": "MealConnect NGO",
        "url": "https://www.mealconnect.in",
        "logo": "https://www.mealconnect.in/logo.png",
        "legalName": "MealConnect (Non-Profit)",
        "foundingDate": "2025-07-01",
        "sameAs": [
          "https://www.facebook.com/mealconnectindia",
          "https://www.instagram.com/mealconnectindia",
          "https://twitter.com/mealconnectin"
        ],
        "contactPoint": [{
          "@type": "ContactPoint",
          "telephone": "+91-98765-43210",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi"]
        }],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "12 NGO Lane, Food Park",
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "postalCode": "560001",
          "addressCountry": "IN"
        },
        "employee": {
          "@type": "Person",
          "name": "Asha Verma",
          "jobTitle": "Founder"
        }
      },
      {
        "@type": "Restaurant",
        "@id": "https://www.mealconnect.in/#restaurant",
        "name": "MealConnect Community Kitchen",
        "url": "https://www.mealconnect.in/community-kitchen",
        "description": "Donation-supported community kitchen partnering with local restaurants and volunteers to provide meals to those in need.",
        "servesCuisine": ["Indian", "South Indian", "North Indian", "Street Food", "Desserts"],
        "acceptsReservations": "False",
        "branchOf": { "@id": "https://www.mealconnect.in/#org" },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "12 NGO Lane, Food Park",
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "postalCode": "560001",
          "addressCountry": "IN"
        },
        "telephone": "+91-98765-43210",
        "openingHours": [
          "Mo-Fr 08:00-20:00",
          "Sa-Su 08:00-18:00"
        ]
      }
    ]
  };

  return (
    <div className="food-delivery-container">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon size={24} />
            </button>
            <Link to="/" className="logo-section">
              <span className="logo-text">MealConnect</span>
            </Link>
          </div>

          <div className="header-right">
            <Link to="/cart" className="icon-button" style={{ position: 'relative', marginRight: '1rem', color: '#a34a1a' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#fbcf08',
                  color: '#a34a1a',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {cart.reduce((sum, item) => sum + (item.cartQuantity || 1), 0)}
                </span>
              )}
            </Link>
            {!user ? (
              <Link to="/login" className="btn-donate-now">Login</Link>
            ) : (
              <Link to="/profile" className="btn-donate-now">Profile</Link>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar-menu ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="logo-text">MealConnect</span>
          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <a href="#home" onClick={() => setIsSidebarOpen(false)}>Home</a>
          <Link to="/about" onClick={() => setIsSidebarOpen(false)}>About Us</Link>
          <Link to="/menu" onClick={() => setIsSidebarOpen(false)}>Menu</Link>
          <Link to="/partners" onClick={() => setIsSidebarOpen(false)}>Partners</Link>
          <Link to="/volunteer" onClick={() => setIsSidebarOpen(false)}>Volunteer</Link>
          <Link to="/donate" onClick={() => setIsSidebarOpen(false)}>Donate</Link>
          <Link to="/contact" onClick={() => setIsSidebarOpen(false)}>Contact</Link>
          {!user && <Link to="/register" onClick={() => setIsSidebarOpen(false)}>Register</Link>}
        </nav>
      </div>

      {/* Hero */}
      <section className="hero-section" id="home">
        <div className="hero-grid">
          <div className="hero-content">
            <h1>
              Because every meal <br />
              should be <span className="highlight">for all</span>
            </h1>
            <p className="hero-subtext">
              Join a community dedicated to ending food waste and ensuring no neighbor goes hungry. Simple, joyful, and local.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-movement">Join the Movement</Link>
              <Link to="/about" className="btn-learn">Learn More</Link>
            </div>
          </div>

          <div className="hero-image-new">
            <div className="hero-image-wrapper">
              <img src="/images/hero_kitchen_illustration.png" alt="People cooking together" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu / Dishes */}
      <section className="dishes-section" id="menu">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="dishes-title">Available Dishes (Donation-based / Community Menu)</h2>
            <Link to="/menu" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              View All {foodItems.length > 0 ? 'Items' : ''}
              <span>→</span>
            </Link>
          </div>

          {foodItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.5 }}>🍛</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>No items available</h3>
              <p style={{ color: '#6b7280' }}>Check back later for delicious meals!</p>
            </div>
          ) : (
            <>
            <div className="products-grid">
              {foodItems.map((item) => {
                const cartQuantity = getCartQuantity(item.id);
                const itemInCart = cartQuantity > 0;
                const imageUrl = getImageUrl(item.image);

                return (
                  <div key={item.id} className="product-card">
                    <div className="product-image" style={{
                      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#fef3c7'
                    }}>
                      {!imageUrl && (item.restaurant?.image || '🍛')}
                      <span className="product-badge">{item.category}</span>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{item.name}</h3>
                      <div className="product-restaurant">
                        <MapPin size={14} />
                        {item.restaurantName}
                      </div>
                      <div className="product-details">
                        <div className="product-detail-item">
                          <Package size={16} />
                          <span>{item.quantity} available</span>
                        </div>
                        <div className="product-detail-item">
                          <Star size={16} style={{ fill: '#fb923c', color: '#fb923c' }} />
                          <span>{item.rating} rating</span>
                        </div>
                        <div className="product-detail-item">
                          <Clock size={16} />
                          <span>Best before: {item.expiryTime || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="product-price-section">
                        <div className="product-price">₹{item.price}</div>
                        {!itemInCart ? (
                          <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart size={18} />
                            Add to Cart
                          </button>
                        ) : (
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="quantity-display">{cartQuantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280', fontSize: '1rem' }}>
              Showing {foodItems.length} items. <Link to="/menu" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>View all menu items →</Link>
            </p>
            </>
          )}

          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to="/menu" className="btn-primary" style={{ textDecoration: 'none' }}>View Full Menu</Link>
            <Link to="/partners" className="btn-primary" style={{ textDecoration: 'none', marginLeft: '1rem' }}>Partner With Us</Link>
          </div>
        </div>
      </section>

      {/* Newsletter / Donate */}
      <section className="newsletter-section" id="donate">
        <div className="newsletter-container">
          <h2 className="newsletter-title">Support our mission</h2>
          <p className="newsletter-text">
            Donations help with packaging, transport and volunteer coordination. You can donate via UPI, bank transfer or help by volunteering your time.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <button className="btn-primary">Subscribe</button>
          </div>

          <div className="donation-ways">
            <p><strong>UPI:</strong> mealconnect@upi</p>
            <p><strong>Phone / WhatsApp:</strong> +91 98765 43210</p>
            <p><strong>Bank (for receipts):</strong> MealConnect Trust — ICICI / HDFC (details on request)</p>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="map-section" id="locations">
        <h2 className="map-title">Our Community Kitchen Locations</h2>
        <p className="map-text">Visit our partner kitchens and donation centers across Bengaluru.</p>

        <div className="map-container">
          <iframe
            title="MealConnect Locations"
            src="https://www.google.com/maps?q=hotels+in+Bengaluru&z=13&output=embed"
            width="100%"
            height="420"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="map-legend" style={{maxWidth: 1000, margin: '18px auto 0', padding: '0 16px'}}>
          <h4 style={{marginBottom:8}}>Sample partner locations</h4>
          <ul style={{display:'flex',gap:12,flexWrap:'wrap',listStyle:'none',padding:0,margin:0}}>
            <li>🌶️ <a href="https://www.google.com/maps/search/?api=1&query=Spice+Garden+Bengaluru" target="_blank" rel="noreferrer">Spice Garden</a></li>
            <li>🍛 <a href="https://www.google.com/maps/search/?api=1&query=Curry+House+Bengaluru" target="_blank" rel="noreferrer">Curry House</a></li>
            <li>🥞 <a href="https://www.google.com/maps/search/?api=1&query=Dosa+Palace+Bengaluru" target="_blank" rel="noreferrer">Dosa Palace</a></li>
            <li>🌮 <a href="https://www.google.com/maps/search/?api=1&query=Street+Bites+Bengaluru" target="_blank" rel="noreferrer">Street Bites</a></li>
          </ul>
        </div>
      
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <div className="logo-section">
                <div className="logo-icon">🍕</div>
                <span className="logo-text">MealConnect</span>
              </div>
              <p className="footer-brand">
                Non-profit serving communities across India. Donations and volunteers welcome.
              </p>
            </div>

            <div>
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/volunteer" className="footer-link">Volunteer</Link></li>
                <li><Link to="/donate" className="footer-link">Donate</Link></li>
                <li><Link to="/partners" className="footer-link">Partners</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="footer-title">Support</h3>
              <ul className="footer-links">
                <li><a href="#help" className="footer-link">Help Center</a></li>
                <li><a href="#safety" className="footer-link">Safety</a></li>
                <li><a href="#privacy" className="footer-link">Privacy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="footer-title">Contact</h3>
              <ul className="footer-links">
                <li>📧 <a href="mailto:info@mealconnect.in">info@mealconnect.in</a></li>
                <li>📱 +91 98765 43210 (WhatsApp)</li>
                <li>📍 12 NGO Lane, Food Park, Bengaluru, Karnataka — 560001</li>
                <li>🕘 Mon–Fri: 08:00–20:00</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} MealConnect. All rights reserved. Registered Non-Profit (India).</p>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
