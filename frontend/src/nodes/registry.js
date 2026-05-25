import React from 'react';
import {
  ArrowRightCircle, ArrowLeftCircle, Cpu, FileText, Terminal,
  Database, GitFork, Globe, Eye
} from 'lucide-react';
import { createConfigNode } from './NodeFactory';
import { TextNode } from './TextNode';
import { PromptNode } from './PromptNode';

const configs = {
  customInput: {
    displayName: 'InputNode',
    title: 'Input Node',
    icon: <ArrowRightCircle size={16} />,
    theme: 'input',
    toolbar: { label: 'Input', themeClass: 'draggable-node-input' },
    inputs: [],
    outputs: [{ id: 'value', label: 'Text', labelFromField: 'inputType' }],
    fields: [
      { key: 'inputName', type: 'text', label: 'Field Name', default: '', placeholder: 'input_variable' },
      { key: 'inputType', type: 'select', label: 'Data Type', default: 'Text', options: [
        { value: 'Text', label: 'Text (String)' },
        { value: 'File', label: 'File (Binary)' },
      ]},
    ],
    defaultData: { inputType: 'Text' },
  },

  llm: {
    displayName: 'LLMNode',
    title: 'LLM Node',
    icon: <Cpu size={16} />,
    theme: 'llm',
    toolbar: { label: 'LLM', themeClass: 'draggable-node-llm' },
    inputs: [
      { id: 'system', label: 'System Instruction' },
      { id: 'prompt', label: 'User Prompt' },
    ],
    outputs: [{ id: 'response', label: 'Model Response' }],
    fields: [],
    renderContent: () => (
      <div className="node-info-block">
        Processes inputs through neural reasoning and yields a response.
      </div>
    ),
    defaultData: {},
  },

  customOutput: {
    displayName: 'OutputNode',
    title: 'Output Node',
    icon: <ArrowLeftCircle size={16} />,
    theme: 'output',
    toolbar: { label: 'Output', themeClass: 'draggable-node-output' },
    inputs: [{ id: 'value', label: 'Text', labelFromField: 'outputType' }],
    outputs: [],
    fields: [
      { key: 'outputName', type: 'text', label: 'Field Name', default: '', placeholder: 'output_variable' },
      { key: 'outputType', type: 'select', label: 'Output Format', default: 'Text', options: [
        { value: 'Text', label: 'Text (String)' },
        { value: 'Image', label: 'Image (File)' },
      ]},
    ],
    defaultData: { outputType: 'Text' },
  },

  text: {
    displayName: 'TextNode',
    title: 'Text Node',
    icon: <FileText size={16} />,
    theme: 'text',
    toolbar: { label: 'Text', themeClass: 'draggable-node-text' },
    component: TextNode,
    defaultData: { text: '{{input}}', variables: ['input'] },
  },

  prompt: {
    displayName: 'PromptNode',
    title: 'Prompt Builder',
    icon: <Terminal size={16} />,
    theme: 'text',
    toolbar: { label: 'Prompt', themeClass: 'draggable-node-text' },
    component: PromptNode,
    defaultData: { template: 'Translate {{text}} to {{language}}', variables: ['text', 'language'] },
  },

  database: {
    displayName: 'DatabaseNode',
    title: 'Database Query',
    icon: <Database size={16} />,
    theme: 'input',
    toolbar: { label: 'Database', themeClass: 'draggable-node-input' },
    inputs: [{ id: 'connection', label: 'DB Connection' }],
    outputs: [{ id: 'dataset', label: 'Query Results' }],
    fields: [
      { key: 'dbEngine', type: 'select', label: 'DB Engine', default: 'PostgreSQL', options: [
        { value: 'PostgreSQL', label: 'PostgreSQL' },
        { value: 'MySQL', label: 'MySQL' },
        { value: 'MongoDB', label: 'MongoDB' },
        { value: 'SQLite', label: 'SQLite' },
      ]},
      { key: 'sqlQuery', type: 'textarea', label: 'SQL Query', default: 'SELECT * FROM users LIMIT 10;', placeholder: 'SELECT * FROM table...' },
    ],
    defaultData: { dbEngine: 'PostgreSQL', sqlQuery: 'SELECT * FROM users LIMIT 10;' },
  },

  filter: {
    displayName: 'FilterNode',
    title: 'Conditional Filter',
    icon: <GitFork size={16} />,
    theme: 'output',
    toolbar: { label: 'Filter', themeClass: 'draggable-node-output' },
    inputs: [{ id: 'dataset', label: 'Dataset Input' }],
    outputs: [
      { id: 'trueBranch', label: 'True Path' },
      { id: 'falseBranch', label: 'False Path' },
    ],
    fields: [
      { key: 'condition', type: 'text', label: 'Condition', default: 'value > 100', placeholder: 'e.g. data.value > 100' },
    ],
    defaultData: { condition: 'value > 100' },
  },

  http: {
    displayName: 'HTTPNode',
    title: 'REST API Request',
    icon: <Globe size={16} />,
    theme: 'llm',
    toolbar: { label: 'REST API', themeClass: 'draggable-node-llm' },
    inputs: [
      { id: 'requestHeaders', label: 'Headers' },
      { id: 'requestBody', label: 'Request Body' },
    ],
    outputs: [{ id: 'responseBody', label: 'JSON Response' }],
    fields: [
      { key: 'method', type: 'select', label: 'HTTP Method', default: 'POST', options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ]},
      { key: 'url', type: 'text', label: 'Endpoint URL', default: 'https://api.example.com/v1/data', placeholder: 'https://api...' },
    ],
    defaultData: { method: 'POST', url: 'https://api.example.com/v1/data' },
  },

  display: {
    displayName: 'DisplayNode',
    title: 'Console Viewer',
    icon: <Eye size={16} />,
    theme: 'output',
    toolbar: { label: 'Console', themeClass: 'draggable-node-output' },
    inputs: [{ id: 'logValue', label: 'Console Input' }],
    outputs: [],
    fields: [
      { key: 'displayFormat', type: 'select', label: 'Format Style', default: 'Pretty JSON', options: [
        { value: 'Pretty JSON', label: 'Pretty JSON' },
        { value: 'Raw String', label: 'Raw Text' },
        { value: 'Table View', label: 'Table Grid' },
      ]},
    ],
    renderContent: () => (
      <div className="node-console-block">[Console Idle]</div>
    ),
    defaultData: { displayFormat: 'Pretty JSON' },
  },
};

Object.entries(configs).forEach(([, config]) => {
  if (!config.component) {
    config.component = createConfigNode(config);
  }
});

export const nodeTypes = Object.fromEntries(
  Object.entries(configs).map(([type, config]) => [type, config.component])
);

export const toolbarItems = Object.entries(configs).map(([type, config]) => ({
  type,
  label: config.toolbar.label,
  icon: config.icon,
  themeClass: config.toolbar.themeClass,
}));

export const getDefaultData = (nodeId, type) => ({
  id: nodeId,
  nodeType: type,
  ...(configs[type]?.defaultData || {}),
});

export { configs as nodeConfigs };
