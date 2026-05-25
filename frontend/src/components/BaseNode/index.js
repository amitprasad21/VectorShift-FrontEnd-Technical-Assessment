import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import './styles.css';

export const BaseNode = memo(({ id, title, icon, inputs = [], outputs = [], theme = 'text', children, style = {} }) => {
  const removeNode = useStore((s) => s.removeNode);

  return (
    <div className={`base-node-container base-node-theme-${theme}`} style={style}>
      {inputs.map((input, index) => (
        <div
          key={input.id}
          className="handle-wrapper handle-wrapper-left"
          style={{ top: `${(index + 1) * (100 / (inputs.length + 1))}%` }}
        >
          <Handle type="target" position={Position.Left} id={`${id}-param-${input.id}`} className="base-node-handle" />
          {input.label && <span className="handle-label">{input.label}</span>}
        </div>
      ))}

      {outputs.map((output, index) => (
        <div
          key={output.id}
          className="handle-wrapper handle-wrapper-right"
          style={{ top: `${(index + 1) * (100 / (outputs.length + 1))}%` }}
        >
          <Handle type="source" position={Position.Right} id={`${id}-param-${output.id}`} className="base-node-handle" />
          {output.label && <span className="handle-label">{output.label}</span>}
        </div>
      ))}

      <div className="node-header">
        <div className="node-header-left">
          {icon && <span className="node-header-icon">{icon}</span>}
          <span className="node-header-title">{title}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); removeNode(id); }}
          className="node-header-delete-btn"
          aria-label="Delete node"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="node-body">{children}</div>
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
