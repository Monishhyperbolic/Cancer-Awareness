// App.js - Optimized for deployment
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Pre-defined cancer support quotes as primary content
const CANCER_SUPPORT_QUOTES = [
  {
    text: "You are stronger than you know. More resilient than you imagine.",
    author: "Cancer Support Community",
    category: "Strength"
  },
  {
    text: "Hope is being able to see that there is light despite all of the darkness.",
    author: "Desmond Tutu",
    category: "Hope"
  },
  {
    text: "Together we can face any challenge. Together we are stronger.",
    author: "Support Network",
    category: "Community"
  },
  {
    text: "Your illness does not define you. Your strength and courage does.",
    author: "Anonymous",
    category: "Courage"
  },
  {
    text: "Every day is a new beginning. Take a deep breath and start again.",
    author: "Hope Foundation",
    category: "Renewal"
  },
  {
    text: "The human spirit is stronger than anything that can happen to it.",
    author: "C.C. Scott",
    category: "Spirit"
  }
];

function App() {
  const [quotes, setQuotes] = useState(CANCER_SUPPORT_QUOTES);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setTimeout(() => {
      setIsFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const refreshQuotes = async () => {
    setLoadingQuotes(true);
    // Simulate API call delay
    setTimeout(() => {
      setQuotes([...CANCER_SUPPORT_QUOTES].sort(() => Math.random() - 0.5));
      setCurrentQuoteIndex(0);
      setLoadingQuotes(false);
    }, 1000);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">💜</div>
            <div className="logo-text">
              <h1>HopeTogether</h1>
              <p>Cancer Awareness & Support</p>
            </div>
          </div>
          <nav className="navigation">
            <a href="#support" className="nav-link">Support</a>
            <a href="#resources" className="nav-link">Resources</a>
            <a href="#stories" className="nav-link">Stories</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>You Are Not Alone in This Journey</h1>
            <p className="hero-subtitle">
              Join our compassionate community for support, resources, and hope. 
              Together, we can face any challenge.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">1M+</div>
                <div className="stat-label">People Supported</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
              <div className="stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">Communities</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-card hope">Hope</div>
              <div className="floating-card strength">Strength</div>
              <div className="floating-card community">Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="main-content">
        
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="container">
            <h2>Welcome to Our Support Family</h2>
            <p>
              Whether you're newly diagnosed, a survivor, caregiver, or someone who wants to help, 
              you'll find a warm, supportive community here. We're dedicated to providing resources, 
              emotional support, and practical advice for everyone affected by cancer.
            </p>
          </div>
        </section>

        {/* Featured Sections Grid */}
        <div className="features-grid">
          
          {/* Quotes Section */}
          <section className="quotes-section">
            <div className="section-header">
              <div className="section-icon">💫</div>
              <h3>Daily Inspiration</h3>
              <p>Words of hope and strength for your journey</p>
            </div>
            
            <div className="quotes-container">
              {loadingQuotes ? (
                <div className="quote-loading">
                  <div className="loading-spinner"></div>
                  <p>Refreshing inspiration...</p>
                </div>
              ) : (
                <div className="quote-showcase">
                  <div className="quote-main">
                    <div className="quote-category">
                      {quotes[currentQuoteIndex].category}
                    </div>
                    <p className="quote-text">
                      "{quotes[currentQuoteIndex].text}"
                    </p>
                    <p className="quote-author">
                      — {quotes[currentQuoteIndex].author}
                    </p>
                  </div>
                  <div className="quote-indicators">
                    {quotes.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentQuoteIndex ? 'active' : ''}`}
                        onClick={() => setCurrentQuoteIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="quotes-actions">
              <button 
                className="refresh-btn"
                onClick={refreshQuotes}
                disabled={loadingQuotes}
              >
                {loadingQuotes ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔄</span>
                    New Inspiration
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="contact-section">
            <div className="section-header">
              <div className="section-icon">📞</div>
              <h3>Get In Touch</h3>
              <p>We're here to listen and support you</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">How Can We Help?</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can support you..."
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isFormSubmitted ? 'success' : ''}`}
              >
                {isFormSubmitted ? (
                  <>
                    <span className="success-icon">✓</span>
                    Message Sent!
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>

            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <div className="contact-type">Email</div>
                  <div className="contact-detail">support@hopetogether.org</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-type">Phone</div>
                  <div className="contact-detail">1-800-HOPE-NOW</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Support Resources */}
        <section className="resources-section">
          <div className="container">
            <h2>How We Can Support You</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <div className="resource-icon">👥</div>
                <h4>Support Groups</h4>
                <p>Connect with others who understand your journey in safe, moderated communities.</p>
              </div>
              <div className="resource-card">
                <div className="resource-icon">💬</div>
                <h4>One-on-One Chat</h4>
                <p>Private conversations with trained supporters who specialize in cancer care.</p>
              </div>
              <div className="resource-card">
                <div className="resource-icon">📚</div>
                <h4>Resources</h4>
                <p>Access reliable information about treatments and wellness strategies.</p>
              </div>
              <div className="resource-card">
                <div className="resource-icon">🎯</div>
                <h4>Wellness Plans</h4>
                <p>Personalized strategies for physical and emotional well-being.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Banner */}
        <div className="emergency-banner">
          <div className="emergency-content">
            <div className="emergency-icon">🚨</div>
            <div>
              <div className="emergency-title">Need Immediate Support?</div>
              <div className="emergency-number">Call 1-800-HELP-NOW • 24/7 Crisis Line</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-logo">
              <div className="logo-icon">💜</div>
              <div>
                <h3>HopeTogether</h3>
                <p>You are stronger than you know</p>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Support</h4>
                <a href="#groups">Support Groups</a>
                <a href="#counseling">Counseling</a>
                <a href="#emergency">Emergency Help</a>
              </div>
              <div className="link-group">
                <h4>Resources</h4>
                <a href="#education">Education</a>
                <a href="#tools">Tools</a>
                <a href="#research">Research</a>
              </div>
              <div className="link-group">
                <h4>Community</h4>
                <a href="#stories">Stories</a>
                <a href="#events">Events</a>
                <a href="#volunteer">Volunteer</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 HopeTogether Cancer Support. All rights reserved.</p>
            <div className="footer-social">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;