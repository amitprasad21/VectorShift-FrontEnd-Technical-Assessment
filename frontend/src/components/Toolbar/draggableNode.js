import React from 'react';

export const DraggableNode = ({ type, label, icon, themeClass }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`draggable-node ${themeClass || ''}`}
      onDragStart={onDragStart}
      draggable
      role="button"
      aria-label={`Drag ${label} node`}
      tabIndex={0}
    >
      {icon && <span className="draggable-node-icon">{icon}</span>}
      <span className="draggable-node-label">{label}</span>
    </div>
  );
};
