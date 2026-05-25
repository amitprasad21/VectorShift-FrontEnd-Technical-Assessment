import React from 'react';

export const NodeField = ({ label, children }) => (
  <div className="node-input-container">
    {label && <span className="node-label">{label}</span>}
    {children}
  </div>
);

export default NodeField;
