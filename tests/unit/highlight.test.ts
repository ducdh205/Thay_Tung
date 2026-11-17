import { describe, it, expect } from 'vitest';
import { tokenize, sliceTokens } from '../../src/engine/highlight';

const join = (t: { text: string }[]) => t.map((x) => x.text).join('');

describe('tokenize', () => {
  const t = tokenize('<h1 class="x">Hi</h1>', 'html');
  it('round-trips html', () => expect(join(t)).toBe('<h1 class="x">Hi</h1>'));
  it('marks html attributes', () => expect(t.find((x) => x.text === 'class')?.kind).toBe('attr'));
  it('marks html strings', () => expect(t.find((x) => x.text === '"x"')?.kind).toBe('string'));
  it('marks html comments', () => expect(tokenize('<!-- a -->', 'html')[0].kind).toBe('comment'));
  it('marks css properties', () => expect(tokenize('color: #fff;', 'css').find((x) => x.text === 'color')?.kind).toBe('prop'));
  it('marks php variables', () => expect(tokenize('<?php echo $name; ?>', 'php').find((x) => x.text === '$name')?.kind).toBe('variable'));
  it('marks php keywords', () => expect(tokenize('<?php echo $name; ?>', 'php').find((x) => x.text === 'echo')?.kind).toBe('keyword'));
  it('round-trips multiline css/php/shell', () => {
    for (const [code, lang] of [
      ['body {\n  color: #fff;\n}', 'css'],
      ['<?php\nforeach ($a as $b) {\n  echo "<li>$b</li>";\n}\n?>', 'php'],
      ['$ git clone repo\n✓ done', 'shell'],
      ['Mình nên học gì?', 'text'],
    ] as const) expect(join(tokenize(code, lang))).toBe(code);
  });
});

describe('sliceTokens', () => {
  const t = tokenize('<h1 class="x">Hi</h1>', 'html');
  it('cuts mid-token', () => expect(join(sliceTokens(tokenize('<p>ab</p>', 'html'), 4))).toBe('<p>a'));
  it('returns empty for 0', () => expect(sliceTokens(t, 0)).toEqual([]));
  it('returns all when n exceeds length', () => expect(join(sliceTokens(t, 999))).toBe('<h1 class="x">Hi</h1>'));
});
