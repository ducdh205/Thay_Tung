export type Lang = 'html' | 'css' | 'php' | 'shell' | 'text';
export type TokenKind =
  | 'tag' | 'attr' | 'string' | 'keyword' | 'variable' | 'comment' | 'punct' | 'prop' | 'value' | 'plain';
export interface Token { text: string; kind: TokenKind }

type Rule = [RegExp, TokenKind];

const STR: Rule = [/"[^"\n]*"|'[^'\n]*'/y, 'string'];

const RULES: Record<Lang, Rule[]> = {
  html: [
    [/<!--[\s\S]*?-->/y, 'comment'],
    [/<\/?[a-zA-Z!][\w-]*/y, 'tag'],
    [/\/?>/y, 'tag'],
    STR,
    [/[a-zA-Z-]+(?==)/y, 'attr'],
    [/=/y, 'punct'],
  ],
  css: [
    [/\/\*[\s\S]*?\*\//y, 'comment'],
    [/[a-z-]+(?=\s*:)/y, 'prop'],
    [/#[0-9a-fA-F]{3,8}\b|\d+(?:\.\d+)?(?:px|rem|em|%|s|deg|fr)?/y, 'value'],
    STR,
    [/[.#]?[a-zA-Z][\w-]*/y, 'tag'],
    [/[{}:;,()]/y, 'punct'],
  ],
  php: [
    [/<\?php|\?>/y, 'tag'],
    [/\/\/[^\n]*/y, 'comment'],
    [/\$\w+/y, 'variable'],
    STR,
    [/\b(?:echo|foreach|as|if|else|function|return|for|while|array|new|include|require)\b/y, 'keyword'],
    [/\w+(?=\()/y, 'prop'],
    [/[{}();,=.[\]>]/y, 'punct'],
  ],
  shell: [
    [/\$(?= )/y, 'keyword'],
    [/✓[^\n]*/y, 'string'],
    [/\b(?:git|npm|cd|deploy|php|composer|docker)\b/y, 'tag'],
    [/--?[\w=-]+/y, 'attr'],
    STR,
  ],
  text: [],
};

/** Regex scanner. Concatenating every token's text reproduces `code` exactly. */
export function tokenize(code: string, lang: Lang): Token[] {
  const rules = RULES[lang];
  const out: Token[] = [];
  const push = (text: string, kind: TokenKind) => {
    const last = out[out.length - 1];
    if (kind === 'plain' && last?.kind === 'plain') last.text += text;
    else out.push({ text, kind });
  };
  let i = 0;
  while (i < code.length) {
    let hit = false;
    for (const [re, kind] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length > 0) {
        push(m[0], kind);
        i += m[0].length;
        hit = true;
        break;
      }
    }
    if (!hit) push(code[i++], 'plain');
  }
  return out;
}

/** First `n` characters of the token stream, cutting through a token when needed. */
export function sliceTokens(tokens: Token[], n: number): Token[] {
  const out: Token[] = [];
  let left = n;
  for (const t of tokens) {
    if (left <= 0) break;
    out.push(t.text.length <= left ? t : { text: t.text.slice(0, left), kind: t.kind });
    left -= t.text.length;
  }
  return out;
}
