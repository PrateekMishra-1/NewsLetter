import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [company, setCompany] = useState('');
  const [prediction, setPrediction] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockPrices, setStockPrices] = useState({});
  const [showModal, setShowModal] = useState(false);

  const topStocks = [
    { name: 'Reliance Industries', symbol: 'RELIANCE' },
    { name: 'Tata Consultancy Services', symbol: 'TCS' },
    { name: 'HDFC Bank', symbol: 'HDFCBANK' },
    { name: 'Infosys', symbol: 'INFY' },
    { name: 'ICICI Bank', symbol: 'ICICIBANK' },
  ];

  const worstStocks = [
    { name: 'Yes Bank', symbol: 'YESBANK' },
    { name: 'Vodafone Idea', symbol: 'IDEA' },
    { name: 'PNB Housing Finance', symbol: 'PNBHOUSING' },
    { name: 'Indiabulls Housing Finance', symbol: 'IBULHSGFIN' },
    { name: 'Suzlon Energy', symbol: 'SUZLON' },
  ];

  // Mock function to fetch stock prices (replace with real API call)
  const fetchStockPrices = async () => {
    const mockPrices = {
      RELIANCE: 2500,
      TCS: 3500,
      HDFCBANK: 1500,
      INFY: 1800,
      ICICIBANK: 800,
      YESBANK: 12,
      IDEA: 8,
      PNBHOUSING: 300,
      IBULHSGFIN: 200,
      SUZLON: 5,
    };
    setStockPrices(mockPrices);
  };

  useEffect(() => {
    fetchStockPrices();
  }, []);

  const handlePredict = async () => {
    if (!company) {
      alert('Please enter a company name.');
      return;
    }

    setLoading(true);

    // Simulate API call (replace with actual backend integration)
    setTimeout(() => {
      const mockPrediction = Math.random() > 0.5 ? 'Stock will likely go up 📈' : 'Stock will likely go down 📉';
      const mockNews = [
        { title: `${company} announces record profits`, sentiment: 'Positive' },
        { title: `${company} faces regulatory scrutiny`, sentiment: 'Negative' },
        { title: `${company} launches new product`, sentiment: 'Positive' },
        { title: `${company} CEO steps down`, sentiment: 'Negative' },
        { title: `${company} partners with tech giant`, sentiment: 'Positive' },
      ];
      setPrediction(mockPrediction);
      setNews(mockNews);
      setLoading(false);
      setShowModal(true); // Show the modal
    }, 2000);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <h1 className="main-heading">Stock Prediction App</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter company name (e.g., Apple)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button onClick={handlePredict} disabled={loading}>
          {loading ? 'Analyzing...' : 'Predict Stock'}
        </button>
      </div>

      {prediction && (
        <div className="prediction-result">
          <h2>Prediction: {prediction}</h2>
        </div>
      )}

      <div className="stocks-container">
        <div className="top-stocks">
          <h3>Top 5 Stocks in India</h3>
          <div className="stocks-list">
            {topStocks.map((stock, index) => (
              <div key={index} className="stock-item positive" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="stock-info">
                  <span className="stock-name">{stock.name}</span>
                  <span className="stock-symbol">{stock.symbol}</span>
                </div>
                <span className="stock-price">₹{stockPrices[stock.symbol]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="worst-stocks">
          <h3>Worst 5 Stocks in India</h3>
          <div className="stocks-list">
            {worstStocks.map((stock, index) => (
              <div key={index} className="stock-item negative" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="stock-info">
                  <span className="stock-name">{stock.name}</span>
                  <span className="stock-symbol">{stock.symbol}</span>
                </div>
                <span className="stock-price">₹{stockPrices[stock.symbol]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Top 5 Articles */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <h3>Top 5 Articles for {company}</h3>
            <div className="news-list">
              {news.map((article, index) => (
                <div key={index} className="news-item">
                  <p>{article.title}</p>
                  <span className={`sentiment ${article.sentiment.toLowerCase()}`}>
                    {article.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;