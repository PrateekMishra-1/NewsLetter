import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./App.css";

function App() {
  const NEWS_API_KEY = "98ffc7490eba4bf6968ef2e6bce7ba42"; // Replace with your NewsAPI key
  const ALPHA_VANTAGE_API_KEY = "YOUR_ALPHA_VANTAGE_API_KEY"; // Replace with your Alpha Vantage API key

  const [company, setCompany] = useState("");
  const [prediction, setPrediction] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockPrices, setStockPrices] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [stockData, setStockData] = useState([]); // For storing historical stock data
  const [currentStock, setCurrentStock] = useState(null); // For storing current stock details

  const topStocks = [
    { name: "Reliance Industries", symbol: "RELIANCE.BSE" },
    { name: "Tata Consultancy Services", symbol: "TCS.BSE" },
    { name: "HDFC Bank", symbol: "HDFCBANK.BSE" },
    { name: "Infosys", symbol: "INFY.BSE" },
    { name: "ICICI Bank", symbol: "ICICIBANK.BSE" },
  ];

  const worstStocks = [
    { name: "Yes Bank", symbol: "YESBANK.BSE" },
    { name: "Vodafone Idea", symbol: "IDEA.BSE" },
    { name: "PNB Housing Finance", symbol: "PNBHOUSING.BSE" },
    { name: "Indiabulls Housing Finance", symbol: "IBULHSGFIN.BSE" },
    { name: "Suzlon Energy", symbol: "SUZLON.BSE" },
  ];

  // Fetch real-time stock data from Alpha Vantage
  const fetchStockData = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = response.data["Time Series (Daily)"];
      if (data) {
        const formattedData = Object.keys(data).map((date) => ({
          date,
          open: parseFloat(data[date]["1. open"]),
          high: parseFloat(data[date]["2. high"]),
          low: parseFloat(data[date]["3. low"]),
          close: parseFloat(data[date]["4. close"]),
        }));
        setStockData(formattedData.reverse()); // Reverse to show latest data first
      } else {
        console.error("No stock data found for symbol:", symbol);
        setStockData([]);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setStockData([]);
    }
  };

  // Fetch stock prices (Mock)
  const fetchStockPrices = async () => {
    const mockPrices = {
      "RELIANCE.BSE": 2500,
      "TCS.BSE": 3500,
      "HDFCBANK.BSE": 1500,
      "INFY.BSE": 1800,
      "ICICIBANK.BSE": 800,
      "YESBANK.BSE": 12,
      "IDEA.BSE": 8,
      "PNBHOUSING.BSE": 300,
      "IBULHSGFIN.BSE": 200,
      "SUZLON.BSE": 5,
    };
    setStockPrices(mockPrices);
  };

  useEffect(() => {
    fetchStockPrices();
  }, []);

  const handlePredict = async (companyName = company) => {
    if (!companyName) {
      alert("Please enter a company name.");
      return;
    }

    setLoading(true);

    try {
      // Mock prediction logic
      const mockPrediction =
        Math.random() > 0.5
          ? "Stock will likely go up 📈"
          : "Stock will likely go down 📉";

      setPrediction(`${mockPrediction}`);

      // Fetch news data from NewsAPI
      const newsResponse = await axios.get(
        `https://newsapi.org/v2/everything?q=${companyName}&sortBy=popularity&apiKey=${NEWS_API_KEY}`
      );

      if (newsResponse.data.articles && newsResponse.data.articles.length > 0) {
        const newsArticles = newsResponse.data.articles
          .slice(0, 5)
          .map((article) => ({
            title: article.title, // Only include the title
          }));
        setNews(newsArticles);
      } else {
        setNews([{ title: "No news articles found." }]);
      }

      // Fetch stock data for the searched company
      const stockSymbol = getStockSymbol(companyName);
      if (stockSymbol) {
        await fetchStockData(stockSymbol);
        setCurrentStock({ name: companyName, symbol: stockSymbol });
      } else {
        console.error("No stock symbol found for company:", companyName);
        setStockData([]);
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching news data:", error);
      setPrediction("Error fetching news data. Try again later.");
      setNews([{ title: "Failed to fetch news articles." }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get stock symbol from company name
  const getStockSymbol = (companyName) => {
    const allStocks = [...topStocks, ...worstStocks];
    const stock = allStocks.find(
      (stock) => stock.name.toLowerCase() === companyName.toLowerCase()
    );
    return stock ? stock.symbol : null;
  };

  const closeModal = () => {
    setShowModal(false);
    setCompany(""); // Clear the search bar
    setPrediction(""); // Clear the prediction
    setNews([]); // Clear the news
  };

  const handleStockClick = async (companyName, symbol) => {
    setCompany(companyName);
    setCurrentStock({ name: companyName, symbol });
    await fetchStockData(symbol);
    handlePredict(companyName);
  };

  return (
    <div className="container">
      <h1 className="main-heading">Stock News App</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter company name (e.g., Reliance Industries)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button onClick={() => handlePredict()} disabled={loading}>
          {loading ? "Analyzing..." : "Predict Stock"}
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
              <div
                key={index}
                className="stock-item positive"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => handleStockClick(stock.name, stock.symbol)}
              >
                <div className="stock-info">
                  <span className="stock-name">{stock.name}</span>
                  <span className="stock-symbol">{stock.symbol}</span>
                </div>
                <span className="stock-price">
                  ₹{stockPrices[stock.symbol]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="worst-stocks">
          <h3>Worst 5 Stocks in India</h3>
          <div className="stocks-list">
            {worstStocks.map((stock, index) => (
              <div
                key={index}
                className="stock-item negative"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => handleStockClick(stock.name, stock.symbol)}
              >
                <div className="stock-info">
                  <span className="stock-name">{stock.name}</span>
                  <span className="stock-symbol">{stock.symbol}</span>
                </div>
                <span className="stock-price">
                  ₹{stockPrices[stock.symbol]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Data and Graph Section */}
      {currentStock && stockData.length > 0 && (
        <div className="stock-graph">
          <h3>{currentStock.name} Stock Price Trend</h3>
          <LineChart
            width={800}
            height={400}
            data={stockData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={"rgba(255, 255, 255, 0.1)"}
            />
            <XAxis dataKey="date" stroke={"rgba(255, 255, 255, 0.7)"} />
            <YAxis stroke={"rgba(255, 255, 255, 0.7)"} />
            <Tooltip
              contentStyle={{
                background: "rgba(0, 0, 0, 0.9)",
                border: "none",
                borderRadius: 8,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              className="recharts-line-positive" // Apply custom class for positive trend
            />
          </LineChart>
        </div>
      )}

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