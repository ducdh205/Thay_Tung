export function EndOverlay({ onReplay }: { onReplay: () => void }) {
  return (
    <button
      data-replay
      onClick={onReplay}
      style={{
        position: 'absolute', right: 32, bottom: 28, zIndex: 60, fontSize: 20, padding: '10px 22px', borderRadius: 10,
        border: '1px solid rgba(255,255,255,.35)', background: 'rgba(0,0,0,.35)', color: 'rgba(255,255,255,.85)',
        cursor: 'pointer', animation: 'popIn 1s ease 1.5s both', fontFamily: 'system-ui, Segoe UI, sans-serif',
      }}
    >
      ↻ Xem lại
    </button>
  );
}
