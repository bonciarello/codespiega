import React, { useCallback } from 'react';
import LineItem from './LineItem.jsx';
import HiddenBlock from './HiddenBlock.jsx';

/**
 * Raggruppa numeri consecutivi in intervalli.
 * Es: [1,2,3,5,6,8] → [{start:1, end:3}, {start:5, end:6}, {start:8, end:8}]
 */
function groupConsecutive(nums) {
  if (nums.length === 0) return [];
  const sorted = [...nums].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push({ start, end });
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push({ start, end });
  return ranges;
}

export default function ExplanationPanel({
  explanations,
  notes,
  hiddenRanges,
  selectedLines,
  editingNoteLine,
  onToggleSelect,
  onHideSelected,
  onUnhideAll,
  onToggleHiddenBlock,
  onUnhideBlock,
  onSaveNote,
  onStartNoteEdit,
  onCancelNoteEdit,
}) {
  const selectedArray = [...selectedLines].sort((a, b) => a - b);

  // Crea una mappa delle righe nascoste per lookup veloce
  const hiddenMap = new Map();
  hiddenRanges.forEach((range) => {
    for (let i = range.start; i <= range.end; i++) {
      hiddenMap.set(i, range);
    }
  });

  // Determina se tutte le righe sono selezionate
  const allSelected = explanations.length > 0 && selectedLines.size === explanations.length;

  const handleSelectAll = () => {
    if (allSelected) {
      // Deseleziona tutto
      explanations.forEach((_, i) => {
        if (selectedLines.has(i + 1)) {
          onToggleSelect(i + 1);
        }
      });
    } else {
      // Seleziona tutto
      explanations.forEach((_, i) => {
        if (!selectedLines.has(i + 1)) {
          onToggleSelect(i + 1);
        }
      });
    }
  };

  const hasHiddenRanges = hiddenRanges.length > 0;

  return (
    <div className="explanation-panel">
      {/* Toolbar */}
      <div className="panel-toolbar">
        <div className="toolbar-left">
          <h2 className="panel-title">
            Spiegazione
            <span className="panel-count">{explanations.length} righe</span>
          </h2>
        </div>
        <div className="toolbar-right">
          {explanations.length > 0 && (
            <>
              <button
                type="button"
                className={`toolbar-btn${allSelected ? ' active' : ''}`}
                onClick={handleSelectAll}
              >
                {allSelected ? 'Deseleziona tutto' : 'Seleziona tutto'}
              </button>
              {selectedLines.size >= 1 && (
                <button
                  type="button"
                  className="toolbar-btn hide-btn"
                  onClick={onHideSelected}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  Nascondi {selectedLines.size > 1 ? 'blocco' : 'riga'}
                </button>
              )}
              {hasHiddenRanges && (
                <button
                  type="button"
                  className="toolbar-btn unhide-all-btn"
                  onClick={onUnhideAll}
                >
                  Mostra tutto
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lista delle righe */}
      <div className="lines-list" role="list">
        {explanations.map((item, index) => {
          const lineNum = item.lineNumber;
          const hiddenRange = hiddenMap.get(lineNum);

          // Se questa riga è l'inizio di un blocco nascosto
          if (hiddenRange && hiddenRange.start === lineNum) {
            const rangeIdx = hiddenRanges.indexOf(hiddenRange);
            const isExpanded = hiddenRange.expanded || false;
            return (
              <React.Fragment key={`hidden-${hiddenRange.start}`}>
                <HiddenBlock
                  startLine={hiddenRange.start}
                  endLine={hiddenRange.end}
                  count={hiddenRange.end - hiddenRange.start + 1}
                  isExpanded={isExpanded}
                  onToggle={() => onToggleHiddenBlock(rangeIdx)}
                  onUnhide={() => onUnhideBlock(rangeIdx)}
                />
                {/* Se espanso, mostra le linee del blocco */}
                {isExpanded &&
                  explanations
                    .filter(
                      (e) =>
                        e.lineNumber >= hiddenRange.start &&
                        e.lineNumber <= hiddenRange.end
                    )
                    .map((e) => (
                      <LineItem
                        key={`line-${e.lineNumber}`}
                        lineNumber={e.lineNumber}
                        code={e.code}
                        explanation={e.explanation}
                        category={e.category}
                        note={notes[e.lineNumber] || ''}
                        isSelected={selectedLines.has(e.lineNumber)}
                        isHidden={false}
                        isEditingNote={editingNoteLine === e.lineNumber}
                        onSelect={onToggleSelect}
                        onSaveNote={onSaveNote}
                        onStartNoteEdit={onStartNoteEdit}
                        onCancelNoteEdit={onCancelNoteEdit}
                      />
                    ))}
              </React.Fragment>
            );
          }

          // Se la riga è all'interno di un blocco nascosto non espanso, non mostrarla
          if (hiddenRange && !hiddenRange.expanded) {
            return null;
          }

          // Se la riga è in un blocco nascosto espanso, è gestita sopra
          if (hiddenRange && hiddenRange.expanded && hiddenRange.start !== lineNum) {
            return null;
          }

          return (
            <LineItem
              key={`line-${lineNum}`}
              lineNumber={lineNum}
              code={item.code}
              explanation={item.explanation}
              category={item.category}
              note={notes[lineNum] || ''}
              isSelected={selectedLines.has(lineNum)}
              isHidden={false}
              isEditingNote={editingNoteLine === lineNum}
              onSelect={onToggleSelect}
              onSaveNote={onSaveNote}
              onStartNoteEdit={onStartNoteEdit}
              onCancelNoteEdit={onCancelNoteEdit}
            />
          );
        })}
      </div>

      {/* Stato vuoto */}
      {explanations.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
              <line x1="12" y1="2" x2="12" y2="22"/>
            </svg>
          </div>
          <p className="empty-title">Nessun codice da spiegare</p>
          <p className="empty-text">
            Incolla il tuo codice sorgente nel campo sopra e clicca <strong>Analizza</strong> per vedere
            la spiegazione riga per riga in italiano.
          </p>
        </div>
      )}
    </div>
  );
}

export { groupConsecutive };
