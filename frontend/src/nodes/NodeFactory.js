import React, { memo } from 'react';
import { BaseNode } from '../components/BaseNode';
import { NodeField } from '../components/NodeField';
import { useStore } from '../store';

export function createConfigNode(config) {
  const ConfigNode = memo(({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);

    const resolveLabel = (handle) => {
      if (handle.labelFromField && data?.[handle.labelFromField]) {
        return data[handle.labelFromField];
      }
      return handle.label;
    };

    const inputs = (config.inputs || []).map((h) => ({ id: h.id, label: resolveLabel(h) }));
    const outputs = (config.outputs || []).map((h) => ({ id: h.id, label: resolveLabel(h) }));

    return (
      <BaseNode id={id} title={config.title} icon={config.icon} theme={config.theme} inputs={inputs} outputs={outputs}>
        {(config.fields || []).map((field) => {
          const value = data?.[field.key] !== undefined ? data[field.key] : field.default;
          const onChange = (e) => updateNodeField(id, field.key, e.target.value);

          return (
            <NodeField key={field.key} label={field.label}>
              {field.type === 'select' ? (
                <select value={value} onChange={onChange} className="node-select" aria-label={field.label}>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={value}
                  onChange={onChange}
                  className="node-textarea"
                  placeholder={field.placeholder}
                  rows={field.rows || 2}
                  aria-label={field.label}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={onChange}
                  className="node-input"
                  placeholder={field.placeholder}
                  aria-label={field.label}
                />
              )}
            </NodeField>
          );
        })}
        {config.renderContent && config.renderContent(id, data)}
      </BaseNode>
    );
  });

  ConfigNode.displayName = config.displayName || 'ConfigNode';
  return ConfigNode;
}
