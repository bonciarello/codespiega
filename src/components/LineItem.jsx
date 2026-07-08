import React, { useState } from 'react';
import InlineNoteEditor from './InlineNoteEditor.jsx';

const categoryIcons = {
  commento: '💬',
  dichiarazione: '📦',
  assegnazione: '✏️',
  output: '🖨️',
  funzione: '🔧',
  controllo: '🔀',
  ciclo: '🔄',
  classe: '🏗️',
  modulo: '📥',
  asincrono: '⏳',
  dom: '🌐',
  array: '📋',
  errore: '⚠️',
  direttiva: '⚙️',
  struttura: '{}',
  vuoto: '⬜',
  html: '🏷️',
  risorsa: '📂',
  espressione: '🧮',
  generico: '📝',
};

export default function LineItem({
  lineNumber,
  code,
  explanation,
  category,
  note,
  isSelected,
  isHidden,
  onSelect,
  onSaveNote,
  onDeleteNote,
  onStartNoteEdit,
  onCancelNoteEdit,
  isEditingNote,
}) {
  const [hovered, setHovered] = useState(false);

  if (isHidden) {
    return null; // Non renderizzare linee nascoste (gestite da HiddenBlock)
  }

  const handleLineClick = (e) => {
    // Non selezionare se si clicca sul pulsante nota
    if (e.target.closest('.note-btn') || e.target.closest('.inline-note-editor')) {
      return;
    }
    onSelect(lineNumber);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(lineNumber);
    }
  };

  const hasNote = note && note.trim().length > 0;
  const icon = categoryIcons[category] || '📝';

  return (
    <div
      className={`line-item${isSelected ? ' selected' : ''}${hovered ? ' hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="group"
      aria-label={`Riga ${lineNumber}`}
    >
      {/* Checkbox di selezione + numero riga */}
      <div className="line-gutter">
        <button
          type="button"
          className={`line-select-btn${isSelected ? ' selected' : ''}`}
          onClick={() => onSelect(lineNumber)}
          onKeyDown={handleKeyDown}
          aria-pressed={isSelected}
          aria-label={`Seleziona riga ${lineNumber}`}
          tabIndex={0}
        >
          <span className="line-number">{lineNumber}</span>
          <span className={`select-indicator${isSelected ? ' visible' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </span>
        </button>
      </div>

      {/* Codice */}
      <div className="line-code">
        <pre><code>{code || ' '}</code></pre>
      </div>

      {/* Spiegazione */}
      <div className="line-explanation">
        <span className="explanation-icon" aria-hidden="true">{icon}</span>
        <span className="explanation-text">{explanation}</span>

        {/* Bottone nota */}
        <button
          type="button"
          className={`note-btn${hasNote ? ' has-note' : ''}`}
          onClick={() => isEditingNote ? onCancelNoteEdit(lineNumber) : onStartNoteEdit(lineNumber)}
          aria-label={hasNote ? `Modifica nota: ${note}` : `Aggiungi una nota alla riga ${lineNumber}`}
          title={hasNote ? 'Modifica la tua nota' : 'Aggiungi una nota personale'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={hasNote ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          {hasNote && <span className="note-indicator-dot" aria-hidden="true" />}
        </button>
      </div>

      {/* Editor nota inline */}
      {isEditingNote && (
        <div className="line-note-editor-wrapper">
          <InlineNoteEditor
            initialNote={note}
            lineNumber={lineNumber}
            onSave={(text) => {
              onSaveNote(lineNumber, text);
            }}
            onCancel={() => onCancelNoteEdit(lineNumber)}
          />
        </div>
      )}

      {/* Nota salvata (anteprima) */}
      {hasNote && !isEditingNote && (
        <div className="line-note-preview" onClick={() => onStartNoteEdit(lineNumber)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          <span className="note-preview-text">{note}</span>
        </div>
      )}
    </div>
  );
}
