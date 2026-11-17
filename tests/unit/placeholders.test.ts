import { describe, it, expect } from 'vitest';
import { findPlaceholders } from '../../src/engine/placeholders';

describe('findPlaceholders', () => {
  it('reports the path of every [bracketed] placeholder string', () => {
    const c = { card: { signature: 'Em – [Tên của bạn]', body: ['ok', 'xin [điền] vào'] }, title: 'Cảm ơn thầy' };
    expect(findPlaceholders(c)).toEqual(['card.signature', 'card.body.1']);
  });
  it('ignores code arrays like PHP array syntax', () => {
    expect(findPlaceholders({ code: { php: "$a = ['x' => 1];" } }, ['code'])).toEqual([]);
  });
  it('is empty when everything is filled in', () => {
    expect(findPlaceholders({ card: { signature: 'Em – Minh' } })).toEqual([]);
  });
});
