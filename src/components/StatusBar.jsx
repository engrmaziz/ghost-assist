import React from 'react';

/**
 * StatusBar – pulsing green indicator dot + human-readable status text.
 */
export default function StatusBar({ status }) {
  return (
    <div style={styles.bar}>
      <span style={styles.dot} />
      <span style={styles.text}>{status}</span>
    </div>
  );
}

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderBottom: '1px solid rgba(0, 255, 136, 0.08)',
  },
  dot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#00ff88',
    flexShrink: 0,
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  text: {
    color: 'rgba(0, 255, 136, 0.75)',
    fontSize: '11px',
    letterSpacing: '0.05em',
  },
};
