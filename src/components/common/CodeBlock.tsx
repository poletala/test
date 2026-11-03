import { useMemo, useState, type ReactNode } from 'react';
import type { CodeLanguage } from '../../types';

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  html: 'HTML',
  css: 'CSS',
  bash: 'Terminal',
  json: 'JSON',
  text: 'Текст',
};

type TokenKind = 'plain' | 'comment' | 'string' | 'keyword' | 'literal' | 'number' | 'function' | 'tag' | 'attr' | 'selector';

interface Token {
  text: string;
  kind: TokenKind;
}

const JS_KEYWORDS =
  'const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|super|new|delete|typeof|instanceof|in|of|try|catch|finally|throw|async|await|yield|import|export|from|default|static|get|set|interface|type|enum|implements|namespace|declare|readonly|public|private|protected|abstract|as|satisfies|keyof|infer|is|asserts';
const JS_LITERALS = 'true|false|null|undefined|NaN|Infinity|this|void';

function tokenizeJs(code: string): Token[] {
  const pattern = new RegExp(
    `(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|(\`(?:\\\\[\\s\\S]|[^\`\\\\])*\`|"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')|\\b(${JS_KEYWORDS})\\b|\\b(${JS_LITERALS})\\b|\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b|([A-Za-z_$][\\w$]*)(?=\\s*\\()`,
    'g',
  );
  const tokens: Token[] = [];
  let lastIndex = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ text: code.slice(lastIndex, index), kind: 'plain' });
    const kind: TokenKind = match[1]
      ? 'comment'
      : match[2]
        ? 'string'
        : match[3]
          ? 'keyword'
          : match[4]
            ? 'literal'
            : match[5]
              ? 'number'
              : 'function';
    tokens.push({ text: match[0], kind });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < code.length) tokens.push({ text: code.slice(lastIndex), kind: 'plain' });
  return tokens;
}

function tokenizeCss(code: string): Token[] {
  const pattern =
    /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[\w-]+)|(#[0-9a-fA-F]{3,8})|(\b\d*\.?\d+(?:px|rem|em|%|vh|vw|s|ms|fr|deg)?\b)|([\w-]+)(?=\s*:)|([.#][\w-]+)/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ text: code.slice(lastIndex, index), kind: 'plain' });
    const kind: TokenKind = match[1]
      ? 'comment'
      : match[2]
        ? 'string'
        : match[3] || match[4]
          ? 'keyword'
          : match[5]
            ? 'number'
            : match[6]
              ? 'attr'
              : 'selector';
    tokens.push({ text: match[0], kind });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < code.length) tokens.push({ text: code.slice(lastIndex), kind: 'plain' });
  return tokens;
}

function tokenizeHtml(code: string): Token[] {
  const pattern =
    /(<!--[\s\S]*?-->)|(<\/?)([A-Za-z][\w:-]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([A-Za-z-]+)(?==)|(&[a-z]+;)/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ text: code.slice(lastIndex, index), kind: 'plain' });
    if (match[1]) {
      tokens.push({ text: match[1], kind: 'comment' });
    } else if (match[2]) {
      tokens.push({ text: match[2], kind: 'plain' });
      tokens.push({ text: match[3] ?? '', kind: 'tag' });
    } else if (match[4]) {
      tokens.push({ text: match[4], kind: 'string' });
    } else if (match[5]) {
      tokens.push({ text: match[5], kind: 'attr' });
    } else {
      tokens.push({ text: match[0], kind: 'literal' });
    }
    lastIndex = index + match[0].length;
  }
  if (lastIndex < code.length) tokens.push({ text: code.slice(lastIndex), kind: 'plain' });
  return tokens;
}

function getTokens(code: string, language: CodeLanguage): Token[] {
  if (language === 'css') return tokenizeCss(code);
  if (language === 'html') return tokenizeHtml(code);
  if (language === 'bash' || language === 'json' || language === 'text') {
    return [{ text: code, kind: 'plain' }];
  }
  return tokenizeJs(code);
}

function renderTokens(tokens: Token[]): ReactNode[] {
  return tokens.map((token, index) =>
    token.kind === 'plain' ? (
      <span key={index}>{token.text}</span>
    ) : (
      <span key={index} className={`code-token code-token--${token.kind}`}>
        {token.text}
      </span>
    ),
  );
}

interface CodeBlockProps {
  code: string;
  language?: CodeLanguage;
  title?: string;
  compact?: boolean;
}

export function CodeBlock({ code, language = 'javascript', title, compact = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => getTokens(code, language), [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`code-block ${compact ? 'code-block--compact' : ''}`}>
      <div className="code-block__bar">
        <span className="code-block__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="code-block__title">{title ?? LANGUAGE_LABELS[language]}</span>
        <button type="button" className="code-block__copy" onClick={handleCopy}>
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
      <pre className="code-block__pre">
        <code>{renderTokens(tokens)}</code>
      </pre>
    </div>
  );
}
