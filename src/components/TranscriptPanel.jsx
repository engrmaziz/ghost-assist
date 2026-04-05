import React from 'react';

/**
 * TranscriptPanel – displays the last heard speech fragment.
 * Capped to 2 lines with ellipsis for overflow.
 */
export default function TranscriptPanel({ transcript }) {
  return (
    <div style={styles.panel}>
      <span style={styles.label}>HEARD</span>
      <p style={styles.text}>{transcript || '—'}</p>
    </div>
  );
}

const styles = {
  panel: {
    padding: '8px 12px',
    borderBottom: '1px solid rgba(0, 255, 136, 0.08)',
  },
  label: {
    display: 'block',
    color: '#00ff88',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    marginBottom: '4px',
  },
  text: {
    margin: 0,
    color: 'rgba(180, 190, 200, 0.8)',
    fontSize: '11px',
    fontStyle: 'italic',
    lineHeight: 1.5,
    // Clamp to 2 lines
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
