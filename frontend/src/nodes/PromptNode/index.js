import React, { useState, useEffect, useMemo } from 'react';
import { Terminal } from 'lucide-react';
import { BaseNode } from '../../components/BaseNode';
import { NodeField } from '../../components/NodeField';
import { useStore } from '../../store';
import { parseVariables } from '../../utils/variableParser';

export const PromptNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const updateDynamicHandles = useStore((s) => s.updateDynamicHandles);

  const [template, setTemplate] = useState(data?.template !== undefined ? data.template : 'Translate {{text}} to {{language}}');

  useEffect(() => {
    if (data?.template !== undefined && data.template !== template) {
      setTemplate(data.template);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.template]);

  const variables = useMemo(() => parseVariables(template), [template]);

  useEffect(() => {
    const storeTemplate = data?.template;
    const storeVars = data?.variables || [];
    const changed = storeVars.length !== variables.length || variables.some((v, i) => v !== storeVars[i]);

    if (storeTemplate !== template || changed) {
      updateNodeField(id, 'template', template);
      updateNodeField(id, 'variables', variables);
      updateDynamicHandles(id, variables);
    }
  }, [id, variables, template, data, updateNodeField, updateDynamicHandles]);

  const inputs = variables.map((v) => ({ id: v, label: v }));
  const outputs = [{ id: 'prompt', label: 'Formatted Prompt' }];

  return (
    <BaseNode id={id} title="Prompt Builder" icon={<Terminal size={16} />} theme="text" inputs={inputs} outputs={outputs}>
      <NodeField label="Prompt Template">
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="node-textarea"
          placeholder="System template or prompt context..."
          rows={2}
          aria-label="Prompt template"
        />
      </NodeField>
    </BaseNode>
  );
};

export default PromptNode;
