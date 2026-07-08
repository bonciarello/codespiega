import React, { useState, useRef, useEffect } from 'react';

export default function InlineNoteEditor({ initialNote, onSave, onCancel, lineNumber }) {
  const [note, setNote] = useState(initialNote || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Posiziona il cursore alla fine
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, []);

  const handleSave = () => {
    const trimmed = note.trim();
    if (trimmed) {
      onSave(trimmed);
    } else {
      onSave(''); // empty note = delete
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="inline-note-editor" role="dialog" aria-label={`Nota per la riga ${lineNumber}`}>
      <div className="note-editor-header">
        <span className="note-editor-title">
          Nota per la riga {lineNumber}
        </span>
        <button
          type="button"
          className="note-cancel-btn"
          onClick={onCancel}
          aria-label="Annulla nota"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="note-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scrivi la tua annotazione personale…"
        rows={3}
        aria-label={`Testo della nota per la riga ${lineNumber}`}
      />
      <div className="note-editor-footer">
        <span className="note-hint">Ctrl+Invio per salvare, Esc per annullare</span>
        <div className="note-editor-actions">
          <button
            type="button"
            className="note-save-btn"
            onClick={handleSave}
          >
            Salva nota
          </button>
        </div>
      </div>
    </div>
  );
}
