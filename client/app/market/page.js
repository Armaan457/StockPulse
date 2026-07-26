'use client';

import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../AuthProvider';
import AILoader from '../components/AILoader';
import Markdown from '../components/Markdown';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Clock, 
  Video, 
  Brain, 
  Loader2, 
  Info,
  ChevronRight,
  Download
} from 'lucide-react';

export default function MarketPage() {
  // Top stocks states
  const [topStocks, setTopStocks] = useState([]);
  const [period, setPeriod] = useState('1mo');
  const [stocksLoading, setStocksLoading] = useState(true);
  
  // Search / Prediction states
  const [searchPredictTicker, setSearchPredictTicker] = useState('');
  const [searchVideoTicker, setSearchVideoTicker] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('');
  const [selectedVideoTicker, setSelectedVideoTicker] = useState('');
  const [predictLoading, setPredictLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  // Helper to parse the YouTubeSearchTool strings which could be in format: '/watch?v=...' or 'https://...' or "['Title', '/watch?v=...']"
  const parseVideoLink = (vidStr) => {
    let url = '';
    let title = '';

    // Check if it's in list/array format ['Title', '/watch?v=...']
    const arrayMatch = vidStr.match(/'([^']*)',\s*'([^']*)'/);
    if (arrayMatch) {
      title = arrayMatch[1];
      url = arrayMatch[2];
    } else {
      url = vidStr;
    }

    // Ensure it's absolute
    if (url.startsWith('/watch')) {
      url = `https://www.youtube.com${url}`;
    }

    if (!title) {
      // Create a readable title from ticker and URL
      title = `YouTube Analysis - ${selectedTicker || selectedVideoTicker}`;
    }

    // Extract YouTube video ID
    let videoId = null;
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
    } catch (e) {
      // Ignore
    }

    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

    return { title, url, videoId, thumbnail };
  };

  const fetchVideoMetadata = async (rawVideos) => {
    if (!rawVideos || rawVideos.length === 0) {
      setVideos([]);
      return;
    }
    
    // Immediately map to initial objects so UI shows default titles first
    const initialVideos = rawVideos.map(vid => parseVideoLink(vid));
    setVideos(initialVideos);
    
    try {
      const enrichedVideos = await Promise.all(
        initialVideos.map(async (vid) => {
          if (!vid.url) return vid;
          try {
            // Try youtube oembed first
            const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(vid.url)}&format=json`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.title) {
                return { ...vid, title: data.title };
              }
            }
          } catch (e) {
            // Fallback to noembed
            try {
              const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(vid.url)}`);
              if (res.ok) {
                const data = await res.json();
                if (data && data.title) {
                  return { ...vid, title: data.title };
                }
              }
            } catch (err2) {
              // Ignore
            }
          }
          return vid;
        })
      );
      setVideos(enrichedVideos);
    } catch (e) {
      console.error('Failed to enrich videos', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTopStocks();
    }
  }, [period, user]);

  if (!user) return null;

  const fetchTopStocks = async () => {
    try {
      setStocksLoading(true);
      const data = await api.getTopStocks([], period);
      setTopStocks(data.stocks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setStocksLoading(false);
    }
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!searchPredictTicker) return;

    const ticker = searchPredictTicker.trim().toUpperCase();
    setSelectedTicker(ticker);
    setError('');
    setPrediction(null);
    
    // Trigger prediction
    setPredictLoading(true);
    try {
      const pred = await api.predictStock(ticker);
      setPrediction(pred);
    } catch (err) {
      console.error(err);
      setError('AI Prediction failed. Please verify the ticker exists.');
    } finally {
      setPredictLoading(false);
    }
  };

  const handleVideoSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchVideoTicker) return;

    const ticker = searchVideoTicker.trim().toUpperCase();
    setSelectedVideoTicker(ticker);
    setVideos([]);
    
    // Trigger video search
    setVideosLoading(true);
    try {
      const vidData = await api.getVideos(ticker);
      await fetchVideoMetadata(vidData.videos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSelectTopStock = (ticker) => {
    setSearchPredictTicker(ticker);
    setSearchVideoTicker(ticker);
    setSelectedTicker(ticker);
    setSelectedVideoTicker(ticker);
    setError('');
    setPrediction(null);
    setVideos([]);
    
    // Trigger prediction
    setPredictLoading(true);
    api.predictStock(ticker)
      .then(pred => setPrediction(pred))
      .catch(() => setError('AI Prediction failed.'))
      .finally(() => setPredictLoading(false));

    // Trigger video search
    setVideosLoading(true);
    api.getVideos(ticker)
      .then(vidData => fetchVideoMetadata(vidData.videos || []))
      .catch(() => {})
      .finally(() => setVideosLoading(false));
  };

  const handleDownloadPDF = () => {
    if (!prediction) return;
    
    const printWindow = window.open('', '_blank');
    
    const formatMarkdownToHtml = (markdown) => {
      let html = markdown;
      html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
      html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
      html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/`(.*?)`/g, '<code style="background:#f4f4f4;padding:2px 4px;border-radius:4px;font-family:monospace;">$1</code>');
      html = html.replace(/^[-*] (.*?)$/gm, '<li>$1</li>');
      
      return html.split('\n').map(p => {
        const trimmed = p.trim();
        if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<ul')) {
          return p;
        }
        if (trimmed === '') return '';
        return `<p>${p}</p>`;
      }).join('\n');
    };

    const reportContent = `
# AI Forecast Analysis: ${selectedTicker}
**Forecast Result**: ${prediction.prediction}

## Technical Quantitative Analysis
${prediction.explanation_technical}

## Sentiment & News Context
${prediction.explanation_sentiment}
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>StockPulse AI Forecast Report - ${selectedTicker}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              color: #1a1a1a;
              line-height: 1.6;
              padding: 40px;
              background: #ffffff;
            }
            .report-header {
              border-bottom: 2px solid #00e676;
              padding-bottom: 12px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .report-logo {
              font-size: 1.4rem;
              font-weight: 800;
              color: #000000;
            }
            .report-date {
              font-size: 0.85rem;
              color: #666;
            }
            h1 { font-size: 1.6rem; margin-top: 0; color: #000; }
            h2 { font-size: 1.3rem; margin-top: 20px; color: #111; border-bottom: 1px solid #eee; padding-bottom: 4px; }
            h3 { font-size: 1.1rem; margin-top: 16px; color: #222; }
            p { margin-bottom: 10px; font-size: 0.9rem; color: #333; }
            li { margin-bottom: 4px; font-size: 0.9rem; color: #333; }
            strong { color: #00e676; font-weight: 600; }
            .footer {
              margin-top: 40px;
              border-top: 1px solid #eee;
              padding-top: 10px;
              font-size: 0.75rem;
              color: #888;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div class="report-logo">STOCK<span style="color:#00e676;">PULSE</span> AI</div>
            <div class="report-date">Generated: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="report-body">
            ${formatMarkdownToHtml(reportContent)}
          </div>
          
          <div class="footer">
            StockPulse AI Forecast Engine &bull; Confidential Report
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };



  return (
    <div className="market-wrapper animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Market Intelligence</h1>
          <p>Get real-time market trends, check AI predictions, and view learning videos</p>
        </div>
      </header>

      <div className="market-grid">
        {/* Left Column: Top Stocks List */}
        <div className="top-stocks-panel glass-panel">
          <div className="panel-header">
            <h3>Top Gainers & Leaders</h3>
            <div className="period-selector">
              <Clock size={16} className="clock-icon" />
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="period-dropdown"
              >
                <option value="1d">1 Day</option>
                <option value="5d">5 Days</option>
                <option value="1mo">1 Month</option>
                <option value="3mo">3 Months</option>
                <option value="1y">1 Year</option>
              </select>
            </div>
          </div>

          {stocksLoading ? (
            <div style={{ padding: '20px 0', width: '100%' }}>
              <AILoader 
                title="Fetching Market Leaders" 
                tasks={[
                  "Connecting to market feed stream...",
                  "Retrieving top active financial assets...",
                  "Calculating latest daily percentage differentials...",
                  "Sorting gainers by volume indicators..."
                ]} 
              />
            </div>
          ) : topStocks.length === 0 ? (
            <p className="no-data">No stock data available.</p>
          ) : (
            <div className="stocks-list">
              <div className="list-header">
                <span>Symbol</span>
                <span className="text-right">Price ($)</span>
                <span className="text-right">Change</span>
              </div>
              
              {topStocks.map((stock) => (
                <div 
                  key={stock.ticker} 
                  onClick={() => handleSelectTopStock(stock.ticker)}
                  className="stock-row"
                  title="Run AI Prediction on this stock"
                >
                  <div className="stock-meta">
                    <span className="stock-symbol">{stock.ticker}</span>
                    <span className="stock-volume">Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="stock-price text-right">
                    ${stock.end_price.toFixed(2)}
                  </div>
                  <div className="stock-change text-right">
                    <span className={stock.pct_change >= 0 ? 'badge-up' : 'badge-down'}>
                      {stock.pct_change >= 0 ? '+' : ''}{stock.pct_change.toFixed(2)}%
                    </span>
                  </div>
                  <ChevronRight size={16} className="row-arrow" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis & YouTube search */}
        <div className="analysis-panel">
          {/* Decoupled Panel 1: AI Forecast Engine */}
          <div className="search-panel glass-panel">
            <h3>AI Forecast Engine</h3>
            <p className="panel-desc">Run CrewAI prediction agents to forecast stock performance</p>
            
            <form onSubmit={handlePredict} className="search-form">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Enter ticker (e.g. TSLA, NVDA)"
                  value={searchPredictTicker}
                  onChange={(e) => setSearchPredictTicker(e.target.value)}
                  className="form-input search-input"
                  required
                />
              </div>
              <button type="submit" disabled={predictLoading} className="btn-primary search-btn">
                {predictLoading ? (
                  <Loader2 size={16} className="spinner" />
                ) : (
                  <span>Forecast</span>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="error-alert glass-panel">
              <Info size={20} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {predictLoading && (
            <AILoader 
              title={`Analyzing ${selectedTicker} Stock`} 
              tasks={[
                `Bootstrapping forecast crew for ${selectedTicker}...`,
                "Running multi-indicator audits...",
                "Scanning financial news and trading sentiments...",
                "Retrieving educational tutorials and guides...",
                "Synthesizing final stock forecast report..."
              ]}
            />
          )}

          {!predictLoading && prediction && (
            <div className="prediction-result glass-panel animate-fade-in">
              <div className="result-header">
                <div className="header-title-block">
                  <h3>Prediction for {selectedTicker}</h3>
                  <span className={
                    prediction.prediction === 'RISE' ? 'badge-up' :
                    prediction.prediction === 'FALL' ? 'badge-down' : 'badge-stable'
                  }>
                    AI FORECAST: {prediction.prediction}
                  </span>
                </div>
                <button onClick={handleDownloadPDF} className="btn-icon-text">
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="explanation-section">
                <div className="explanation-block">
                  <div className="block-title">
                    <Brain size={16} className="title-icon" />
                    <span>Technical Quantitative Analysis</span>
                  </div>
                  <Markdown text={prediction.explanation_technical} />
                </div>

                <div className="explanation-block">
                  <div className="block-title">
                    <TrendingUp size={16} className="title-icon" />
                    <span>Sentiment & News Context</span>
                  </div>
                  <Markdown text={prediction.explanation_sentiment} />
                </div>
              </div>
            </div>
          )}

          {/* Decoupled Panel 2: Financial Video Finder */}
          <div className="search-panel glass-panel" style={{ marginTop: '24px' }}>
            <h3>Financial Video Finder</h3>
            <p className="panel-desc">Search top educational videos and tutorials matching a stock</p>
            
            <form onSubmit={handleVideoSearch} className="search-form">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Enter ticker (e.g. AAPL, AMZN)"
                  value={searchVideoTicker}
                  onChange={(e) => setSearchVideoTicker(e.target.value)}
                  className="form-input search-input"
                  required
                />
              </div>
              <button type="submit" disabled={videosLoading} className="btn-primary search-btn">
                {videosLoading ? (
                  <Loader2 size={16} className="spinner" />
                ) : (
                  <span>Search Videos</span>
                )}
              </button>
            </form>
          </div>

          {/* Video results */}
          {(videosLoading || videos.length > 0 || selectedVideoTicker) && (
            <div className="videos-result glass-panel animate-fade-in" style={{ marginTop: '16px' }}>
              <h3>Recommended Educational Videos</h3>
              <p className="panel-desc">Top educational videos matching {selectedVideoTicker} stock</p>

              {videosLoading ? (
                <div style={{ padding: '20px 0', width: '100%' }}>
                  <AILoader 
                    title={`Searching YouTube for ${selectedVideoTicker} Tutorials`} 
                    tasks={[
                      "Connecting to YouTube search indexes...",
                      `Querying educational tutorials for ${selectedVideoTicker}...`,
                      "Filtering relevant stock analysis guides...",
                      "Retrieving video thumbnails and titles...",
                      "Sorting results by view relevance..."
                    ]} 
                  />
                </div>
              ) : videos.length === 0 ? (
                <p className="no-videos">No video recommendations found.</p>
              ) : (
                <div className="videos-grid">
                  {videos.map((vid, idx) => {
                    return (
                      <a 
                        key={idx} 
                        href={vid.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="video-card glass-panel"
                      >
                        <div className="video-thumbnail-wrapper">
                          {vid.thumbnail ? (
                            <img 
                              src={vid.thumbnail} 
                              alt={vid.title} 
                              className="video-thumbnail" 
                            />
                          ) : (
                            <div className="video-thumbnail-fallback">
                              <Video size={36} />
                            </div>
                          )}
                          <div className="play-overlay">
                            <span className="play-button">&#9658;</span>
                          </div>
                        </div>
                        <div className="video-card-info">
                          <h4 className="video-card-title">{vid.title}</h4>
                          <span className="video-card-domain">youtube.com</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .market-wrapper {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
        }

        .page-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .market-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .market-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Top Stocks Panel */
        .top-stocks-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .period-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 12px;
        }

        .clock-icon {
          color: var(--text-muted);
        }

        .period-dropdown {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .panel-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px 0;
          color: var(--text-secondary);
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: var(--primary);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-data {
          color: var(--text-muted);
          text-align: center;
          padding: 20px 0;
        }

        .stocks-list {
          display: flex;
          flex-direction: column;
        }

        .list-header {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 24px;
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border);
          margin-bottom: 8px;
        }

        .stock-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 24px;
          align-items: center;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .stock-row:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--border);
        }

        .stock-row:hover .row-arrow {
          transform: translateX(2px);
          color: #fff;
        }

        .stock-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stock-symbol {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
        }

        .stock-volume {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .stock-price {
          font-weight: 600;
          color: #f1f5f9;
        }

        .row-arrow {
          color: var(--text-muted);
          justify-self: end;
          transition: all 0.2s ease;
        }

        .text-right {
          text-align: right;
        }

        /* Analysis Panel */
        .analysis-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .search-panel h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .panel-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .search-form {
          display: flex;
          gap: 12px;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 44px;
        }

        .search-btn {
          height: 46px;
          padding: 0 24px;
        }

        .error-alert {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.2);
          color: var(--danger);
          padding: 16px 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
        }

        .results-loader {
          text-align: center;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .results-loader h4 {
          font-size: 1.1rem;
          color: #fff;
          margin-top: 8px;
        }

        .results-loader p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Prediction Result */
        .prediction-result {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 14px;
        }

        .header-title-block {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-icon-text {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 230, 118, 0.1);
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-icon-text:hover {
          background: var(--primary);
          color: #000000;
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .result-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .explanation-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .explanation-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .block-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .title-icon {
          color: var(--primary);
        }

        .explanation-block p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #d1d5db;
        }

        /* Videos Section */
        .videos-result h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .videos-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 20px 0;
          color: var(--text-secondary);
        }

        .no-videos {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .videos-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 14px;
        }

        .video-card {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(9, 13, 11, 0.4);
          transition: all 0.25s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .video-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 4px 20px var(--primary-glow);
        }

        .video-thumbnail-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background: #000;
          overflow: hidden;
        }

        .video-thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .video-card:hover .video-thumbnail {
          transform: scale(1.05);
        }

        .video-thumbnail-fallback {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.02);
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .video-card:hover .play-overlay {
          opacity: 1;
        }

        .play-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #00e676;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          padding-left: 2px; /* Center triangle visually */
          box-shadow: 0 0 15px rgba(0, 230, 118, 0.6);
        }

        .video-card-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .video-card-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f3f4f6;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 2.8em;
        }

        .video-card-domain {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
