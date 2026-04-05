import React from 'react';

/**
 * TitleBar – drag region + controls for the frameless window.
 * The outer div is the drag region; buttons opt out with WebkitAppRegion: 'no-drag'.
 */
export default function TitleBar({ isPinned }) {
  return (
    <div style={styles.bar}>
      {/* Left: app identity */}
      <div style={styles.left}>
        <span style={styles.icon}>👻</span>
        <span style={styles.title}>GHOST ASSIST</span>
      </div>

      {/* Right: controls – must opt out of drag so clicks register */}
      <div style={styles.controls}>
        <button
          style={{ ...styles.btn, opacity: isPinned ? 1 : 0.4 }}
          onClick={() => window.electron?.togglePin()}
          title={isPinned ? 'Unpin window' : 'Pin window on top'}
        >
          📌
        </button>
        <button
          style={styles.btn}
          onClick={() => window.close()}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: '1px solid rgba(0, 255, 136, 0.15)',
    WebkitAppRegion: 'drag',
    cursor: 'move',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  icon: {
    fontSize: '14px',
    lineHeight: 1,
  },
  title: {
    color: '#00ff88',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    WebkitAppRegion: 'no-drag',
  },
  btn: {
    WebkitAppRegion: 'no-drag',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: 'rgba(0, 255, 136, 0.7)',
    padding: '2px 6px',
    lineHeight: 1,
    borderRadius: '3px',
    transition: 'color 0.15s',
  },
};
