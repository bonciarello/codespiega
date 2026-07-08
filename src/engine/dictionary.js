/**
 * Dizionario di pattern per la spiegazione del codice in italiano.
 * Ogni pattern ha: regex, category, priority, explain (funzione che produce la spiegazione).
 */

function descriviValore(val) {
  val = val.trim();
  if (!val) return 'un valore';
  if (/^['"`].*['"`]$/.test(val)) return `la stringa ${val}`;
  if (/^\d+$/.test(val)) return `il numero ${val}`;
  if (/^\d+\.\d+$/.test(val)) return `il numero decimale ${val}`;
  if (/^(true|false)$/i.test(val)) return `il valore booleano ${val}`;
  if (val === 'null' || val === 'None') return 'null (nessun valore)';
  if (val === 'undefined') return 'undefined (valore non definito)';
  if (/^\[.*\]$/.test(val)) return 'un array';
  if (/^\{.*\}$/.test(val)) return 'un oggetto';
  if (/^function/i.test(val)) return 'una funzione';
  if (/^\(/.test(val)) return "un'espressione";
  if (/^\w+\.\w+/.test(val)) return `il risultato di ${val}`;
  return `il valore di ${val}`;
}

function descriviTagHtml(tag) {
  const m = {
    html: 'documento HTML',
    head: 'intestazione del documento (metadati, titolo, collegamenti)',
    body: 'corpo visibile del documento',
    div: 'contenitore generico di blocco',
    span: 'contenitore generico in linea',
    p: 'paragrafo di testo',
    h1: 'titolo di primo livello (il più importante)',
    h2: 'titolo di secondo livello',
    h3: 'titolo di terzo livello',
    h4: 'titolo di quarto livello',
    h5: 'titolo di quinto livello',
    h6: 'titolo di sesto livello',
    a: 'collegamento ipertestuale (link)',
    img: 'immagine',
    ul: 'lista non ordinata (puntata)',
    ol: 'lista ordinata (numerata)',
    li: 'elemento di una lista',
    table: 'tabella',
    thead: 'intestazione della tabella',
    tbody: 'corpo della tabella',
    tr: 'riga di tabella',
    td: 'cella di tabella',
    th: 'cella di intestazione della tabella',
    form: 'modulo per l\'invio di dati',
    input: 'campo di inserimento dati',
    textarea: 'area di testo multilinea',
    select: 'menu a discesa',
    option: 'opzione di un menu a discesa',
    button: 'pulsante cliccabile',
    label: 'etichetta per un campo del modulo',
    script: 'script (codice JavaScript)',
    style: 'foglio di stile CSS incorporato',
    link: 'collegamento a risorsa esterna (CSS, font, ecc.)',
    meta: 'metadato del documento',
    title: 'titolo della pagina (visibile nella scheda del browser)',
    header: 'intestazione di una sezione o della pagina',
    footer: 'piè di pagina',
    nav: 'blocco di navigazione',
    main: 'contenuto principale della pagina',
    section: 'sezione tematica del documento',
    article: 'contenuto autonomo e indipendente',
    aside: 'contenuto correlato ma secondario',
    strong: 'testo in grassetto (importante)',
    em: 'testo in corsivo (enfasi)',
    code: 'frammento di codice',
    pre: 'testo preformattato (mantiene spazi e ritorni a capo)',
    br: 'interruzione di riga (a capo)',
    hr: 'linea orizzontale di separazione',
  };
  return m[tag.toLowerCase()] || `elemento <${tag}>`;
}

const patterns = [
  // ═══════════════ COMMENTI ═══════════════
  {
    regex: /^\s*\/\/\s*(.*)$/,
    priority: 10,
    category: 'commento',
    explain: (m) => `Commento su una riga: "${m[1].trim()}"`,
  },
  {
    regex: /^\s*\/\*\s*(.*?)\s*\*\/\s*$/,
    priority: 10,
    category: 'commento',
    explain: (m) => `Commento racchiuso tra /* */: "${m[1].trim()}"`,
  },
  {
    regex: /^\s*\/\*\*?\s*$/,
    priority: 9,
    category: 'commento',
    explain: () => 'Inizio di un blocco di commento multilinea',
  },
  {
    regex: /^\s*\*\/\s*$/,
    priority: 9,
    category: 'commento',
    explain: () => 'Fine del blocco di commento multilinea',
  },
  {
    regex: /^\s*\*\s+(.*)$/,
    priority: 8,
    category: 'commento',
    explain: (m) => `Continuazione del commento multilinea: "${m[1].trim()}"`,
  },
  {
    regex: /^\s*#\s*(.*)$/,
    priority: 10,
    category: 'commento',
    explain: (m) => `Commento: "${m[1].trim()}"`,
  },
  {
    regex: /^\s*--\s*(.*)$/,
    priority: 10,
    category: 'commento',
    explain: (m) => `Commento SQL: "${m[1].trim()}"`,
  },
  {
    regex: /^\s*<!--\s*(.*?)\s*-->\s*$/,
    priority: 10,
    category: 'commento',
    explain: (m) => `Commento HTML: "${m[1].trim()}"`,
  },
  {
    regex: /^\s*<!--/,
    priority: 9,
    category: 'commento',
    explain: () => 'Inizio di un commento HTML',
  },
  {
    regex: /-->\s*$/,
    priority: 9,
    category: 'commento',
    explain: () => 'Fine del commento HTML',
  },

  // ═══════════════ DICHIARAZIONI (JS/TS) ═══════════════
  {
    regex: /^\s*let\s+(\w+)\s*;\s*$/,
    priority: 5,
    category: 'dichiarazione',
    explain: (m) => `Dichiara una variabile chiamata "${m[1]}" senza inizializzarla (al momento vale undefined)`,
  },
  {
    regex: /^\s*let\s+(\w+)\s*=\s*(.+?);?\s*$/,
    priority: 6,
    category: 'dichiarazione',
    explain: (m) => `Dichiara la variabile "${m[1]}" e le assegna ${descriviValore(m[2])}`,
  },
  {
    regex: /^\s*const\s+(\w+)\s*=\s*(.+?);?\s*$/,
    priority: 6,
    category: 'dichiarazione',
    explain: (m) => `Dichiara la costante "${m[1]}" con ${descriviValore(m[2])}. Questa variabile non potrà essere riassegnata in seguito`,
  },
  {
    regex: /^\s*var\s+(\w+)\s*=\s*(.+?);?\s*$/,
    priority: 6,
    category: 'dichiarazione',
    explain: (m) => `Dichiara la variabile "${m[1]}" (con var) e le assegna ${descriviValore(m[2])}. Nota: var ha scope di funzione, non di blocco — in JavaScript moderno si preferisce let o const`,
  },
  {
    regex: /^\s*var\s+(\w+)\s*;\s*$/,
    priority: 5,
    category: 'dichiarazione',
    explain: (m) => `Dichiara la variabile "${m[1]}" con var (non inizializzata)`,
  },
  {
    regex: /^\s*(\w+)\s*=\s*(.+?);?\s*$/,
    priority: 4,
    category: 'assegnazione',
    explain: (m) => `Assegna a "${m[1]}" ${descriviValore(m[2])}`,
  },
  {
    regex: /^\s*(\w+)\s*\+=/,
    priority: 4,
    category: 'assegnazione',
    explain: (m) => `Aggiunge un valore a "${m[1]}" (operatore +=)`,
  },
  {
    regex: /^\s*(\w+)\s*-=/,
    priority: 4,
    category: 'assegnazione',
    explain: (m) => `Sottrae un valore da "${m[1]}" (operatore -=)`,
  },
  {
    regex: /^\s*(\w+)\s*\*\*/,
    priority: 4,
    category: 'assegnazione',
    explain: (m) => `Eleva "${m[1]}" a potenza (operatore **=)`,
  },
  {
    regex: /^\s*(\w+)\+\+/,
    priority: 5,
    category: 'assegnazione',
    explain: (m) => `Incrementa "${m[1]}" di 1 (operatore ++)`,
  },
  {
    regex: /^\s*(\w+)--/,
    priority: 5,
    category: 'assegnazione',
    explain: (m) => `Decrementa "${m[1]}" di 1 (operatore --)`,
  },

  // ═══════════════ CONSOLE ═══════════════
  {
    regex: /^\s*console\.log\s*\(\s*(.+?)\s*\)\s*;?\s*$/,
    priority: 6,
    category: 'output',
    explain: (m) => `Stampa nella console del browser ${descriviValore(m[1])}`,
  },
  {
    regex: /^\s*console\.error\s*\(\s*(.+?)\s*\)\s*;?\s*$/,
    priority: 6,
    category: 'output',
    explain: (m) => `Stampa un messaggio di errore nella console: ${m[1]}`,
  },
  {
    regex: /^\s*console\.warn\s*\(\s*(.+?)\s*\)\s*;?\s*$/,
    priority: 6,
    category: 'output',
    explain: (m) => `Stampa un avviso (warning) nella console: ${m[1]}`,
  },
  {
    regex: /^\s*console\.table\s*\(\s*(.+?)\s*\)\s*;?\s*$/,
    priority: 6,
    category: 'output',
    explain: (m) => `Mostra ${m[1]} in formato tabella nella console (utile per array e oggetti)`,
  },
  {
    regex: /^\s*console\.(dir|info|debug|trace|assert)\s*\(/,
    priority: 6,
    category: 'output',
    explain: (m) => `Esegue console.${m[1]}() per ispezionare o tracciare dati nella console`,
  },

  // ═══════════════ FUNZIONI (JS) ═══════════════
  {
    regex: /^\s*function\s+(\w+)\s*\(\s*(.*?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'funzione',
    explain: (m) => `Definisce la funzione "${m[1]}" che accetta i parametri: ${m[2] || 'nessuno'}. Qui inizia il corpo della funzione`,
  },
  {
    regex: /^\s*(?:const|let|var)\s+(\w+)\s*=\s*\(\s*(.*?)\s*\)\s*=>\s*\{\s*$/,
    priority: 7,
    category: 'funzione',
    explain: (m) => `Arrow function assegnata a "${m[1]}" con parametri: ${m[2] || 'nessuno'}. Le arrow function sono una sintassi compatta per definire funzioni`,
  },
  {
    regex: /^\s*(?:const|let|var)\s+(\w+)\s*=\s*\(\s*(.*?)\s*\)\s*=>\s*(.+?);?\s*$/,
    priority: 7,
    category: 'funzione',
    explain: (m) => `Arrow function compatta "${m[1]}": prende ${m[2] || 'nessun parametro'} e restituisce direttamente ${descriviValore(m[3])}`,
  },
  {
    regex: /^\s*(?:const|let|var)\s+(\w+)\s*=\s*(\w+)\s*=>\s*(.+?);?\s*$/,
    priority: 7,
    category: 'funzione',
    explain: (m) => `Arrow function "${m[1]}" con un solo parametro "${m[2]}", restituisce ${descriviValore(m[3])}`,
  },
  {
    regex: /^\s*function\s*\(\s*(.*?)\s*\)\s*\{\s*$/,
    priority: 6,
    category: 'funzione',
    explain: (m) => `Funzione anonima con parametri: ${m[1] || 'nessuno'}`,
  },
  {
    regex: /^\s*return\s+(.+?);?\s*$/,
    priority: 7,
    category: 'controllo',
    explain: (m) => `Restituisce ${descriviValore(m[1])} e termina l'esecuzione della funzione`,
  },
  {
    regex: /^\s*return\s*;?\s*$/,
    priority: 7,
    category: 'controllo',
    explain: () => 'Esce dalla funzione senza restituire alcun valore (restituisce undefined)',
  },

  // ═══════════════ CONDIZIONI ═══════════════
  {
    regex: /^\s*if\s*\(\s*(.+?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'controllo',
    explain: (m) => `Condizione if: verifica se "${m[1]}" è vero. Se la condizione è soddisfatta, esegue il blocco di codice che segue`,
  },
  {
    regex: /^\s*else\s+if\s*\(\s*(.+?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'controllo',
    explain: (m) => `Altrimenti se: se la condizione precedente era falsa, verifica ora "${m[1]}"`,
  },
  {
    regex: /^\s*else\s*\{\s*$/,
    priority: 7,
    category: 'controllo',
    explain: () => 'Altrimenti: se nessuna delle condizioni precedenti era vera, esegue questo blocco di codice',
  },
  {
    regex: /^\s*switch\s*\(\s*(.+?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'controllo',
    explain: (m) => `Istruzione switch: valuta ${m[1]} e lo confronta con i vari casi (case) definiti sotto`,
  },
  {
    regex: /^\s*case\s+(.+?)\s*:\s*$/,
    priority: 6,
    category: 'controllo',
    explain: (m) => `Caso switch: se il valore corrisponde a ${m[1]}, esegue il codice che segue fino al prossimo break`,
  },
  {
    regex: /^\s*default\s*:\s*$/,
    priority: 6,
    category: 'controllo',
    explain: () => 'Caso predefinito dello switch: eseguito se nessun case precedente corrisponde',
  },
  {
    regex: /^\s*break\s*;?\s*$/,
    priority: 6,
    category: 'controllo',
    explain: () => 'break: interrompe immediatamente il ciclo o lo switch corrente',
  },
  {
    regex: /^\s*continue\s*;?\s*$/,
    priority: 6,
    category: 'controllo',
    explain: () => 'continue: salta il resto dell\'iterazione corrente e passa alla successiva del ciclo',
  },

  // ═══════════════ CICLI ═══════════════
  {
    regex: /^\s*for\s*\(\s*(.+?)\s*;\s*(.+?)\s*;\s*(.+?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'ciclo',
    explain: (m) => `Ciclo for classico — ① inizializza: ${m[1]} ② condizione: ripete finché ${m[2]} è vero ③ aggiornamento: ${m[3]} a ogni iterazione`,
  },
  {
    regex: /^\s*while\s*\(\s*(.+?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'ciclo',
    explain: (m) => `Ciclo while: ripete il blocco di codice finché la condizione "${m[1]}" rimane vera. Se è falsa all'inizio, il blocco non viene mai eseguito`,
  },
  {
    regex: /^\s*do\s*\{\s*$/,
    priority: 6,
    category: 'ciclo',
    explain: () => 'Inizio del ciclo do-while: il blocco viene eseguito almeno una volta, poi la condizione viene verificata',
  },
  {
    regex: /^\s*\}\s*while\s*\(\s*(.+?)\s*\)\s*;?\s*$/,
    priority: 6,
    category: 'ciclo',
    explain: (m) => `Fine del ciclo do-while: se la condizione "${m[1]}" è vera, il ciclo ricomincia`,
  },
  {
    regex: /^\s*for\s*\(\s*(?:const|let|var)\s+(\w+)\s+of\s+(.+?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'ciclo',
    explain: (m) => `Ciclo for...of: itera su ogni elemento di ${m[2]}, assegnando ciascun valore alla variabile "${m[1]}"`,
  },
  {
    regex: /^\s*for\s*\(\s*(?:const|let|var)\s+(\w+)\s+in\s+(.+?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'ciclo',
    explain: (m) => `Ciclo for...in: itera su tutte le proprietà (chiavi) di ${m[2]}, assegnando ciascuna chiave a "${m[1]}"`,
  },
  {
    regex: /^\s*(.+?)\.forEach\s*\(\s*\(?(\w+)\)?\s*=>/,
    priority: 6,
    category: 'ciclo',
    explain: (m) => `Esegue la funzione di callback per ogni elemento di ${m[1]}, passando l'elemento corrente come "${m[2]}"`,
  },
  {
    regex: /^\s*(.+?)\.map\s*\(\s*\(?(\w+)\)?\s*=>/,
    priority: 6,
    category: 'array',
    explain: (m) => `Trasforma ogni elemento di ${m[1]} applicando la funzione e restituisce un nuovo array con i risultati`,
  },
  {
    regex: /^\s*(.+?)\.filter\s*\(\s*\(?(\w+)\)?\s*=>/,
    priority: 6,
    category: 'array',
    explain: (m) => `Filtra gli elementi di ${m[1]}: restituisce un nuovo array con solo gli elementi che soddisfano la condizione`,
  },
  {
    regex: /^\s*(.+?)\.reduce\s*\(/,
    priority: 6,
    category: 'array',
    explain: () => 'Riduce un array a un singolo valore, accumulando i risultati a ogni iterazione',
  },
  {
    regex: /^\s*(.+?)\.(push|pop|shift|unshift|splice|slice)\s*\(/,
    priority: 6,
    category: 'array',
    explain: (m) => {
      const metodi = { push: 'aggiunge', pop: 'rimuove l\'ultimo elemento da', shift: 'rimuove il primo elemento da', unshift: 'aggiunge all\'inizio di', splice: 'modifica (rimuove/aggiunge elementi in)', slice: 'estrae una porzione di' };
      return `${metodi[m[2]] || 'Opera su'} ${m[1]} (metodo ${m[2]})`;
    },
  },
  {
    regex: /^\s*(.+?)\.(length|includes|indexOf|find|sort|reverse|join|split)\b/,
    priority: 5,
    category: 'array',
    explain: (m) => `Usa il metodo .${m[2]}() su ${m[1]}`,
  },

  // ═══════════════ CLASSI E OGGETTI ═══════════════
  {
    regex: /^\s*class\s+(\w+)\s*(?:extends\s+(\w+))?\s*\{\s*$/,
    priority: 7,
    category: 'classe',
    explain: (m) => `Definisce la classe "${m[1]}"${m[2] ? ` che estende la classe "${m[2]}" ereditarne i metodi e le proprietà` : ''}`,
  },
  {
    regex: /^\s*constructor\s*\(\s*(.*?)\s*\)\s*\{\s*$/,
    priority: 7,
    category: 'classe',
    explain: (m) => `Costruttore della classe: inizializza un nuovo oggetto con i parametri: ${m[1] || 'nessuno'}. Chiamato automaticamente quando si usa new`,
  },
  {
    regex: /^\s*new\s+(\w+)\s*\(/,
    priority: 6,
    category: 'classe',
    explain: (m) => `Crea una nuova istanza della classe "${m[1]}" usando l'operatore new`,
  },
  {
    regex: /^\s*this\.(\w+)\s*=\s*(.+?);?\s*$/,
    priority: 6,
    category: 'classe',
    explain: (m) => `Assegna alla proprietà "${m[1]}" dell'oggetto corrente (this) ${descriviValore(m[2])}`,
  },

  // ═══════════════ MODULI (IMPORT/EXPORT) ═══════════════
  {
    regex: /^\s*import\s+\{?\s*(.+?)\s*\}?\s*from\s+['"](.+?)['"]\s*;?\s*$/,
    priority: 6,
    category: 'modulo',
    explain: (m) => `Importa ${m[1].replace(/^\{|\}$/g, '').trim()} dal modulo "${m[2]}"`,
  },
  {
    regex: /^\s*import\s+(\w+)\s+from\s+['"](.+?)['"]\s*;?\s*$/,
    priority: 6,
    category: 'modulo',
    explain: (m) => `Importa l'esportazione predefinita (default) dal modulo "${m[2]}" e la assegna a "${m[1]}"`,
  },
  {
    regex: /^\s*import\s+['"](.+?)['"]\s*;?\s*$/,
    priority: 6,
    category: 'modulo',
    explain: (m) => `Importa il modulo "${m[1]}" solo per i suoi effetti collaterali (es. per caricare un foglio di stile o eseguire codice di setup)`,
  },
  {
    regex: /^\s*export\s+default\s+(.+?);?\s*$/,
    priority: 6,
    category: 'modulo',
    explain: (m) => `Esporta ${m[1]} come valore predefinito del modulo (quando altri file lo importano senza parentesi graffe)`,
  },
  {
    regex: /^\s*export\s+(?:const|let|var|function|class)\s+(.+)$/,
    priority: 6,
    category: 'modulo',
    explain: (m) => `Dichiara ed esporta: ${m[1]} (sarà importabile con il nome esatto da altri moduli)`,
  },

  // ═══════════════ ASYNC/AWAIT ═══════════════
  {
    regex: /^\s*async\s+function\s+(\w+)/,
    priority: 7,
    category: 'asincrono',
    explain: (m) => `Definisce la funzione asincrona "${m[1]}". Una funzione async restituisce sempre una Promise e permette di usare await al suo interno`,
  },
  {
    regex: /^\s*await\s+(.+?);?\s*$/,
    priority: 7,
    category: 'asincrono',
    explain: (m) => `Attende (await) il completamento di ${m[1]} prima di proseguire. Usabile solo dentro una funzione async`,
  },
  {
    regex: /^\s*new\s+Promise\s*\(\s*\(?\s*(\w+)\s*,?\s*(\w*)\s*\)?\s*=>/,
    priority: 7,
    category: 'asincrono',
    explain: (m) => `Crea una nuova Promise. "${m[1]}" si chiama resolve (da invocare in caso di successo)${m[2] ? ` e "${m[2]}" è reject (da invocare in caso di errore)` : ''}`,
  },
  {
    regex: /^\s*(.+?)\.then\s*\(\s*(.+?)\)/,
    priority: 6,
    category: 'asincrono',
    explain: (m) => `Quando la Promise ${m[1]} si risolve con successo, esegue la funzione ${m[2]} con il valore ottenuto`,
  },
  {
    regex: /^\s*(.+?)\.catch\s*\(\s*(.+?)\)/,
    priority: 6,
    category: 'asincrono',
    explain: (m) => `Se la Promise ${m[1]} viene rifiutata (errore), esegue ${m[2]} per gestire l'errore`,
  },
  {
    regex: /^\s*(.+?)\.finally\s*\(\s*\(\s*\)\s*=>/,
    priority: 6,
    category: 'asincrono',
    explain: (m) => `Dopo che la Promise ${m[1]} si è risolta (successo o errore), esegue questo blocco di pulizia`,
  },

  // ═══════════════ DOM ═══════════════
  {
    regex: /^\s*document\.getElementById\s*\(\s*['"](.+?)['"]\s*\)/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Seleziona l'elemento HTML che ha id="${m[1]}"`,
  },
  {
    regex: /^\s*document\.querySelector\s*\(\s*['"`](.+?)['"`]\s*\)/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Seleziona il primo elemento HTML che corrisponde al selettore CSS "${m[1]}"`,
  },
  {
    regex: /^\s*document\.querySelectorAll\s*\(\s*['"`](.+?)['"`]\s*\)/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Seleziona tutti gli elementi HTML che corrispondono al selettore CSS "${m[1]}" e restituisce una NodeList`,
  },
  {
    regex: /^\s*document\.createElement\s*\(\s*['"](.+?)['"]\s*\)/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Crea un nuovo elemento HTML <${m[1]}> (non ancora inserito nella pagina)`,
  },
  {
    regex: /^\s*(.+?)\.addEventListener\s*\(\s*['"](.+?)['"]\s*,\s*(.+?)\)/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Aggiunge un ascoltatore di eventi: quando su ${m[1]} si verifica l'evento "${m[2]}", esegue la funzione ${m[3]}`,
  },
  {
    regex: /^\s*(.+?)\.removeEventListener\s*\(\s*['"](.+?)['"]/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Rimuove l'ascoltatore per l'evento "${m[2]}" da ${m[1]}`,
  },
  {
    regex: /^\s*(.+?)\.textContent\s*=\s*(.+?);?\s*$/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Imposta il contenuto testuale di ${m[1]} a ${descriviValore(m[2])} (in modo sicuro, senza interpretare HTML)`,
  },
  {
    regex: /^\s*(.+?)\.innerHTML\s*=\s*(.+?);?\s*$/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Imposta il contenuto HTML di ${m[1]} a ${descriviValore(m[2])}. Attenzione: innerHTML interpreta il contenuto come HTML`,
  },
  {
    regex: /^\s*(.+?)\.classList\.(add|remove|toggle|contains)\s*\(\s*['"](.+?)['"]\s*\)/,
    priority: 6,
    category: 'dom',
    explain: (m) => {
      const azioni = { add: 'Aggiunge', remove: 'Rimuove', toggle: 'Attiva/disattiva', contains: 'Verifica se è presente' };
      return `${azioni[m[2]]} la classe CSS "${m[3]}" su ${m[1]}`;
    },
  },
  {
    regex: /^\s*(.+?)\.style\.(\w+)\s*=\s*['"](.+?)['"]/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Imposta la proprietà CSS "${m[2]}" di ${m[1]} al valore "${m[3]}"`,
  },
  {
    regex: /^\s*(.+?)\.(appendChild|removeChild|insertBefore|replaceChild)\s*\(\s*(.+?)\)\s*;?\s*$/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Manipola il DOM: ${m[2]} su ${m[1]} con argomento ${m[3]}`,
  },
  {
    regex: /^\s*(.+?)\.setAttribute\s*\(\s*['"](.+?)['"]\s*,\s*(.+?)\)/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Imposta l'attributo HTML "${m[2]}" su ${m[1]} al valore ${m[3]}`,
  },
  {
    regex: /^\s*(.+?)\.value\s*=\s*(.+?);?\s*$/,
    priority: 6,
    category: 'dom',
    explain: (m) => `Imposta il valore del campo ${m[1]} a ${descriviValore(m[2])}`,
  },

  // ═══════════════ PYTHON ═══════════════
  {
    regex: /^\s*def\s+(\w+)\s*\(\s*(.*?)\s*\)\s*:\s*$/,
    priority: 7,
    category: 'funzione',
    explain: (m) => `[Python] Definisce la funzione "${m[1]}" con parametri: ${m[2] || 'nessuno'}. I due punti (:) indicano l'inizio del blocco indentato`,
  },
  {
    regex: /^\s*print\s*\(\s*(.*?)\s*\)\s*$/,
    priority: 6,
    category: 'output',
    explain: (m) => `[Python] Stampa a schermo: ${m[1]}`,
  },
  {
    regex: /^\s*import\s+(\w[\w.]*)\s*$/,
    priority: 6,
    category: 'modulo',
    explain: (m) => `[Python] Importa il modulo "${m[1]}" per poter usare le sue funzioni e classi`,
  },
  {
    regex: /^\s*from\s+(.+?)\s+import\s+(.+?)\s*$/,
    priority: 6,
    category: 'modulo',
    explain: (m) => `[Python] Dal modulo ${m[1]} importa specificamente: ${m[2]}`,
  },
  {
    regex: /^\s*if\s+(.+?)\s*:\s*$/,
    priority: 7,
    category: 'controllo',
    explain: (m) => `[Python] Verifica la condizione "${m[1]}"; se vera esegue il blocco indentato che segue`,
  },
  {
    regex: /^\s*elif\s+(.+?)\s*:\s*$/,
    priority: 7,
    category: 'controllo',
    explain: (m) => `[Python] Altrimenti, verifica questa nuova condizione: "${m[1]}"`,
  },
  {
    regex: /^\s*else\s*:\s*$/,
    priority: 7,
    category: 'controllo',
    explain: () => '[Python] Altrimenti: se nessuna condizione precedente è vera, esegue questo blocco',
  },
  {
    regex: /^\s*for\s+(\w+)\s+in\s+(.+?)\s*:\s*$/,
    priority: 7,
    category: 'ciclo',
    explain: (m) => `[Python] Ciclo for: itera su ${m[2]}, assegnando ogni elemento alla variabile "${m[1]}"`,
  },
  {
    regex: /^\s*for\s+(\w+)\s*,\s*(\w+)\s+in\s+(.+?)\s*:\s*$/,
    priority: 7,
    category: 'ciclo',
    explain: (m) => `[Python] Ciclo for: itera su ${m[3]} estraendo indice come "${m[1]}" e valore come "${m[2]}" (enumera)`,
  },
  {
    regex: /^\s*while\s+(.+?)\s*:\s*$/,
    priority: 7,
    category: 'ciclo',
    explain: (m) => `[Python] Ciclo while: ripete il blocco finché la condizione "${m[1]}" è vera`,
  },
  {
    regex: /^\s*class\s+(\w+)(?:\(\s*(\w+)\s*\))?\s*:\s*$/,
    priority: 7,
    category: 'classe',
    explain: (m) => `[Python] Definisce la classe "${m[1]}"${m[2] ? ` che eredita da "${m[2]}"` : ''}`,
  },
  {
    regex: /^\s*def\s+__init__\s*\(\s*self\s*,?\s*(.*?)\s*\)\s*:\s*$/,
    priority: 7,
    category: 'classe',
    explain: (m) => `[Python] Costruttore della classe (__init__): inizializza l'istanza con i parametri: ${m[1] || 'solo self'}`,
  },
  {
    regex: /^\s*try\s*:\s*$/,
    priority: 7,
    category: 'errore',
    explain: () => '[Python] Blocco try: prova a eseguire il codice che segue; se si verifica un\'eccezione, passa al blocco except',
  },
  {
    regex: /^\s*except\s*(.+?)?\s*:\s*$/,
    priority: 7,
    category: 'errore',
    explain: (m) => `[Python] Cattura le eccezioni${m[1] ? ' di tipo ' + m[1] : ' (qualsiasi tipo)'} e esegue il blocco di gestione errore`,
  },
  {
    regex: /^\s*finally\s*:\s*$/,
    priority: 7,
    category: 'errore',
    explain: () => '[Python] Blocco finally: eseguito sempre, sia in caso di successo che di errore (utile per pulizia)',
  },
  {
    regex: /^\s*with\s+(.+?)\s+as\s+(\w+)\s*:\s*$/,
    priority: 7,
    category: 'risorsa',
    explain: (m) => `[Python] Apre un contesto gestito (with): ${m[1]} viene assegnato a "${m[2]}" e chiuso automaticamente alla fine del blocco`,
  },
  {
    regex: /^\s*raise\s+(.+?)\s*$/,
    priority: 6,
    category: 'errore',
    explain: (m) => `[Python] Solleva (genera) un'eccezione: ${m[1]}`,
  },
  {
    regex: /^\s*lambda\s+(.+?)\s*:\s*(.+?)\s*$/,
    priority: 6,
    category: 'funzione',
    explain: (m) => `[Python] Funzione lambda (anonima): prende ${m[1]} e restituisce ${m[2]}`,
  },
  {
    regex: /^\s*return\s+(.+?)\s*$/,
    priority: 7,
    category: 'controllo',
    explain: (m) => `[Python] Restituisce ${descriviValore(m[1])} dalla funzione`,
  },

  // ═══════════════ HTML ═══════════════
  {
    regex: /^\s*<!DOCTYPE\s+html>/i,
    priority: 5,
    category: 'html',
    explain: () => 'Dichiarazione DOCTYPE: indica al browser che il documento è HTML5',
  },
  {
    regex: /^\s*<(\w+)([^>]*?)\/>\s*$/,
    priority: 5,
    category: 'html',
    explain: (m) => `Tag HTML auto-chiudente <${m[1]} />: ${descriviTagHtml(m[1])}`,
  },
  {
    regex: /^\s*<(\w+)([^>]*?)>\s*$/,
    priority: 5,
    category: 'html',
    explain: (m) => `Tag HTML di apertura <${m[1]}>: ${descriviTagHtml(m[1])}`,
  },
  {
    regex: /^\s*<\/(\w+)>\s*$/,
    priority: 5,
    category: 'html',
    explain: (m) => `Tag HTML di chiusura </${m[1]}>: termina ${descriviTagHtml(m[1])}`,
  },

  // ═══════════════ PARENTESI E BLOCCHI ═══════════════
  {
    regex: /^\s*\}\s*;?\s*$/,
    priority: 3,
    category: 'struttura',
    explain: () => 'Chiude il blocco di codice corrente (funzione, ciclo, condizione, classe o oggetto)',
  },
  {
    regex: /^\s*\{\s*$/,
    priority: 3,
    category: 'struttura',
    explain: () => 'Apre un blocco di codice (potrebbe essere il corpo di una funzione, un ciclo, o un oggetto)',
  },

  // ═══════════════ TIPI PARTICOLARI ═══════════════
  {
    regex: /^\s*\/\/\s*TODO:?\s*(.*)/i,
    priority: 9,
    category: 'commento',
    explain: (m) => `📌 TODO (cosa da fare): ${m[1].trim()}`,
  },
  {
    regex: /^\s*\/\/\s*FIXME:?\s*(.*)/i,
    priority: 9,
    category: 'commento',
    explain: (m) => `⚠️ FIXME (da sistemare): ${m[1].trim()}`,
  },
  {
    regex: /^\s*\/\/\s*NOTE:?\s*(.*)/i,
    priority: 9,
    category: 'commento',
    explain: (m) => `📝 Nota dello sviluppatore: ${m[1].trim()}`,
  },
  {
    regex: /^\s*\/\/\s*HACK:?\s*(.*)/i,
    priority: 9,
    category: 'commento',
    explain: (m) => `🔧 HACK (soluzione temporanea): ${m[1].trim()}`,
  },
  {
    regex: /^\s*['"]use strict['"]\s*;?\s*$/,
    priority: 8,
    category: 'direttiva',
    explain: () => 'Attiva la modalità "strict" di JavaScript: rende il codice più sicuro, impedendo alcune operazioni potenzialmente pericolose',
  },

  // ═══════════════ RIGA VUOTA ═══════════════
  {
    regex: /^\s*$/,
    priority: 1,
    category: 'vuoto',
    explain: () => 'Riga vuota: usata per separare blocchi di codice e migliorare la leggibilità',
  },
];

/**
 * Ordina i pattern per priorità decrescente.
 */
patterns.sort((a, b) => b.priority - a.priority);

export { patterns, descriviValore, descriviTagHtml };
