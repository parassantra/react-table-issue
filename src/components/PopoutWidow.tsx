import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

interface PopoutWindowProps {
  children: React.ReactNode;
  closeWindow: () => void;
  setPopoutDocument: (doc: Document) => void;
  width?: number;
  height?: number;
}

const PopoutWindow: React.FC<PopoutWindowProps> = ({ 
  children, 
  closeWindow, 
  setPopoutDocument,
  width = 800, 
  height = 600 
}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const popoutWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    if (popoutWindowRef.current) {
      popoutWindowRef.current.close();
    }

    const win = window.open('', '', `width=${width},height=${height}`);
    if (win) {
      popoutWindowRef.current = win;
      const containerDiv = win.document.createElement('div');
      win.document.body.appendChild(containerDiv);

      win.document.title = 'Resizable Table Popout';
      
      // Copy styles from the parent window
      const parentStyles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            console.warn('Error accessing styleSheet', e);
            return '';
          }
        })
        .join('\n');

      const style = win.document.createElement('style');
      style.textContent = parentStyles + `
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        h2 { margin-top: 0; }
        button { margin-top: 20px; padding: 10px 15px; font-size: 16px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 4px; }
        button:hover { background-color: #45a049; }
      `;
      win.document.head.appendChild(style);

      setContainer(containerDiv);
      setPopoutDocument(win.document);

      const handleUnload = () => {
        closeWindow();
        popoutWindowRef.current = null;
      };

      win.addEventListener('beforeunload', handleUnload);

      return () => {
        win.removeEventListener('beforeunload', handleUnload);
        if (popoutWindowRef.current) {
          popoutWindowRef.current.close();
          popoutWindowRef.current = null;
        }
      };
    }
  }, [closeWindow, setPopoutDocument, width, height]);

  return container && popoutWindowRef.current
    ? ReactDOM.createPortal(
        <>
          {children}
          <button onClick={() => popoutWindowRef.current?.close()}>Close Window</button>
        </>,
        container
      )
    : null;
};

export default PopoutWindow;