import React, { useState, useRef, useEffect } from 'react';

export default function CodeInput({ onAnalyze, disabled }) {
  const [code, setCode] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    // Focus the textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim() && !disabled) {
      onAnalyze(code);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter / Cmd+Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleExampleClick = () => {
    const example = `let nome = "Mario";
let eta = 25;
let saluto = "Ciao " + nome;

if (eta >= 18) {
  console.log(saluto + ", sei maggiorenne!");
} else {
  console.log(saluto + ", sei minorenne.");
}

// Funzione che calcola l'anno di nascita
function calcolaAnnoNascita(eta) {
  const annoCorrente = 2026;
  return annoCorrente - eta;
}

console.log("Anno di nascita:", calcolaAnnoNascita(eta));`;
    setCode(example);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const charCount = code.length;

  return (
    <form className="code-input" onSubmit={handleSubmit}>
      <div className="input-header">
        <label htmlFor="code-textarea" className="input-label">
          Incolla qui il tuo codice sorgente
        </label>
        <button
          type="button"
          className="example-btn"
          onClick={handleExampleClick}
          disabled={disabled}
        >
          Prova un esempio
        </button>
      </div>

      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          id="code-textarea"
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            'Incolla qui il tuo codice JavaScript, Python, HTML...\n\n' +
            'Esempio:\n' +
            'let x = 5;\n' +
            'console.log(x);\n\n' +
            'Premi Ctrl+Invio per analizzare'
          }
          rows={10}
          disabled={disabled}
          spellCheck={false}
          aria-describedby="char-count"
        />
        <div className="textarea-gutter" aria-hidden="true">
          {code.split('\n').map((_, i) => (
            <span key={i} className="gutter-line">{i + 1}</span>
          ))}
        </div>
      </div>

      <div className="input-footer">
        <span id="char-count" className="char-count">
          {charCount} caratter{charCount !== 1 ? 'i' : 'e'}
          {charCount > 0 && ` — ${code.split('\n').length} righe`}
        </span>
        <button
          type="submit"
          className="analyze-btn"
          disabled={!code.trim() || disabled}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
            <path d="M11 8v6"/>
            <path d="M8 11h6"/>
          </svg>
          Analizza
        </button>
      </div>
    </form>
  );
}
