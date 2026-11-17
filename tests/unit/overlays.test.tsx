import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { GitGraph } from '../../src/ui/GitGraph';
import { ContribGrid } from '../../src/ui/ContribGrid';
import { content } from '../../src/content';

afterEach(cleanup);

describe('ContribGrid', () => {
  it('lights round(progress × 371) cells', () => {
    const { container } = render(<ContribGrid progress={0.5} />);
    expect(container.querySelectorAll('[data-on="true"]').length).toBe(Math.round(0.5 * 371));
    expect(container.querySelectorAll('[data-cell]').length).toBe(371);
  });
  it('lights nothing at 0', () => {
    const { container } = render(<ContribGrid progress={0} />);
    expect(container.querySelectorAll('[data-on="true"]').length).toBe(0);
  });
});

describe('GitGraph', () => {
  it('shows every branch label at progress 1', () => {
    const { container } = render(<GitGraph progress={1} />);
    expect(container.querySelectorAll('[data-branch-label]').length).toBe(content.branches.length);
  });
  it('shows no branch labels at progress 0', () => {
    const { container } = render(<GitGraph progress={0} />);
    expect(container.querySelectorAll('[data-branch-label]').length).toBe(0);
  });
});
