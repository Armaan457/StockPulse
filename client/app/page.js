'use client';

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthProvider';
import AILoader from './components/AILoader';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Activity, 
  Loader2,
  FolderOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardPage() {
  const [holdings, setHoldings] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [tickerName, setTickerName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [startDate, setStartDate] = useState('2015-01-01');
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) return null;

  const fetchData = async (targetStartDate = startDate) => {
    try {
      setLoading(true);
      const portfolioList = await api.getPortfolios();
      setHoldings(portfolioList);
      
      if (portfolioList.length > 0) {
        await loadPerformance(portfolioList, targetStartDate);
      } else {
        setPerformanceData(null);
      }
    } catch (e) {
      console.error('Failed to load portfolio', e);
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const loadPerformance = async (portfolioList, customStartDate = startDate) => {
    try {
      setChartLoading(true);
      const tickers = portfolioList.map(h => h.ticker_name);
      const amounts = portfolioList.map(h => h.investment_amount);
      const perf = await api.getPortfolioPerformance(tickers, amounts, customStartDate);
      
      // Transform response dates & values for recharts
      // dates: string[], portfolio_value: number[], cumulative_return: number[]
      if (perf && perf.dates) {
        const formatted = perf.dates.map((date, idx) => ({
          date: date,
          value: parseFloat(perf.portfolio_value[idx].toFixed(2)),
          dailyReturn: parseFloat((perf.daily_return[idx] * 100).toFixed(2)),
          cumReturn: parseFloat((perf.cumulative_return[idx] * 100).toFixed(2)),
        }));
        setPerformanceData({
          chartData: formatted,
          latestValue: perf.portfolio_value[perf.portfolio_value.length - 1],
          cumulativeReturn: perf.cumulative_return[perf.cumulative_return.length - 1] * 100,
          totalInvestment: amounts.reduce((a, b) => a + b, 0),
        });
      }
    } catch (e) {
      console.error('Failed to load performance charts', e);
      setError('Could not compute portfolio performance. Verify ticker symbols are valid.');
    } finally {
      setChartLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!tickerName || !amount) return;
    
    setError('');
    setAddLoading(true);
    try {
      const newHolding = await api.createPortfolio(tickerName.trim().toUpperCase(), amount);
      const updatedList = [...holdings, newHolding];
      setHoldings(updatedList);
      setTickerName('');
      setAmount('');
      await loadPerformance(updatedList);
    } catch (err) {
      console.error(err);
      setError('Failed to add ticker. Ensure it exists on Yahoo Finance.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteStock = async (id) => {
    setError('');
    try {
      await api.deletePortfolio(id);
      const updatedList = holdings.filter(h => h.id !== id);
      setHoldings(updatedList);
      if (updatedList.length > 0) {
        await loadPerformance(updatedList);
      } else {
        setPerformanceData(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete holding.');
    }
  };

  const handleStartDateChange = async (e) => {
    const newDate = e.target.value;
    setStartDate(newDate);
    if (holdings.length > 0) {
      await loadPerformance(holdings, newDate);
    }
  };

  // Safe check for Recharts hydration mismatches
  const renderChart = () => {
    if (!mounted || !performanceData || !performanceData.chartData) return null;

    // Custom tooltips styling
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="tooltip-date">{payload[0].payload.date}</p>
            <p className="tooltip-value">
              Value: <span>${payload[0].value.toLocaleString()}</span>
            </p>
            <p className={`tooltip-return ${payload[0].payload.cumReturn >= 0 ? 'up' : 'down'}`}>
              Gain: <span>{payload[0].payload.cumReturn}%</span>
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={performanceData.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="var(--text-muted)" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(str) => {
              const parts = str.split('-');
              return `${parts[1]}/${parts[0].slice(2)}`; // MM/YY
            }}
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="var(--primary)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const totalInvestment = holdings.reduce((sum, h) => sum + h.investment_amount, 0);
  const latestValue = performanceData ? performanceData.latestValue : totalInvestment;
  const cumulativeReturn = performanceData ? performanceData.cumulativeReturn : 0;
  const netProfitLoss = latestValue - totalInvestment;

  return (
    <div className="dashboard-wrapper animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Portfolio Dashboard</h1>
          <p>Monitor your active holdings and compute backtested performance metrics</p>
        </div>
      </header>

      {error && (
        <div className="error-alert">
          <Activity size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <AILoader 
          title="Syncing Portfolio Data" 
          tasks={[
            "Connecting to StockPulse secure database...",
            "Loading active user stock ticker records...",
            "Aggregating portfolio allocation weight indices...",
            "Computing backtested daily return logs...",
            "Finalizing portfolio dashboard view..."
          ]} 
        />
      ) : (
        <>
          {/* Dashboard Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card glass-panel">
              <div className="card-header">
                <span className="card-title">Total Invested</span>
                <DollarSign size={20} className="card-icon" />
              </div>
              <div className="card-value">${totalInvestment.toLocaleString()}</div>
              <div className="card-subtext">Original principal capital</div>
            </div>

            <div className="summary-card glass-panel">
              <div className="card-header">
                <span className="card-title">Portfolio Value</span>
                <Activity size={20} className="card-icon" />
              </div>
              <div className="card-value">${Math.round(latestValue).toLocaleString()}</div>
              <div className="card-subtext">Current asset value</div>
            </div>

            <div className="summary-card glass-panel">
              <div className="card-header">
                <span className="card-title">Return Rate</span>
                <Percent size={20} className="card-icon" />
              </div>
              <div className={`card-value ${cumulativeReturn >= 0 ? 'text-up' : 'text-down'}`}>
                {cumulativeReturn >= 0 ? '+' : ''}{cumulativeReturn.toFixed(2)}%
              </div>
              <div className="card-subtext">
                {cumulativeReturn >= 0 ? 'Net profit of ' : 'Net loss of '}
                <span className={netProfitLoss >= 0 ? 'text-up' : 'text-down'}>
                  ${Math.abs(Math.round(netProfitLoss)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Chart Area */}
            <div className="chart-panel glass-panel glass-panel-glow">
              <div className="panel-header">
                <div className="panel-title-group">
                  <h3>Backtesting Value Path</h3>
                  <span className="panel-subtitle">Historical performance analysis</span>
                </div>
                <div className="date-filter-group">
                  <label htmlFor="startDateInput">From:</label>
                  <input
                    type="date"
                    id="startDateInput"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="date-input"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              {chartLoading ? (
                <div style={{ padding: '20px 0', width: '100%' }}>
                  <AILoader 
                    title="Recalculating Historical Path" 
                    tasks={[
                      "Fetching adjusted close prices from Yahoo Finance...",
                      `Aligning timeline dates back to ${startDate}...`,
                      "Calculating index-weighted returns...",
                      "Generating backtesting visual data..."
                    ]} 
                  />
                </div>
              ) : holdings.length === 0 ? (
                <div className="chart-placeholder empty-state">
                  <FolderOpen size={48} className="empty-icon" />
                  <h4>No stocks added yet</h4>
                  <p>Add tickers in the sidebar manager to map historical returns.</p>
                </div>
              ) : (
                <div className="chart-container">
                  {renderChart()}
                </div>
              )}
            </div>

            {/* Holdings Manager */}
            <div className="holdings-panel glass-panel">
              <h3>Manage Holdings</h3>
              <p className="section-desc">Add stocks and their capital allocation weights</p>

              <form onSubmit={handleAddStock} className="add-holding-form">
                <div className="form-inputs">
                  <input
                    type="text"
                    placeholder="Ticker (e.g. AAPL)"
                    value={tickerName}
                    onChange={(e) => setTickerName(e.target.value)}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
                <button type="submit" disabled={addLoading} className="btn-primary add-btn">
                  {addLoading ? (
                    <Loader2 size={16} className="spinner" />
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add Ticker</span>
                    </>
                  )}
                </button>
              </form>

              <div className="holdings-list">
                {holdings.length === 0 ? (
                  <p className="no-holdings">No active holdings. Add your first ticker above.</p>
                ) : (
                  holdings.map((holding) => {
                    const weight = totalInvestment > 0 
                      ? ((holding.investment_amount / totalInvestment) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={holding.id} className="holding-row">
                        <div className="holding-info">
                          <span className="holding-ticker">{holding.ticker_name}</span>
                          <span className="holding-weight">{weight}% allocation</span>
                        </div>
                        <div className="holding-actions">
                          <span className="holding-amount">${holding.investment_amount.toLocaleString()}</span>
                          <button 
                            onClick={() => handleDeleteStock(holding.id)}
                            className="delete-btn"
                            title="Delete Ticker"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .dashboard-wrapper {
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

        .page-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 300px;
          color: var(--text-secondary);
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: var(--primary);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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

        /* Summary Cards */
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .summary-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-secondary);
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-icon {
          color: var(--text-muted);
        }

        .card-value {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .card-subtext {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .text-up {
          color: var(--success);
        }

        .text-down {
          color: var(--danger);
        }

        /* Layout Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-panel {
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

        .panel-title-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .panel-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .date-filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .date-input {
          background: #090d0b;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: #ffffff;
          padding: 6px 10px;
          font-size: 0.85rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }

        .date-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 8px var(--primary-glow);
        }

        @media (max-width: 580px) {
          .panel-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .date-filter-group {
            width: 100%;
            justify-content: space-between;
          }
          .date-input {
            width: 130px;
          }
        }

        .chart-placeholder {
          height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.01);
          border: 1px dashed var(--border);
          border-radius: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .empty-state h4 {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 4px;
        }

        .empty-state p {
          font-size: 0.9rem;
        }

        .chart-container {
          width: 100%;
          height: 320px;
        }

        /* Tooltip style */
        :global(.custom-tooltip) {
          background: #0f172a;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }

        :global(.tooltip-date) {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        :global(.tooltip-value) {
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff;
        }

        :global(.tooltip-return) {
          font-size: 0.85rem;
          font-weight: 600;
        }

        :global(.tooltip-return.up) {
          color: var(--success);
        }

        :global(.tooltip-return.down) {
          color: var(--danger);
        }

        /* Holdings Panel */
        .holdings-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .holdings-panel h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .section-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .add-holding-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .form-inputs {
          display: flex;
          gap: 10px;
        }

        .add-btn {
          height: 40px;
          width: 100%;
        }

        .holdings-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 260px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .no-holdings {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-align: center;
          padding: 20px 0;
        }

        .holding-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .holding-row:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .holding-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .holding-ticker {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
        }

        .holding-weight {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .holding-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .holding-amount {
          font-size: 1rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .delete-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.15s ease;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover {
          color: var(--danger);
        }
      `}</style>
    </div>
  );
}
