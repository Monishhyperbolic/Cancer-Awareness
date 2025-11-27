// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [quoteError, setQuoteError] = useState(null);
  const [apiSource, setApiSource] = useState('primary');

  // Multiple reliable API endpoints
  const API_ENDPOINTS = {
    primary: 'https://api.quotable.io/quotes/random?limit=6', // Very reliable
    secondary: 'https://type.fit/api/quotes', // Good fallback
    tertiary: 'https://dummyjson.com/quotes?limit=6', // Another reliable option
    inspirational: 'https://jsonplaceholder.typicode.com/posts' // We'll transform this
  };

  // Cancer-specific inspirational messages as ultimate fallback
  const cancerSupportQuotes = [
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
    },
    {
      text: "You never know how strong you are until being strong is your only choice.",
      author: "Bob Marley",
      category: "Resilience"
    },
    {
      text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      author: "Ralph Waldo Emerson",
      category: "Inner Strength"
    }
  ];

  // Fetch quotes from API with multiple fallbacks
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async (source = 'primary') => {
    try {
      setLoadingQuotes(true);
      setQuoteError(null);
      
      let apiResponse;
      let formattedQuotes = [];

      switch(source) {
        case 'primary':
          // Quotable API - very reliable
          try {
            apiResponse = await axios.get(API_ENDPOINTS.primary, { timeout: 3000 });
            if (apiResponse.data && apiResponse.data.length > 0) {
              formattedQuotes = apiResponse.data.map(quote => ({
                text: quote.content,
                author: quote.author || 'Unknown',
                category: getQuoteCategory(quote.content)
              }));
              setQuotes(formattedQuotes);
              setApiSource('primary');
              return;
            }
          } catch (error) {
            console.log('Primary API failed, trying secondary...');
            await fetchQuotes('secondary');
            return;
          }
          break;

        case 'secondary':
          // Type.fit API - good fallback
          try {
            apiResponse = await axios.get(API_ENDPOINTS.secondary, { timeout: 3000 });
            if (apiResponse.data && apiResponse.data.length > 0) {
              formattedQuotes = apiResponse.data
                .filter(quote => quote.text && quote.text.length < 200)
                .slice(0, 6)
                .map(quote => ({
                  text: quote.text,
                  author: quote.author?.replace(', type.fit', '') || 'Unknown',
                  category: getQuoteCategory(quote.text)
                }));
              setQuotes(formattedQuotes);
              setApiSource('secondary');
              return;
            }
          } catch (error) {
            console.log('Secondary API failed, trying tertiary...');
            await fetchQuotes('tertiary');
            return;
          }
          break;

        case 'tertiary':
          // DummyJSON API - another good option
          try {
            apiResponse = await axios.get(API_ENDPOINTS.tertiary, { timeout: 3000 });
            if (apiResponse.data && apiResponse.data.quotes) {
              formattedQuotes = apiResponse.data.quotes.slice(0, 6).map(quote => ({
                text: quote.quote,
                author: quote.author,
                category: getQuoteCategory(quote.quote)
              }));
              setQuotes(formattedQuotes);
              setApiSource('tertiary');
              return;
            }
          } catch (error) {
            console.log('Tertiary API failed, using inspirational fallback...');
            await fetchQuotes('inspirational');
            return;
          }
          break;

        case 'inspirational':
          // Transform JSONPlaceholder data into inspirational quotes
          try {
            apiResponse = await axios.get(API_ENDPOINTS.inspirational, { timeout: 3000 });
            if (apiResponse.data && apiResponse.data.length > 0) {
              formattedQuotes = apiResponse.data.slice(0, 6).map((post, index) => ({
                text: post.title + '. ' + post.body.split(' ').slice(0, 15).join(' ') + '...',
                author: `User ${post.userId}`,
                category: getQuoteCategory(post.title)
              }));
              setQuotes(formattedQuotes);
              setApiSource('inspirational');
              return;
            }
          } catch (error) {
            console.log('All APIs failed, using cancer support quotes');
            throw new Error('All APIs failed');
          }
          break;

        default:
          break;
      }

    } catch (error) {
      console.log('All API attempts failed, using cancer support quotes');
      // Use cancer-specific inspirational quotes
      setQuoteError('Using cancer support inspiration messages');
      setQuotes(cancerSupportQuotes.slice(0, 6));
      setApiSource('cancer_support');
    } finally {
      setLoadingQuotes(false);
    }
  };

  // Helper function to categorize quotes
  const getQuoteCategory = (quoteText) => {
    if (!quoteText) return 'Inspiration';
    
    const text = quoteText.toLowerCase();
    const categories = {
      'Hope': ['hope', 'believe', 'faith', 'dream', 'future', 'tomorrow'],
      'Strength': ['strength', 'strong', 'power', 'endure', 'persevere', 'resilient'],
      'Courage': ['courage', 'brave', 'fear', 'overcome', 'face', 'challenge'],
      'Love': ['love', 'care', 'heart', 'compassion', 'kindness', 'support'],
      'Peace': ['peace', 'calm', 'serenity', 'mind', 'tranquil', 'quiet'],
      'Community': ['together', 'community', 'support', 'help', 'unity', 'family'],
      'Healing': ['heal', 'recover', 'wellness', 'health', 'restore', 'renew']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    return 'Inspiration';
  };

  // Auto-rotate quotes
  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 6000);
      return () => clearInterval(interval);
    }
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
    await fetchQuotes('primary');
  };

  const getApiSourceName = () => {
    const sources = {
      'primary': 'Quotable API',
      'secondary': 'Type.fit API', 
      'tertiary': 'DummyJSON API',
      'inspirational': 'Inspiration API',
      'cancer_support': 'Cancer Support Messages'
    };
    return sources[apiSource] || 'Live Quotes';
  };

  const getApiStatus = () => {
    return apiSource === 'cancer_support' ? 'offline' : 'online';
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
              <h3>Live Inspiration</h3>
              <p>
                Real-time inspirational quotes 
                <span className="api-status">
                  <span className={`status-dot ${getApiStatus()}`}></span>
                  {getApiSourceName()}
                </span>
              </p>
              {quoteError && (
                <div className="quote-warning">
                  <span className="warning-icon">💜</span>
                  {quoteError}
                </div>
              )}
            </div>
            
            <div className="quotes-container">
              {loadingQuotes ? (
                <div className="quote-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading inspirational quotes...</p>
                </div>
              ) : quotes.length > 0 ? (
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
                    <div className="quote-source">
                      <small>Source: {getApiSourceName()}</small>
                    </div>
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
              ) : (
                <div className="quote-error">
                  <p>No quotes available at the moment.</p>
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
                    Refresh Quotes
                  </>
                )}
              </button>
              <div className="quotes-counter">
                {quotes.length > 0 && `${currentQuoteIndex + 1} / ${quotes.length}`}
              </div>
            </div>
          </section>

          {/* Contact Form Section - Remains the same */}
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

        {/* Support Resources - Remains the same */}
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

        {/* Emergency Banner - Remains the same */}
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

      {/* Footer - Remains the same */}
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