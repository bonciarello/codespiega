import { describe, it, expect } from 'vitest';
import { explainCode, getLanguageName } from '../src/engine/explainer.js';

describe('explainCode', () => {
  it('restituisce array vuoto per input vuoto', () => {
    expect(explainCode('')).toEqual([]);
    expect(explainCode('   ')).toEqual([]);
    expect(explainCode(null)).toEqual([]);
  });

  it('spiega una dichiarazione let con assegnazione numerica', () => {
    const result = explainCode('let x = 5;');
    expect(result).toHaveLength(1);
    expect(result[0].lineNumber).toBe(1);
    expect(result[0].code).toBe('let x = 5;');
    expect(result[0].explanation).toContain('x');
    expect(result[0].explanation).toContain('5');
    expect(result[0].category).toBe('dichiarazione');
  });

  it('spiega console.log', () => {
    const result = explainCode('console.log(x);');
    expect(result).toHaveLength(1);
    expect(result[0].explanation).toContain('console');
    expect(result[0].explanation).toContain('x');
    expect(result[0].category).toBe('output');
  });

  it('spiega un semplice programma di due righe', () => {
    const code = `let x = 5;
console.log(x);`;
    const result = explainCode(code);
    expect(result).toHaveLength(2);
    expect(result[0].explanation).toContain('x');
    expect(result[0].explanation).toContain('5');
    expect(result[1].explanation).toContain('console');
    expect(result[1].explanation).toContain('x');
  });

  it('spiega una funzione JavaScript', () => {
    const code = `function somma(a, b) {
  return a + b;
}`;
    const result = explainCode(code);
    expect(result).toHaveLength(3);
    expect(result[0].explanation).toContain('somma');
    expect(result[0].explanation).toContain('a');
    expect(result[0].explanation).toContain('b');
    expect(result[1].explanation).toContain('Restituisce');
    expect(result[2].category).toBe('struttura');
  });

  it('spiega un costrutto if/else JavaScript', () => {
    const code = `let eta = 18;
if (eta >= 18) {
  console.log("Maggiorenne");
} else {
  console.log("Minorenne");
}`;
    const result = explainCode(code);
    expect(result.length).toBeGreaterThanOrEqual(5);
    const ifLine = result.find(r => r.code.includes('if'));
    expect(ifLine).toBeDefined();
    expect(ifLine.explanation).toContain('eta');
    expect(ifLine.category).toBe('controllo');
  });

  it('spiega un ciclo for', () => {
    const code = `for (let i = 0; i < 10; i++) {
  console.log(i);
}`;
    const result = explainCode(code);
    expect(result.length).toBeGreaterThanOrEqual(2);
    const forLine = result.find(r => r.code.includes('for'));
    expect(forLine).toBeDefined();
    expect(forLine.category).toBe('ciclo');
  });

  it('spiega codice Python base', () => {
    const code = `def saluta(nome):
    print("Ciao " + nome)`;
    const result = explainCode(code);
    expect(result).toHaveLength(2);
    expect(result[0].explanation).toContain('Python');
    expect(result[0].explanation).toContain('saluta');
    expect(result[1].explanation).toContain('Python');
    expect(result[1].explanation).toContain('Stampa');
  });

  it('spiega un commento JavaScript', () => {
    const result = explainCode('// Questo è un commento');
    expect(result).toHaveLength(1);
    expect(result[0].explanation).toContain('Commento');
    expect(result[0].explanation).toContain('Questo è un commento');
    expect(result[0].category).toBe('commento');
  });

  it('spiega un commento Python', () => {
    const result = explainCode('# Questo è un commento Python');
    expect(result).toHaveLength(1);
    expect(result[0].explanation).toContain('Commento');
    expect(result[0].category).toBe('commento');
  });

  it('gestisce righe vuote', () => {
    const code = `let x = 1;

let y = 2;`;
    const result = explainCode(code);
    expect(result).toHaveLength(3);
    expect(result[1].category).toBe('vuoto');
  });

  it('spiega codice con array e metodi', () => {
    const code = `const numeri = [1, 2, 3, 4, 5];
numeri.forEach(n => console.log(n));`;
    const result = explainCode(code);
    expect(result).toHaveLength(2);
    expect(result[0].explanation).toContain('numeri');
  });

  it('spiega una classe JavaScript', () => {
    const code = `class Persona {
  constructor(nome) {
    this.nome = nome;
  }
}`;
    const result = explainCode(code);
    expect(result.length).toBeGreaterThanOrEqual(3);
    const classLine = result.find(r => r.code.includes('class'));
    expect(classLine).toBeDefined();
    expect(classLine.category).toBe('classe');
  });

  it('spiega una costante', () => {
    const result = explainCode('const PI = 3.14;');
    expect(result).toHaveLength(1);
    expect(result[0].explanation).toContain('costante');
    expect(result[0].explanation).toContain('PI');
    expect(result[0].explanation).toContain('riassegnata');
  });

  it('spiega codice con arrow function compatta', () => {
    const result = explainCode('const doppio = x => x * 2;');
    expect(result).toHaveLength(1);
    expect(result[0].explanation).toContain('doppio');
    expect(result[0].explanation).toContain('Arrow');
  });

  it('spiega import e export', () => {
    const code = `import React from 'react';
export default App;`;
    const result = explainCode(code);
    expect(result).toHaveLength(2);
    expect(result[0].category).toBe('modulo');
    expect(result[1].category).toBe('modulo');
  });

  it('spiega codice con try-catch Python', () => {
    const code = `try:
    x = 1 / 0
except ZeroDivisionError:
    print("Errore!")`;
    const result = explainCode(code);
    expect(result.length).toBeGreaterThanOrEqual(3);
    const tryLine = result.find(r => r.code.includes('try'));
    expect(tryLine).toBeDefined();
  });

  it('spiega querySelector DOM', () => {
    const result = explainCode('document.querySelector(".mia-classe");');
    expect(result).toHaveLength(1);
    expect(result[0].explanation).toContain('selettore');
    expect(result[0].category).toBe('dom');
  });

  it('spiega HTML base', () => {
    const code = '<div class="container">\n  <p>Ciao</p>\n</div>';
    const result = explainCode(code);
    expect(result).toHaveLength(3);
    expect(result[0].explanation).toContain('div');
    expect(result[1].explanation).toContain('p');
    expect(result[2].explanation).toContain('div');
  });
});

describe('getLanguageName', () => {
  it('riconosce JavaScript', () => {
    const name = getLanguageName('let x = 5;\nconsole.log(x);');
    expect(name).toContain('JavaScript');
  });

  it('riconosce Python', () => {
    const name = getLanguageName('def foo():\n    print("ciao")');
    expect(name).toBe('Python');
  });

  it('riconosce HTML', () => {
    const name = getLanguageName('<!DOCTYPE html>\n<html>\n<body></body>\n</html>');
    expect(name).toBe('HTML');
  });

  it('restituisce Generico per codice sconosciuto', () => {
    const name = getLanguageName('foo bar baz');
    expect(name).toBe('Generico');
  });
});
