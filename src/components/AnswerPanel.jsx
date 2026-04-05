import React from 'react';

/**
 * AnswerPanel – displays the AI-generated answer with typewriter reveal.
 * Shows a blinking cursor while the typewriter is still running.
 */
export default function AnswerPanel({ displayedAnswer, isTyping }) {
  return (
    <div style={styles.panel}>
      <span style={styles.label}>ANSWER</span>
      <div style={styles.scrollArea}>
        <p style={styles.text}>
          {displayedAnswer || <span style={styles.placeholder}>Waiting for answer…</span>}
          {isTyping && <span style={styles.cursor}>|</span>}
        </p>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    padding: '8px 12px 10px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  label: {
    display: 'block',
    color: '#00ff88',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    marginBottom: '6px',
    flexShrink: 0,
  },
  scrollArea: {
    maxHeight: '280px',
    overflowY: 'auto',
  },
  text: {
    margin: 0,
    color: '#ffffff',
    fontSize: '13px',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
  },
  placeholder: {
    color: 'rgba(255,255,255,0.25)',
    fontStyle: 'italic',
  },
  cursor: {
    color: '#00ff88',
    fontWeight: 400,
    animation: 'blink 0.8s step-start infinite',
    marginLeft: '1px',
  },
};
