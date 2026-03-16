import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { readmeContent } from './ArchitectureContent';

const APP_BANNER = `
  ____             _      _____                   
 |  _ \\  ___   ___| | __ |  ___|__  _ __ __ _  ___ 
 | | | |/ _ \\ / __| |/ / | |_ / _ \\| '__/ _\` |/ _ \\
 | |_| | (_) | (__|   <  |  _| (_) | | | (_| |  __/
 |____/ \\___/ \\___|_|\\_\\ |_|  \\___/|_|  \\__, |\\___|
                                        |___/      

 DOCKFORGE INTERACTIVE ENGINE v1.0
 Type 'help' to begin assembly.
`;

const Box = ({ children, style = {} }) => (
  <div style={{
    backgroundColor: 'rgba(13, 13, 13, 0.8)',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '15px',
    marginBottom: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    maxWidth: '900px',
    color: '#ddd',
    backdropFilter: 'blur(4px)',
    ...style
  }}>
    {children}
  </div>
);

const TutorialComponent = () => (
  <Box>
    <h2 style={{ color: '#00b0ff', marginTop: 0 }}># Tutorial: Quick Start</h2>
    <p>1. Clone the repository:</p>
    <pre style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px', border: '1px solid #333', overflowX: 'auto', textAlign: 'left' }}>
      <code style={{ color: '#00ff41' }}>git clone --depth 1 https://github.com/vedantdubal-141/dockyard.git</code>
    </pre>
    <p>2. Enter the workspace:</p>
    <pre style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px', border: '1px solid #333', overflowX: 'auto', textAlign: 'left' }}>
      <code style={{ color: '#00ff41' }}>cd dockyard</code>
    </pre>
    <p>3. Ignite the Forge (Auto-installs Docker if missing!):</p>
    <pre style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px', border: '1px solid #333', overflowX: 'auto', textAlign: 'left' }}>
      <code style={{ color: '#00ff41' }}>sudo ./scripts/deploy.sh</code>
    </pre>
    <p>4. Follow the interactive prompt to select your blueprint.</p>
  </Box>
);

const COMMANDS = {
  help: `
Available commands:
  <span style="color: #00b0ff; min-width: 120px; display: inline-block;">tutorial</span> - Step-by-step guide on using DockForge
  <span style="color: #00b0ff; min-width: 120px; display: inline-block;">architecture</span> - View the system architecture and project details
  <span style="color: #00b0ff; min-width: 120px; display: inline-block;">demo</span> - Watch the deployment engine in action
  <span style="color: #00b0ff; min-width: 120px; display: inline-block;">clear</span> - Wipe terminal buffer
  <span style="color: #00b0ff; min-width: 120px; display: inline-block;">pwd</span> - Print working directory
  <span style="color: #00b0ff; min-width: 120px; display: inline-block;">sudo</span> - try your luck (⌐■_■)
`,
  demo: `
<span style="color: #fff; font-weight: bold;">[Demo Video]</span>
Initializing video player subsystem...
<span style="color: #555">(Demo functionality will be linked to the presentation video shortly.)</span>
`,
};

export default function DockDashboard() {
  const [history, setHistory] = useState([{ type: 'output', content: `<pre style="color: #00b0ff">${APP_BANNER}</pre>` }]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [isPasswordPrompt, setIsPasswordPrompt] = useState(false);
  const terminalEndRef = useRef(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'c') {
      if (isPasswordPrompt) {
        setIsPasswordPrompt(false);
        setHistory(prev => [...prev, { type: 'output', content: '[sudo] password for forge: \n^C' }]);
      } else {
        setHistory(prev => [...prev, { type: 'input', content: input + '^C' }]);
      }
      setInput('');
      setHistoryIndex(-1);
      return;
    }
    
    if (e.key === 'Enter') {
      if (!isPasswordPrompt && input.trim() !== '') {
        setCommandHistory(prev => [...prev, input]);
      }
      setHistoryIndex(-1);
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isPasswordPrompt && commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isPasswordPrompt && historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex]);
        }
      }
    }
  };

  const handleCommand = useCallback((cmd) => {
    if (isPasswordPrompt) {
      const insults = [
        "Just what do you think you're doing Dave?",
        "It can only be attributed to human error.",
        "That's something I cannot allow to happen.",
        "My pet ferret can type better than you!",
        "What if I told you... possible means definitely?",
        "I smite your ruinous code!",
        "Listen, burrito brains, I don't have time to listen to this trash.",
        "You speak an infinite deal of nothing.",
        "I've seen penguins that can type better than that.",
        "Maybe if you used more than just two fingers...",
        "I'm not going to take this abuse.",
        "Are you on drugs?",
        "Do you think like you type?",
        "Have you considered trying to match wits with a rutabaga?",
        "I think ... therefore I am. You do not ... therefore you are not."
      ];
      const randomInsult = insults[Math.floor(Math.random() * insults.length)];
      setHistory(prev => [...prev, { type: 'output', content: `[sudo] password for forge: \n<span style="color: #ff0041">${randomInsult}</span>` }]);
      setIsPasswordPrompt(false);
      setInput('');
      return;
    }

    const cleanCmd = cmd.toLowerCase().trim();
    const baseCmd = cleanCmd.split(' ')[0];

    if (cleanCmd === 'clear') {
      setHistory([]);
      setIsPasswordPrompt(false);
      setInput('');
      return;
    }

    if (['sudo', 'mkdir', 'cp', 'mv'].includes(baseCmd)) {
      setHistory(prev => [...prev, { type: 'input', content: cmd }]);
      setIsPasswordPrompt(true);
      setInput('');
      return;
    }

    if (cleanCmd === 'pwd') {
      setHistory(prev => [...prev, { type: 'input', content: cmd }, { type: 'output', content: '/home/DockerForge' }]);
      setInput('');
      return;
    }

    if (cleanCmd === 'tutorial') {
      setHistory(prev => [...prev, { type: 'input', content: cmd }, { type: 'component', content: <TutorialComponent /> }]);
      setInput('');
      return;
    }

    if (cleanCmd === 'architecture') {
      setHistory(prev => [...prev, { type: 'input', content: cmd }, { 
        type: 'component', 
        content: (
          <Box>
            <div className="markdown-body" style={{ color: '#ddd' }}>
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 style={{color: '#00b0ff', borderBottom: '1px solid #333', paddingBottom: '10px', textAlign: 'left'}} {...props} />,
                  h2: ({node, ...props}) => <h2 style={{color: '#00ff41', marginTop: '20px', textAlign: 'left'}} {...props} />,
                  h3: ({node, ...props}) => <h3 style={{color: '#00b0ff', textAlign: 'left'}} {...props} />,
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <pre style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '4px', border: '1px solid #333', overflowX: 'auto', marginTop: '10px', marginBottom: '10px', textAlign: 'left' }}>
                        <code className={className} style={{ color: '#00ff41' }} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className={className} style={{ backgroundColor: '#1a1a1a', padding: '2px 5px', borderRadius: '4px', color: '#00ff41' }} {...props}>
                        {children}
                      </code>
                    )
                  },
                  a: ({node, ...props}) => <a style={{color: '#00b0ff', textDecoration: 'none'}} {...props} />,
                  hr: ({node, ...props}) => <hr style={{borderColor: '#333', margin: '20px 0'}} {...props} />,
                  blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '4px solid #00ff41', margin: 0, paddingLeft: '15px', color: '#888'}} {...props} />
                }}
              >
                {readmeContent}
              </ReactMarkdown>
            </div>
          </Box>
        )
      }]);
      setInput('');
      return;
    }

    let response = "";
    if (COMMANDS[cleanCmd]) {
      response = COMMANDS[cleanCmd];
    } else if (cleanCmd !== "") {
      response = `Command not found: ${cleanCmd}. Type 'help' for assistance.`;
    }

    if (response) {
      setHistory(prev => [...prev, { type: 'input', content: cmd }, { type: 'output', content: response }]);
    }
    setInput('');
  }, [isPasswordPrompt]);

  return (
    <div style={{
      backgroundColor: '#050505',
      minHeight: '100vh',
      color: '#eee',
      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
      padding: '20px',
      fontSize: '16px',
      lineHeight: '1.5',
      textAlign: 'left'
    }}>
      <div id="terminal-buffer">
        {history.map((item, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            {item.type === 'input' ? (
              <div>
                <span style={{ color: '#00ff41' }}>forge@dock</span>
                <span style={{ color: '#fff' }}>:</span>
                <span style={{ color: '#00b0ff' }}>~</span>
                <span style={{ color: '#fff' }}>$</span> {item.content}
              </div>
            ) : item.type === 'component' ? (
              <div>{item.content}</div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: item.content }} />
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <div style={{ display: 'flex', marginTop: '10px' }}>
        {isPasswordPrompt ? (
          <span style={{ color: '#fff', marginRight: '8px' }}>[sudo] password for forge: </span>
        ) : (
          <>
            <span style={{ color: '#00ff41', marginRight: '8px' }}>forge@dock</span>
            <span style={{ color: '#fff' }}>:</span>
            <span style={{ color: '#00b0ff' }}>~</span>
            <span style={{ color: '#fff' }}>$</span>&nbsp;
          </>
        )}
        <input
          autoFocus
          type={isPasswordPrompt ? "password" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#00ff41',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            outline: 'none',
            width: '80%'
          }}
        />
      </div>
    </div>
  );
}
