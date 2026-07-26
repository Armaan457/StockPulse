'use client';

import React from 'react';

export default function Markdown({ text }) {
  if (!text) return null;

  // Split text by newlines
  const lines = text.split('\n');

  return (
    <div className="markdown-body">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty lines
        if (trimmed === '') {
          return <div key={idx} className="md-spacer" />;
        }

        // Headers
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="md-h1">{renderInline(line.substring(line.indexOf('# ') + 2))}</h1>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="md-h2">{renderInline(line.substring(line.indexOf('## ') + 3))}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="md-h3">{renderInline(line.substring(line.indexOf('### ') + 4))}</h3>;
        }

        // Bullet list items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const listText = trimmed.startsWith('- ') ? trimmed.slice(2) : trimmed.slice(2);
          return (
            <ul key={idx} className="md-ul">
              <li className="md-li">{renderInline(listText)}</li>
            </ul>
          );
        }

        // Standard paragraphs
        return <p key={idx} className="md-p">{renderInline(line)}</p>;
      })}

      <style jsx global>{`
        .markdown-body {
          line-height: 1.6;
          font-family: inherit;
          color: inherit;
          width: 100%;
        }

        .md-h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 20px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 6px;
        }

        .md-h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 16px;
          margin-bottom: 10px;
        }

        .md-h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin-top: 12px;
          margin-bottom: 8px;
        }

        .md-p {
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .md-spacer {
          height: 8px;
        }

        .md-ul {
          margin-top: 0;
          margin-bottom: 12px;
          padding-left: 20px;
          list-style-type: square;
        }

        .md-li {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .md-li strong, .md-p strong {
          color: var(--primary);
          font-weight: 600;
        }

        .md-code {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}

// Parse inline markup (bold **text**, inline `code`)
function renderInline(text) {
  if (!text) return '';

  // Regex to split by bold asterisks or backticks
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="md-code">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
