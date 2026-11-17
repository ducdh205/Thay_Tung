import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Preview } from '../../src/ui/Preview';
import { initialState, type PreviewStage } from '../../src/engine/store';
import { content } from '../../src/content';

afterEach(cleanup);

const prev = (stage: PreviewStage, extra: Partial<ReturnType<typeof initialState>['preview']> = {}) => ({
  ...initialState().preview, visible: true, stage, ...extra,
});

describe('Preview', () => {
  it('blank stage has no greeting', () => {
    const { container } = render(<Preview state={prev('blank')} />);
    expect(container.textContent).not.toContain('Xin chào');
  });
  it('html stage shows the greeting', () => {
    const { container } = render(<Preview state={prev('html')} />);
    expect(container.textContent).toContain('Xin chào');
  });
  it('php stage shows exactly phpRows rows', () => {
    const { container } = render(<Preview state={prev('php', { phpRows: 2 })} />);
    expect(container.querySelectorAll('[data-php-row]').length).toBe(2);
  });
  it('shows deploy badge when deployed', () => {
    const { container } = render(<Preview state={prev('php', { phpRows: 3, deployed: true })} />);
    expect(container.textContent).toContain('✓ Deploy thành công');
  });
  it('card stage shows the signature', () => {
    const { container } = render(<Preview state={prev('card')} />);
    expect(container.textContent).toContain(content.card.signature);
  });
});
