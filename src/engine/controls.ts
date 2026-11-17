export interface ControlHandlers {
  started: () => boolean;
  toggle(): void;
  fullscreen(): void;
}

/** Space = pause/resume (only once the film started), F = fullscreen. Returns a detach function. */
export function attachControls(target: Window, h: ControlHandlers): () => void {
  const onKey = (e: KeyboardEvent) => {
    // Held keys auto-repeat; Ctrl+F etc. belong to the browser.
    if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Space' || e.key === ' ') {
      if (!h.started()) return;
      e.preventDefault();
      h.toggle();
    } else if (e.key === 'f' || e.key === 'F') {
      h.fullscreen();
    }
  };
  target.addEventListener('keydown', onKey);
  return () => target.removeEventListener('keydown', onKey);
}

export function toggleFullscreen(doc: Document = document) {
  try {
    if (doc.fullscreenElement) void doc.exitFullscreen().catch(() => {});
    else void doc.documentElement.requestFullscreen().catch(() => {});
  } catch {
    /* fullscreen not available */
  }
}
