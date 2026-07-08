import React, { useReducer, useCallback } from 'react';
import Header from './components/Header.jsx';
import CodeInput from './components/CodeInput.jsx';
import ExplanationPanel, { groupConsecutive } from './components/ExplanationPanel.jsx';
import { explainCode, getLanguageName } from './engine/explainer.js';
import './App.css';

const initialState = {
  code: '',
  explanations: [],
  notes: {},
  hiddenRanges: [],
  selectedLines: new Set(),
  editingNoteLine: null,
  hasAnalyzed: false,
  language: '',
  isAnalyzing: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.payload };

    case 'START_ANALYSIS':
      return { ...state, isAnalyzing: true };

    case 'ANALYZE': {
      const explanations = explainCode(action.payload);
      const language = getLanguageName(action.payload);
      return {
        ...state,
        code: action.payload,
        explanations,
        language,
        hasAnalyzed: true,
        isAnalyzing: false,
        notes: {},
        hiddenRanges: [],
        selectedLines: new Set(),
        editingNoteLine: null,
      };
    }

    case 'SAVE_NOTE': {
      const { line, text } = action.payload;
      if (!text || text.trim() === '') {
        const newNotes = { ...state.notes };
        delete newNotes[line];
        return { ...state, notes: newNotes, editingNoteLine: null };
      }
      return {
        ...state,
        notes: { ...state.notes, [line]: text.trim() },
        editingNoteLine: null,
      };
    }

    case 'START_NOTE_EDIT':
      return { ...state, editingNoteLine: action.payload };

    case 'CANCEL_NOTE_EDIT':
      return { ...state, editingNoteLine: null };

    case 'TOGGLE_SELECT': {
      const sel = new Set(state.selectedLines);
      if (sel.has(action.payload)) {
        sel.delete(action.payload);
      } else {
        sel.add(action.payload);
      }
      return { ...state, selectedLines: sel };
    }

    case 'HIDE_SELECTED': {
      const sorted = [...state.selectedLines].sort((a, b) => a - b);
      const ranges = groupConsecutive(sorted);
      // Evita sovrapposizioni: filtra le righe già nascoste
      const existingHidden = new Set();
      state.hiddenRanges.forEach((r) => {
        for (let i = r.start; i <= r.end; i++) existingHidden.add(i);
      });
      const filteredRanges = ranges.filter(
        (r) => !existingHidden.has(r.start)
      );
      if (filteredRanges.length === 0) {
        return { ...state, selectedLines: new Set() };
      }
      return {
        ...state,
        hiddenRanges: [
          ...state.hiddenRanges,
          ...filteredRanges.map((r) => ({ start: r.start, end: r.end, expanded: false })),
        ],
        selectedLines: new Set(),
      };
    }

    case 'TOGGLE_HIDDEN_BLOCK': {
      return {
        ...state,
        hiddenRanges: state.hiddenRanges.map((r, i) =>
          i === action.payload ? { ...r, expanded: !r.expanded } : r
        ),
      };
    }

    case 'UNHIDE_BLOCK': {
      return {
        ...state,
        hiddenRanges: state.hiddenRanges.filter((_, i) => i !== action.payload),
      };
    }

    case 'UNHIDE_ALL': {
      return { ...state, hiddenRanges: [] };
    }

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAnalyze = useCallback((code) => {
    dispatch({ type: 'START_ANALYSIS' });
    // Piccolo ritardo per mostrare lo stato di caricamento
    setTimeout(() => {
      dispatch({ type: 'ANALYZE', payload: code });
    }, 150);
  }, []);

  const handleToggleSelect = useCallback((lineNumber) => {
    dispatch({ type: 'TOGGLE_SELECT', payload: lineNumber });
  }, []);

  const handleHideSelected = useCallback(() => {
    dispatch({ type: 'HIDE_SELECTED' });
  }, []);

  const handleUnhideAll = useCallback(() => {
    dispatch({ type: 'UNHIDE_ALL' });
  }, []);

  const handleToggleHiddenBlock = useCallback((index) => {
    dispatch({ type: 'TOGGLE_HIDDEN_BLOCK', payload: index });
  }, []);

  const handleUnhideBlock = useCallback((index) => {
    dispatch({ type: 'UNHIDE_BLOCK', payload: index });
  }, []);

  const handleSaveNote = useCallback((line, text) => {
    dispatch({ type: 'SAVE_NOTE', payload: { line, text } });
  }, []);

  const handleStartNoteEdit = useCallback((line) => {
    dispatch({ type: 'START_NOTE_EDIT', payload: line });
  }, []);

  const handleCancelNoteEdit = useCallback(() => {
    dispatch({ type: 'CANCEL_NOTE_EDIT' });
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <CodeInput
          onAnalyze={handleAnalyze}
          disabled={state.isAnalyzing}
        />
        {state.hasAnalyzed && (
          <div className="analysis-meta">
            <span className="meta-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              Rilevato: {state.language}
            </span>
            <span className="meta-badge">
              {state.explanations.length} righe analizzate
            </span>
            {state.hiddenRanges.length > 0 && (
              <span className="meta-badge hidden-count">
                {state.hiddenRanges.reduce((sum, r) => sum + (r.end - r.start + 1), 0)} righe nascoste
              </span>
            )}
          </div>
        )}
        <ExplanationPanel
          explanations={state.explanations}
          notes={state.notes}
          hiddenRanges={state.hiddenRanges}
          selectedLines={state.selectedLines}
          editingNoteLine={state.editingNoteLine}
          onToggleSelect={handleToggleSelect}
          onHideSelected={handleHideSelected}
          onUnhideAll={handleUnhideAll}
          onToggleHiddenBlock={handleToggleHiddenBlock}
          onUnhideBlock={handleUnhideBlock}
          onSaveNote={handleSaveNote}
          onStartNoteEdit={handleStartNoteEdit}
          onCancelNoteEdit={handleCancelNoteEdit}
        />
      </main>
      <footer className="app-footer">
        <p>
          <strong>Codice Spiegato</strong> — spiegazione automatica basata su pattern matching.
          Le spiegazioni sono approssimative e hanno scopo didattico.
        </p>
      </footer>
    </div>
  );
}
