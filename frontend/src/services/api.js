const API_BASE_URL = 'http://localhost:8000';

export const parsePipelineAPI = async (nodes, edges) => {
  const payload = {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    })),
  };

  const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
