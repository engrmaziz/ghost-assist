import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Overlay from './components/Overlay.jsx';

export default function App() {
  const [history, setHistory] = useState([]); 
  const [answer, setAnswer] = useState('');
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Initializing...');
  const [isPinned, setIsPinned] = useState(true);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // NEW: Setup State for API Key
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [inputKey, setInputKey] = useState('');

  const intervalRef = useRef(null);
  
  // We use refs to hold the *current* state of transcript/answer so the 
  // status watcher effect always has the latest values without re-rendering issues.
  const transcriptRef = useRef('');
  const answerRef = useRef('');

  useEffect(() => {
    if (!window.electron) {
      setStatus('Ready — browser dev mode');
      setTranscript('What is your experience with distributed systems?');
      setAnswer('I have 4 years of hands-on experience building distributed systems...');
      setHistory([{ q: "What is React?", a: "A UI library." }]);
      return;
    }

    // Check for API Key on load
    window.electron.getApiKey().then((key) => {
      if (!key) {
        setNeedsApiKey(true);
      }
    });

    const unsubTranscript = window.electron.onTranscript((data) => {
      // Append new chunks to the running transcript ref
      transcriptRef.current = transcriptRef.current ? transcriptRef.current + ' ' + data : data;
      setTranscript(transcriptRef.current);
    });

    const unsubAnswer = window.electron.onAnswer((data) => {
      answerRef.current = data;
      setAnswer(data);
    });

    const unsubStatus = window.electron.onStatus((data) => {
      setStatus(prevStatus => {
        // If we go from "Thinking..." or "Error" back to "Listening...",
        // we know a new turn has started. Time to archive the old one!
        if ((prevStatus === 'Thinking...' || prevStatus.includes('Error')) && data === 'Listening...') {
            if (transcriptRef.current && answerRef.current) {
               // Push to history
               setHistory(prev => [...prev, { q: transcriptRef.current, a: answerRef.current }]);
               
               // Wipe current display for the new question
               transcriptRef.current = '';
               answerRef.current = '';
               setTranscript('');
               setAnswer('');
               setDisplayedAnswer('');
            }
        }
        return data;
      });
    });

    const unsubPinStatus = window.electron.onPinStatus((data) => setIsPinned(data));
    
    const unsubClearText = window.electron.onClearText(() => {
      transcriptRef.current = '';
      answerRef.current = '';
      setAnswer('');
      setTranscript('');
      setDisplayedAnswer('');
      setHistory([]); 
    });

    window.electron.sendReady();

    return () => {
      unsubAnswer();
      unsubTranscript();
      unsubStatus();
      unsubPinStatus();
      unsubClearText();
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedAnswer('');
    setIsTyping(false);

    if (!answer) return;

    let charIndex = 0;
    setIsTyping(true);
    intervalRef.current = setInterval(() => {
      charIndex += 1;
      setDisplayedAnswer(answer.slice(0, charIndex));
      if (charIndex >= answer.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
      }
    }, 18);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsTyping(false);
    };
  }, [answer]);

  // NEW: Save Key Handler
  const handleSaveKey = () => {
    if (inputKey.trim().length > 20) { // Basic validation for Groq keys
      window.electron.saveApiKey(inputKey.trim()).then(() => {
        setNeedsApiKey(false);
        setStatus('Connecting to AI Brain...');
      });
    }
  };

  // NEW: Setup Screen UI
  if (needsApiKey) {
    return (
      <div style={styles.setupContainer}>
        <div style={styles.setupBox}>
          <h2 style={{color: '#00ff88', margin: '0 0 10px 0'}}>GhostAssist Setup</h2>
          <p style={{color: '#a0aec0', fontSize: '12px', marginBottom: '20px'}}>Please enter your Groq API Key to continue. This is stored securely on your machine.</p>
          <input 
            type="password" 
            placeholder="gsk_..." 
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSaveKey} style={styles.button}>Save & Start</button>
        </div>
      </div>
    );
  }

  return (
    <Overlay
      history={history}
      displayedAnswer={displayedAnswer}
      transcript={transcript}
      status={status}
      isPinned={isPinned}
      isTyping={isTyping}
    />
  );
}

// Inline styles for the setup screen
const styles = {
  setupContainer: {
    width: '100vw', height: '100vh', background: 'rgba(8, 8, 12, 0.95)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace", WebkitAppRegion: 'drag', // Allows moving window
  },
  setupBox: {
    background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '8px',
    border: '1px solid rgba(0,255,136,0.3)', width: '80%', textAlign: 'center', WebkitAppRegion: 'no-drag'
  },
  input: {
    width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333',
    color: '#fff', borderRadius: '4px', marginBottom: '15px', outline: 'none'
  },
  button: {
    width: '100%', padding: '10px', background: '#00ff88', color: '#000',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
  }
}