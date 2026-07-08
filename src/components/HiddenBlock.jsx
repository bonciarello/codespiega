import React from 'react';

export default function HiddenBlock({ startLine, endLine, count, isExpanded, onToggle, onUnhide }) {
  if (isExpanded) {
    return (
      <div className="hidden-block expanded">
        <div className="hidden-block-bar">
          <button
            type="button"
            className="hidden-block-toggle"
            onClick={onToggle}
            aria-expanded="true"
            aria-label={`Nascondi le righe da ${startLine} a ${endLine}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6"/>
            </svg>
            Nascondi blocco (righe {startLine}–{endLine})
          </button>
          <button
            type="button"
            className="hidden-block-remove"
            onClick={onUnhide}
            aria-label={`Rimuovi definitivamente il nascondiglio delle righe ${startLine}-${endLine}`}
          >
            Rimuovi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden-block collapsed">
      <button
        type="button"
        className="hidden-block-toggle collapsed"
        onClick={onToggle}
        aria-expanded="false"
        aria-label={`Mostra le righe nascoste da ${startLine} a ${endLine}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6"/>
        </svg>
        <span>
          {count} rig{count === 1 ? 'a' : 'he'} nascost{count === 1 ? 'a' : 'e'}
          {' '}({startLine}{endLine !== startLine ? `–${endLine}` : ''})
          {' — clicca per mostrare'}
        </span>
      </button>
    </div>
  );
}
