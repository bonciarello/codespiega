import React from 'react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-icon" aria-hidden="true">&lt;/&gt;</span>
          <div>
            <h1 className="header-title">Codice Spiegato</h1>
            <p className="header-subtitle">
              Analizza il tuo codice sorgente riga per riga, in italiano.
              Aggiungi note, nascondi blocchi e impara a programmare.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
