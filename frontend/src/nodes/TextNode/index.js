import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { BaseNode } from '../../components/BaseNode';
import { NodeField } from '../../components/NodeField';
import { useStore } from '../../store';
import { parseVariables } from '../../utils/variableParser';
import { useAutosizeTextarea } from '../../hooks/useAutosizeTextarea';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const updateDynamicHandles = useStore((s) => s.updateDynamicHandles);

  const [text, setText] = useState(data?.text !== undefined ? data.text : '{{input}}');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (data?.text !== undefined && data.text !== text) {
      setText(data.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.text]);

  const nodeDimensions = useAutosizeTextarea(textareaRef, text);
  const variables = useMemo(() => parseVariables(text), [text]);

  useEffect(() => {
    const storeText = data?.text;
    const storeVars = data?.variables || [];
    const changed = storeVars.length !== variables.length || variables.some((v, i) => v !== storeVars[i]);

    if (storeText !== text || changed) {
      updateNodeField(id, 'text', text);
      updateNodeField(id, 'variables', variables);
      updateDynamicHandles(id, variables);
    }
  }, [id, variables, text, data, updateNodeField, updateDynamicHandles]);

  const inputs = variables.map((v) => ({ id: v, label: v }));
  const outputs = [{ id: 'output', label: 'Output text' }];

  return (
    <BaseNode id={id} title="Text Node" icon={<FileText size={16} />} theme="text" inputs={inputs} outputs={outputs} style={nodeDimensions}>
      <NodeField label="Text Template">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="node-textarea"
          placeholder="Hello {{name}}, welcome to {{company}}!"
          rows={1}
          style={{ overflow: 'hidden' }}
          aria-label="Text template"
        />
      </NodeField>
      <div className="node-hint-text">
        Use <code>{"{{variable_name}}"}</code> to create input handles.
      </div>
    </BaseNode>
  );
};

export default TextNode;
