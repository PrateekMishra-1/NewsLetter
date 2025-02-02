import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './App.css';

function App() {
  const NEWS_API_KEY = "98ffc7490eba4bf6968ef2e6bce7ba42"; // Replace with your NewsAPI key

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

  // Function to fetch stock prices (Mock)
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

    try {
      // Mock prediction logic
      const mockPrediction =
        Math.random() > 0.5 ? 'Stock will likely go up 📈' : 'Stock will likely go down 📉';

      setPrediction(`${mockPrediction}`);

      // Fetch news data from NewsAPI
      const newsResponse = await axios.get(
        `https://newsapi.org/v2/everything?q=${company}&sortBy=popularity&apiKey=${NEWS_API_KEY}`
      );

      if (newsResponse.data.articles && newsResponse.data.articles.length > 0) {
        const newsArticles = newsResponse.data.articles.slice(0, 5).map(article => ({
          title: article.title, // Only include the title
        }));
        setNews(newsArticles);
      } else {
        setNews([{ title: 'No news articles found.' }]);
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching news data:", error);
      setPrediction("Error fetching news data. Try again later.");
      setNews([{ title: 'Failed to fetch news articles.' }]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <h1 className="main-heading">Stock News App</h1>
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
                  <p>{article.title}</p> {/* Only display the title */}
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