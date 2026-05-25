export const parseVariables = (text) => {
  if (typeof text !== 'string') return [];

  const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
  const variables = new Set();
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) variables.add(match[1].trim());
  }

  return Array.from(variables);
};
