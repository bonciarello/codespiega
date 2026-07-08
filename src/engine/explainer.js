import { patterns } from './dictionary.js';

/**
 * Rileva il linguaggio di programmazione in modo euristico.
 * Restituisce 'javascript', 'python', 'html', 'css', 'sql' o 'unknown'.
 */
function detectLanguage(code) {
  const jsHints = /\b(let|const|var|function|console\.|=>|import .+ from|export |async |await |document\.|window\.|addEventListener|\.then\(|new Promise)\b/g;
  const pyHints = /\b(def |import \w+$|from \w+ import|print\(|elif |class \w+:|__\w+__|with .+ as |raise |lambda )/gm;
  const htmlHints = /<\/?\w+[^>]*>|<!DOCTYPE|<html|<head|<body|<div|<script|<style/gi;
  const cssHints = /[.#@]\w+\s*\{|[\w-]+\s*:\s*[\w#]+;|\b(margin|padding|color|font|display|position|width|height)\s*:/gi;
  const sqlHints = /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE TABLE|ALTER TABLE|DROP|JOIN|GROUP BY|ORDER BY)\b/gi;

  let scores = { javascript: 0, python: 0, html: 0, css: 0, sql: 0 };

  const jsMatch = code.match(jsHints);
  if (jsMatch) scores.javascript = jsMatch.length;

  const pyMatch = code.match(pyHints);
  if (pyMatch) scores.python = pyMatch.length;

  const htmlMatch = code.match(htmlHints);
  if (htmlMatch) scores.html = htmlMatch.length;

  const cssMatch = code.match(cssHints);
  if (cssMatch) scores.css = cssMatch.length;

  const sqlMatch = code.match(sqlHints);
  if (sqlMatch) scores.sql = sqlMatch.length;

  // HTML ha priorità se contiene tag (anche JSX)
  if (scores.html >= 3 && scores.html > scores.javascript) return 'html';
  if (scores.css >= 3 && scores.css > scores.javascript + scores.python) return 'css';
  if (scores.sql >= 2 && scores.sql > scores.javascript + scores.python) return 'sql';
  if (scores.python > scores.javascript) return 'python';
  if (scores.javascript > 0) return 'javascript';

  return 'unknown';
}

/**
 * Analizza una singola riga di codice e restituisce una spiegazione.
 */
function explainLine(line, lineIndex, allLines, language) {
  // Prima prova i pattern più specifici
  for (const pattern of patterns) {
    const match = line.match(pattern.regex);
    if (match) {
      try {
        return {
          explanation: pattern.explain(match),
          category: pattern.category,
          priority: pattern.priority,
        };
      } catch (e) {
        // Se la funzione explain fallisce, continua con altri pattern
        continue;
      }
    }
  }

  // Fallback: analisi generica
  return genericExplain(line, language);
}

/**
 * Spiegazione generica quando nessun pattern specifico corrisponde.
 */
function genericExplain(line, language) {
  const trimmed = line.trim();

  if (!trimmed) {
    return {
      explanation: 'Riga vuota: usata per separare blocchi di codice e migliorare la leggibilità',
      category: 'vuoto',
      priority: 1,
    };
  }

  // Identifica parole chiave comuni
  const keywords = [];
  if (/\bif\b/.test(trimmed)) keywords.push('condizione');
  if (/\belse\b/.test(trimmed)) keywords.push('ramo alternativo');
  if (/\bfor\b/.test(trimmed)) keywords.push('ciclo');
  if (/\bwhile\b/.test(trimmed)) keywords.push('ciclo');
  if (/\bfunction\b/.test(trimmed)) keywords.push('funzione');
  if (/\breturn\b/.test(trimmed)) keywords.push('restituzione');
  if (/\bclass\b/.test(trimmed)) keywords.push('classe');
  if (/\bnew\b/.test(trimmed)) keywords.push('creazione istanza');
  if (/\bimport\b/.test(trimmed)) keywords.push('importazione');
  if (/\bexport\b/.test(trimmed)) keywords.push('esportazione');
  if (/\bconst\b/.test(trimmed)) keywords.push('dichiarazione costante');
  if (/\blet\b/.test(trimmed)) keywords.push('dichiarazione variabile');
  if (/\bvar\b/.test(trimmed)) keywords.push('dichiarazione variabile');
  if (/\btry\b/.test(trimmed)) keywords.push('gestione errori');
  if (/\bcatch\b/.test(trimmed)) keywords.push('cattura errore');
  if (/\bthrow\b/.test(trimmed)) keywords.push('lancio errore');
  if (/\bawait\b/.test(trimmed)) keywords.push('attesa asincrona');
  if (/\basync\b/.test(trimmed)) keywords.push('funzione asincrona');
  if (/\btrue|false\b/.test(trimmed)) keywords.push('valore booleano');
  if (/\bnull\b/.test(trimmed)) keywords.push('valore nullo');
  if (/['"`]/.test(trimmed)) keywords.push('stringa');

  if (keywords.length > 0) {
    return {
      explanation: `Riga che coinvolge: ${keywords.join(', ')}`,
      category: 'generico',
      priority: 2,
    };
  }

  // Se contiene operatori matematici
  if (/[+\-*/%]/.test(trimmed.replace(/\/\/.*/, '').replace(/\/\*.*\*\//, ''))) {
    return {
      explanation: `Operazione o espressione: ${trimmed.length > 40 ? trimmed.substring(0, 40) + '…' : trimmed}`,
      category: 'espressione',
      priority: 2,
    };
  }

  return {
    explanation: `Istruzione: ${trimmed.length > 50 ? trimmed.substring(0, 50) + '…' : trimmed}`,
    category: 'generico',
    priority: 1,
  };
}

/**
 * Funzione principale: spiega l'intero codice.
 * Restituisce un array di oggetti { lineNumber, code, explanation, category }.
 */
export function explainCode(code) {
  if (!code || !code.trim()) {
    return [];
  }

  const lines = code.split('\n');
  const language = detectLanguage(code);
  const explanations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const result = explainLine(line, i, lines, language);

    explanations.push({
      lineNumber: i + 1,
      code: line,
      explanation: result.explanation,
      category: result.category,
    });
  }

  return explanations;
}

/**
 * Rileva il linguaggio e restituisce un nome leggibile.
 */
export function getLanguageName(code) {
  const lang = detectLanguage(code);
  const names = {
    javascript: 'JavaScript / TypeScript',
    python: 'Python',
    html: 'HTML',
    css: 'CSS',
    sql: 'SQL',
    unknown: 'Generico',
  };
  return names[lang] || 'Generico';
}
