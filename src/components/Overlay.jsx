import React, { useEffect, useRef } from 'react';
import TitleBar from './TitleBar.jsx';
import StatusBar from './StatusBar.jsx';
import TranscriptPanel from './TranscriptPanel.jsx';
import AnswerPanel from './AnswerPanel.jsx';

export default function Overlay({ history, displayedAnswer, transcript, status, isPinned, isTyping }) {
  const scrollRef = useRef(null);

  // Auto-scroll to the bottom of the history whenever a new item is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div style={styles.shell}>
      <div style={styles.scanline} />

      <TitleBar isPinned={isPinned} />
      <StatusBar status={status} />

      {/* NEW: Scrollable History Container */}
      {history && history.length > 0 && (
        <div style={styles.historyContainer} className="hide-scrollbar" ref={scrollRef}>
          {history.map((item, index) => (
            <div key={index} style={styles.historyItem}>
              <div style={styles.historyQ}><span style={{color: '#00ff88'}}>Q:</span> {item.q}</div>
              <div style={styles.historyA}><span style={{color: '#00ff88'}}>A:</span> {item.a}</div>
            </div>
          ))}
        </div>
      )}

      <TranscriptPanel transcript={transcript} />
      <AnswerPanel displayedAnswer={displayedAnswer} isTyping={isTyping} />
    </div>
  );
}

const styles = {
  shell: {
    width: '100vw',
    height: '100vh',
    background: 'rgba(8, 8, 12, 0.88)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 255, 136, 0.15)',
    boxShadow: '0 0 40px rgba(0, 255, 136, 0.05)',
    color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    userSelect: 'none',
    position: 'relative',
    borderRadius: '4px',
  },
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200%',
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,255,136,0.03) 50%, transparent 100%)',
    backgroundSize: '100% 40px',
    animation: 'scanline 8s linear infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },
  historyContainer: {
    flex: 1, // Takes up remaining space above the active panels
    overflowY: 'auto',
    padding: '10px 15px',
    borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 1, // Stays above the scanline
  },
  historyItem: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '10px',
    borderRadius: '4px',
    borderLeft: '2px solid rgba(0, 255, 136, 0.3)',
  },
  historyQ: {
    color: '#a0aec0',
    marginBottom: '6px',
    lineHeight: '1.4',
  },
  historyA: {
    color: '#e2e8f0',
    lineHeight: '1.4',
  }
};