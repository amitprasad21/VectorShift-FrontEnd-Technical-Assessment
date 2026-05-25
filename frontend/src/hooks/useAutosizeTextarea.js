import { useEffect, useState } from 'react';

export const useAutosizeTextarea = (textareaRef, value) => {
  const [nodeDimensions, setNodeDimensions] = useState({ width: '260px', height: 'auto' });

  useEffect(() => {
    const el = textareaRef?.current;
    if (!el) return;

    el.style.height = '0px';
    const boundedHeight = Math.min(Math.max(48, el.scrollHeight + 4), 300);
    el.style.height = `${boundedHeight}px`;

    const lines = value.split('\n');
    const longestLine = Math.max(...lines.map((l) => l.length));
    const boundedWidth = Math.min(Math.max(260, longestLine * 7.2 + 48), 480);

    setNodeDimensions({ width: `${boundedWidth}px`, height: 'auto' });
  }, [textareaRef, value]);

  return nodeDimensions;
};

export default useAutosizeTextarea;
