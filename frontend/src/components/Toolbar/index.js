import React from 'react';
import { DraggableNode } from './draggableNode';
import { toolbarItems } from '../../nodes/registry';
import './styles.css';

export const PipelineToolbar = () => (
  <div className="toolbar-panel glass-panel">
    <div className="toolbar-header">
      <h1 className="toolbar-title">Flow</h1>
      <span className="toolbar-subtitle">Drag components into the canvas</span>
    </div>
    <div className="toolbar-items" role="toolbar" aria-label="Node palette">
      {toolbarItems.map((item) => (
        <DraggableNode
          key={item.type}
          type={item.type}
          label={item.label}
          icon={item.icon}
          themeClass={item.themeClass}
        />
      ))}
    </div>
  </div>
);

export default PipelineToolbar;
