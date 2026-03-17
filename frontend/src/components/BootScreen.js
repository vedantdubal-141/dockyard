import React, { useState, useEffect } from 'react';

const bootLines = [
  '[  0.000000] DOCKFORGE ENGINE v1.0.4 initializing...',
  '[  0.014291] Loading virtualization modules...',
  '[  0.048203] Mounting overlayfs /blueprint...',
  '[  0.112762] Initializing forge buffer...',
  '[  0.181394] Starting radar subsystem... OK',
  '[  0.258521] Detecting system resources: 16GB RAM detected.',
  '[  0.316109] Docker socket established.',
  '[  0.391883] Loading ASCII blueprints...',
  '[  0.482047] Parsing dockforge.yml... OK',
  '[  0.553291] Establishing secure forge context...',
  '[  0.641845] Starting interactive orchestrator...',
  '[  0.773964] FORGE ENGINE STATUS: OPERATIONAL.',
  '',
  '   ____             _      _____',
  '  |  _ \\  ___   ___| | __ |  ___|__  _ __ __ _  ___',
  '  | | | |/ _ \\ / __| |/ / | |_ / _ \\| \'__/ _` |/ _ \\',
  '  | |_| | (_) | (__|   <  |  _| (_) | | | (_| |  __/',
  '  |____/ \\___/ \\___|_|\\_\\ |_|  \\___/|_|  \\__, |\\___|',
  '                                         |___/',
  '',
  '  Starting DOCKFORGE INTERFACE...',
];

const CHAR_DELAY = 15;
const LINE_DELAY = 50;

export default function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (done) return;

    const line = bootLines[currentLineIdx];

    if (line === '') {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, '']);
        if (currentLineIdx + 1 >= bootLines.length) {
          finishBoot();
        } else {
          setCurrentLineIdx(i => i + 1);
          setCurrentChar(0);
        }
      }, LINE_DELAY);
      return () => clearTimeout(timer);
    }

    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setLines(prev => {
          const updated = [...prev];
          updated[currentLineIdx] = line.slice(0, currentChar + 1);
          return updated;
        });
        setCurrentChar(c => c + 1);
      }, line.startsWith('  ') ? 8 : CHAR_DELAY);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      if (currentLineIdx + 1 >= bootLines.length) {
        finishBoot();
      } else {
        setCurrentLineIdx(i => i + 1);
        setCurrentChar(0);
      }
    }, LINE_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLineIdx, currentChar, done]);

  function finishBoot() {
    setDone(true);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800);
    }, 800);
  }

  const isForgeLogo = (line) => line && (line.includes('|') || line.includes('_') || line === '  Starting DOCKFORGE INTERFACE...');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050505',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '40px 50px',
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
        fontSize: '14px',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease',
        overflowY: 'hidden',
        color: '#00ff41',
      }}
    >
      <pre style={{ margin: 0, lineHeight: '1.5', textAlign: 'left' }}>
        {lines.map((line, i) => {
          const isLogo = isForgeLogo(line);
          const isHeader = line.startsWith('[');
          const isOK = line.endsWith('OK');
          return (
            <div key={i}>
              {isLogo ? (
                <span style={{ color: '#00b0ff', fontWeight: 'bold' }}>{line}</span>
              ) : isOK ? (
                <span style={{ color: '#00ff41' }}>
                  {line.slice(0, -2)}
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>OK</span>
                </span>
              ) : isHeader ? (
                <span style={{ color: '#555' }}>{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          );
        })}
        {!done && (
          <span style={{ animation: 'blink 1s step-end infinite' }}>▊</span>
        )}
      </pre>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
