'use client';

import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../AuthProvider';
import AILoader from '../components/AILoader';
import Markdown from '../components/Markdown';
import { 
  BrainCircuit, 
  Plus, 
  Trash2, 
  Loader2, 
  Sparkles, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Download
} from 'lucide-react';

export default function AnalyzerPage() {
  const [stocks, setStocks] = useState([{ ticker: '', allocation: '' }]);
  const [profile, setProfile] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [validationMsg, setValidationMsg] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPortfolioPreset();
    }
  }, [user]);

  if (!user) return null;

  const loadPortfolioPreset = async () => {
    try {
      setFetchLoading(true);
      const holdings = await api.getPortfolios();
      if (holdings && holdings.length > 0) {
        const total = holdings.reduce((sum, h) => sum + h.investment_amount, 0);
        if (total > 0) {
          const preset = holdings.map(h => ({
            ticker: h.ticker_name,
            allocation: Math.round((h.investment_amount / total) * 100).toString()
          }));
          
          // Ensure they sum to exactly 100 due to rounding
          const sum = preset.reduce((s, h) => s + parseInt(h.allocation, 10), 0);
          if (sum !== 100 && preset.length > 0) {
            preset[0].allocation = (parseInt(preset[0].allocation, 10) + (100 - sum)).toString();
          }
          setStocks(preset);
        }
      }
    } catch (e) {
      console.error('Failed to load portfolio presets', e);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddRow = () => {
    setStocks([...stocks, { ticker: '', allocation: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updated = stocks.filter((_, idx) => idx !== index);
    setStocks(updated.length > 0 ? updated : [{ ticker: '', allocation: '' }]);
  };

  const handleChangeRow = (index, field, value) => {
    const updated = [...stocks];
    if (field === 'ticker') {
      updated[index][field] = value.toUpperCase();
    } else {
      updated[index][field] = value;
    }
    setStocks(updated);
  };

  const calculateTotalAllocation = () => {
    return stocks.reduce((sum, s) => {
      const val = parseFloat(s.allocation);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setReport('');

    const total = calculateTotalAllocation();
    if (total !== 100 && total !== 1) {
      setError(`Allocations must sum up to exactly 100% or 1.0 (Current: ${total}%).`);
      return;
    }

    // Filter and validate inputs
    const formattedStocks = [];
    for (const item of stocks) {
      if (!item.ticker) {
        setError('All tickers must be filled.');
        return;
      }
      const alloc = parseFloat(item.allocation);
      if (isNaN(alloc) || alloc <= 0) {
        setError('Allocations must be greater than 0.');
        return;
      }
      formattedStocks.push({
        ticker: item.ticker.trim().toUpperCase(),
        allocation: alloc
      });
    }

    setLoading(true);
    try {
      const response = await api.analyzePortfolio(formattedStocks, profile);
      setReport(response.summary);
    } catch (err) {
      console.error(err);
      setError(err.message || 'AI Portfolio Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'portfolio_analysis_report.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAlloc = calculateTotalAllocation();
  const isAllocationValid = totalAlloc === 100 || totalAlloc === 1;

  return (
    <div className="analyzer-wrapper animate-fade-in">
      <header className="page-header">
        <div>
          <h1>AI Portfolio Analyzer</h1>
          <p>Summon a Multi AI agent squad to evaluate risk exposure and backtest investment weights</p>
        </div>
      </header>

      {error && (
        <div className="error-alert">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="analyzer-grid">
        {/* Left Column: Form Settings */}
        <div className="settings-panel glass-panel">
          <div className="panel-header">
            <h3>Portfolio Configurator</h3>
            {fetchLoading ? (
              <span className="preset-loading">Loading holdings...</span>
            ) : (
              <span className="preset-loaded">Loaded preset holdings</span>
            )}
          </div>
          <p className="panel-desc">Set stock allocations and target trader risk profile</p>

          <form onSubmit={handleSubmit} className="analyzer-form">
            <div className="stocks-allocation-list">
              <div className="list-label-grid">
                <span>Stock Ticker</span>
                <span>Allocation (%)</span>
                <span />
              </div>

              {stocks.map((item, index) => (
                <div key={index} className="allocation-row">
                  <input
                    type="text"
                    placeholder="AAPL"
                    value={item.ticker}
                    onChange={(e) => handleChangeRow(index, 'ticker', e.target.value)}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="50"
                    value={item.allocation}
                    onChange={(e) => handleChangeRow(index, 'allocation', e.target.value)}
                    className="form-input"
                    min="0.1"
                    max="100"
                    step="any"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRow(index)}
                    className="remove-row-btn"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handleAddRow}
              className="btn-secondary add-row-btn"
            >
              <Plus size={16} />
              <span>Add Stock Ticker</span>
            </button>

            <div className="input-group">
              <label>Trader Risk Profile</label>
              <select 
                value={profile} 
                onChange={(e) => setProfile(e.target.value)}
                className="form-input profile-dropdown"
              >
                <option value="conservative">Conservative (Risk Averse / Income focus)</option>
                <option value="moderate">Moderate (Balanced / Core Growth)</option>
                <option value="aggressive">Aggressive (Capital Appreciation / High Volatility)</option>
                <option value="speculative">Speculative (Extreme Growth / Crypto & Tech bias)</option>
                <option value="hedged">Hedged (Market Neutral / Low Correlation)</option>
              </select>
            </div>

            {/* Allocation Status indicator */}
            <div className={`allocation-status ${isAllocationValid ? 'valid' : 'invalid'}`}>
              {isAllocationValid ? (
                <>
                  <CheckCircle size={16} className="status-icon" />
                  <span>Valid allocations totaling {totalAlloc}%</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} className="status-icon" />
                  <span>Allocations must equal 100% (Current: {totalAlloc}%)</span>
                </>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || !isAllocationValid} 
              className="btn-primary analyze-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  <span>Evaluating with AI Crew...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Run Portfolio Analyzer</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Markdown Report output */}
        <div className="report-panel glass-panel glass-panel-glow">
          <div className="report-header">
            <div className="report-title-meta">
              <FileText size={20} className="report-icon" />
              <h3>AI Analysis Summary</h3>
            </div>
            <div className="header-actions">
              {report && (
                <button onClick={handleDownloadPDF} className="btn-icon-text">
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              )}
              {report && <span className="badge-up">Generated Live</span>}
            </div>
          </div>

          {loading ? (
            <AILoader 
              title="Analyzing Portfolio Allocation" 
              tasks={[
                "Setting up multi-AI agent squad...",
                "Auditing target risk profile allocations...",
                "Scraping historical prices...",
                "Comparing holdings metrics...",
                "Formulating asset mitigation strategy...",
                "Synthesizing final strategic report PDF..."
              ]}
            />
          ) : report ? (
            <div className="report-content">
              <div className="report-body">
                <Markdown text={report} />
              </div>
            </div>
          ) : (
            <div className="report-placeholder empty-state">
              <BrainCircuit size={48} className="report-empty-icon" />
              <h4>Ready for Analysis</h4>
              <p>Configure your stock allocations on the left and run the analyzer to generate your tailored AI report.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .analyzer-wrapper {
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

        .error-alert {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.2);
          color: var(--danger);
          padding: 14px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
        }

        .analyzer-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .analyzer-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Settings Panel */
        .settings-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
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

        .preset-loading, .preset-loaded {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .preset-loading {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
        }

        .preset-loaded {
          background: var(--success-glow);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.1);
        }

        .panel-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .analyzer-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .stocks-allocation-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .list-label-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 40px;
          gap: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-left: 4px;
        }

        .allocation-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 40px;
          gap: 12px;
          align-items: center;
        }

        .remove-row-btn {
          height: 42px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          color: var(--text-muted);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .remove-row-btn:hover {
          background: rgba(244, 63, 94, 0.05);
          border-color: rgba(244, 63, 94, 0.2);
          color: var(--danger);
        }

        .add-row-btn {
          height: 40px;
          font-size: 0.85rem;
          width: 100%;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .profile-dropdown {
          cursor: pointer;
          background: #0f1524;
        }

        .allocation-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .allocation-status.valid {
          background: var(--success-glow);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.1);
        }

        .allocation-status.invalid {
          background: rgba(245, 158, 11, 0.05);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.15);
        }

        .analyze-submit-btn {
          height: 46px;
          font-size: 1rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Report Panel */
        .report-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-height: 420px;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 14px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
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

        .report-title-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .report-icon {
          color: var(--primary);
        }

        .report-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .report-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 60px 20px;
          text-align: center;
          color: var(--text-secondary);
        }

        .brain-pulse {
          color: var(--primary);
          animation: pulseBrain 2s infinite ease-in-out;
        }

        @keyframes pulseBrain {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(79, 70, 229, 0.2)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 16px rgba(79, 70, 229, 0.6)); }
        }

        .report-placeholder h4 {
          font-size: 1.15rem;
          color: #fff;
        }

        .report-placeholder p {
          max-width: 320px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .report-empty-icon {
          color: var(--text-muted);
        }

        /* Markdown report body styling */
        .report-content {
          padding-right: 6px;
          max-height: 520px;
          overflow-y: auto;
        }

        .report-body {
          color: #d1d5db;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .report-h1 {
          font-size: 1.4rem;
          color: #fff;
          font-weight: 800;
          margin-top: 20px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 6px;
        }

        .report-h2 {
          font-size: 1.2rem;
          color: #fff;
          font-weight: 700;
          margin-top: 16px;
          margin-bottom: 10px;
        }

        .report-h3 {
          font-size: 1.05rem;
          color: #f3f4f6;
          font-weight: 600;
          margin-top: 12px;
          margin-bottom: 8px;
        }

        .report-p {
          margin-bottom: 12px;
        }

        .report-li {
          margin-left: 20px;
          margin-bottom: 6px;
          list-style-type: square;
        }

        .report-space {
          height: 12px;
        }
      `}</style>
    </div>
  );
}
