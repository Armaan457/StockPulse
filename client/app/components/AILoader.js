'use client';

import { useState, useEffect } from 'react';
import { Brain, Activity } from 'lucide-react';

export default function AILoader({ title = "AI Analysis in Progress", tasks }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const defaultTasks = [
    "Initializing multi-agent framework...",
    "Scraping historical market data...",
    "Analyzing momentum oscillators and moving averages...",
    "Evaluating articles and public sentiment feeds...",
    "Running backtest simulations.....",
    "Comparing risk profiles and asset covariance...",
    "Formulating strategic asset allocations...",
    "Drafting final investment thesis..."
  ];

  const loadingTasks = tasks && tasks.length > 0 ? tasks : defaultTasks;

  useEffect(() => {
    // Reset index if tasks change
    setTaskIndex(0);
    setProgress(0);
  }, [tasks]);

  useEffect(() => {
    if (loadingTasks.length <= 1) return;

    // Rotate text messages every 2.5 seconds
    const textInterval = setInterval(() => {
      setTaskIndex((prev) => (prev + 1) % loadingTasks.length);
    }, 2500);

    return () => clearInterval(textInterval);
  }, [loadingTasks]);

  useEffect(() => {
    // Slowly increment progress bar to 95% over 25 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const increment = Math.random() * 8 + 2; // Increments by 2-10%
        return Math.min(prev + increment, 95);
      });
    }, 1200);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="ai-loader-container animate-fade-in">
      <div className="loader-visual">
        <div className="pulse-circle">
          <Brain size={36} className="brain-glow" />
        </div>
        <div className="pulse-wave-wrapper">
          <Activity size={24} className="wave-icon" />
          <div className="wave-bar" />
          <div className="wave-bar delayed" />
        </div>
      </div>

      <div className="loader-text-section">
        <h4>{title}</h4>
        <div className="task-carousel">
          <span className="task-item" key={taskIndex}>
            {loadingTasks[taskIndex]}
          </span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        <span className="progress-value">{Math.round(progress)}%</span>
      </div>

      <style jsx>{`
        .ai-loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          text-align: center;
          background: rgba(0, 0, 0, 0.4);
          border: 1px dashed var(--border);
          border-radius: 16px;
          min-height: 320px;
          width: 100%;
        }

        .loader-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .pulse-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--primary-glow);
          border: 1px solid var(--primary);
          animation: beat 2s infinite ease-in-out;
        }

        .brain-glow {
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
        }

        @keyframes beat {
          0%, 100% { transform: scale(1); box-shadow: 0 0 10px var(--primary-glow); }
          50% { transform: scale(1.1); box-shadow: 0 0 25px rgba(0, 230, 118, 0.4); }
        }

        .pulse-wave-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--primary);
        }

        .wave-icon {
          animation: pulseIcon 1.5s infinite ease-in-out;
        }

        @keyframes pulseIcon {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Text Section */
        .loader-text-section {
          margin-bottom: 20px;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .loader-text-section h4 {
          font-size: 1.15rem;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .task-carousel {
          height: 24px;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }

        .task-item {
          display: inline-block;
          font-size: 0.9rem;
          color: var(--text-secondary);
          animation: slideUpFade 0.5s ease-out forwards;
          font-weight: 500;
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Progress Bar */
        .progress-bar-container {
          width: 100%;
          max-width: 320px;
          background: rgba(255, 255, 255, 0.05);
          height: 6px;
          border-radius: 10px;
          position: relative;
          overflow: visible;
          margin-top: 8px;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--primary);
          border-radius: 10px;
          box-shadow: 0 0 10px var(--primary-glow);
          transition: width 1.5s cubic-bezier(0.1, 0.8, 0.25, 1);
        }

        .progress-value {
          position: absolute;
          right: 0;
          top: -22px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
