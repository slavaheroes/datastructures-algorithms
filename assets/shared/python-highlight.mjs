import {escape} from './dom.mjs';

const KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
]);
const BUILTINS = new Set([
  'abs', 'all', 'any', 'bool', 'dict', 'enumerate', 'float', 'int', 'len',
  'list', 'max', 'min', 'print', 'range', 'reversed', 'set', 'sorted',
  'str', 'sum', 'tuple', 'zip', 'Exception', 'IndexError', 'KeyError',
  'TypeError', 'ValueError'
]);
const STRING_PREFIXES = new Set(['r', 'u', 'b', 'f', 'br', 'rb', 'fr', 'rf']);
const NUMBER = /^(?:0[bB][01](?:_?[01])*|0[oO][0-7](?:_?[0-7])*|0[xX][\da-fA-F](?:_?[\da-fA-F])*|(?:\d(?:_?\d)*(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?)[jJ]?/;
const token = (kind, text) => `<span class="algorithm-token ${kind}">${escape(text)}</span>`;
const isQuote = character => character === '"' || character === "'";

function stringEnd(line, start) {
  const quote = line[start];
  let cursor = start + 1;
  while (cursor < line.length) {
    if (line[cursor] === '\\') { cursor += 2; continue; }
    if (line[cursor++] === quote) break;
  }
  return Math.min(cursor, line.length);
}

// A lightweight, line-local highlighter for the displayed Python examples.
// It preserves source text, including indentation. It does not parse Python,
// track multiline/triple-quoted strings, or color expressions inside f-strings.
export function highlightPython(sourceLine) {
  const line = String(sourceLine);
  let html = '', cursor = 0, definitionName = false;
  while (cursor < line.length) {
    const character = line[cursor];
    if (character === '#') {
      html += token('comment', line.slice(cursor));
      break;
    }
    if (isQuote(character)) {
      const end = stringEnd(line, cursor);
      html += token('string', line.slice(cursor, end));
      cursor = end;
      definitionName = false;
      continue;
    }
    if (/[A-Za-z_]/.test(character)) {
      const start = cursor++;
      while (cursor < line.length && /[A-Za-z0-9_]/.test(line[cursor])) cursor++;
      const word = line.slice(start, cursor);
      if (STRING_PREFIXES.has(word.toLowerCase()) && isQuote(line[cursor])) {
        const end = stringEnd(line, cursor);
        html += token('string', line.slice(start, end));
        cursor = end;
        definitionName = false;
        continue;
      }
      if (KEYWORDS.has(word)) {
        html += token('keyword', word);
        definitionName = word === 'def';
      } else {
        let next = cursor;
        while (next < line.length && /[ \t]/.test(line[next])) next++;
        const functionName = definitionName || line[next] === '(' || BUILTINS.has(word);
        html += functionName ? token('function', word) : escape(word);
        definitionName = false;
      }
      continue;
    }
    if (/\d/.test(character) || character === '.' && /\d/.test(line[cursor + 1] || '')) {
      const number = line.slice(cursor).match(NUMBER)?.[0];
      if (number) {
        html += token('number', number);
        cursor += number.length;
        definitionName = false;
        continue;
      }
    }
    html += escape(character);
    if (!/[ \t]/.test(character)) definitionName = false;
    cursor++;
  }
  return html;
}
