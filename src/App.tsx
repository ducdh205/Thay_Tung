import { useEffect, useMemo } from 'react';
import { Stage } from './ui/Stage';
import { Editor } from './ui/Editor';
import { createFilmStore } from './engine/store';
import { buildMaster } from './engine/director';

// TEMP demo (replaced in Task 6)
export function App() {
  const store = useMemo(() => createFilmStore(), []);
  useEffect(() => {
    const m = buildMaster([{ id: 'demo', build: (f) => {
      f.openFile({ id: 'a', fileName: 'index.html', lang: 'html', text: '' });
      f.type('a', 'thay', '<!DOCTYPE html>\n<html lang="vi">\n  <h1>Xin chào, thế giới của em</h1>\n', { cps: 30 });
      f.type('a', 'em', '  <p>Em bắt đầu học code</p>\n', { cps: 20 });
      f.set((s) => { s.docs.a.errorLines = [4]; s.comments = [{ docId: 'a', line: 2, author: 'chiTrang', text: 'Ổn rồi em', approved: true }]; s.terminal = { visible: true, lines: ['$ git clone https://repo', '✓ done'] }; s.subtitle = 'Năm nhất, em chỉ có một màn hình trống.'; });
    } }], store);
    m.tl.seek(m.duration, false);
  }, [store]);
  return <Stage><Editor store={store} /></Stage>;
}
