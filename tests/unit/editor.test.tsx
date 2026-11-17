import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { createFilmStore } from '../../src/engine/store';
import { Editor } from '../../src/ui/Editor';

afterEach(cleanup);

function storeWithDoc() {
  const store = createFilmStore();
  store.patch((s) => {
    s.fade = 0;
    s.docs.a = {
      id: 'a', fileName: 'index.html', lang: 'html', text: '<h1>Hi</h1>', typed: 4,
      chunks: [{ start: 0, len: 11, typed: 4, cursor: 'thay' }], errorLines: [],
    };
    s.tabs = ['a'];
    s.activeDoc = 'a';
    s.cursors.thay = { id: 'thay', docId: 'a', visible: true };
  });
  return store;
}

describe('Editor', () => {
  it('shows only the typed part of the active doc, its tab and the cursor label', () => {
    const store = storeWithDoc();
    const { container } = render(<Editor store={store} />);
    const pane = container.querySelector('[data-code-pane]')!;
    expect(pane.textContent).toContain('<h1>');
    expect(pane.textContent).not.toContain('Hi');
    expect(screen.getAllByText('Thầy Tùng').length).toBeGreaterThan(0);
    expect(screen.getByText('index.html')).toBeTruthy();
  });

  it('puts a cursor pinned to a line at the end of that line', () => {
    const store = storeWithDoc();
    store.patch((s) => {
      s.docs.a.text = 'ab\ncdef\n';
      s.docs.a.chunks = [{ start: 0, len: 8, typed: 8, cursor: 'em' }];
      s.docs.a.typed = 8;
      s.cursors.anhTung = { id: 'anhTung', docId: 'a', visible: true, pin: 2 };
    });
    const { container } = render(<Editor store={store} />);
    const caret = container.querySelector('[data-caret="anhTung"]') as HTMLElement;
    expect(caret.dataset.line).toBe('1');
    expect(caret.dataset.col).toBe('4');
  });

  it('re-renders on store changes: error lines, subtitles and approved reviews', () => {
    const store = storeWithDoc();
    const { container } = render(<Editor store={store} />);
    act(() => store.patch((s) => void (s.docs.a.errorLines = [1])));
    expect(container.querySelector('[data-error-line="1"]')).toBeTruthy();
    act(() => store.patch((s) => void (s.subtitle = 'X')));
    expect(screen.getByText('X')).toBeTruthy();
    act(() =>
      store.patch((s) => void (s.comments = [{ docId: 'a', line: 1, author: 'chiTrang', text: 'Ổn rồi em', approved: true }])),
    );
    expect(screen.getByText(/✓ Approved/)).toBeTruthy();
  });
});
