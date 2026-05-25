export const checkIsDAG = (nodes, edges) => {
  if (!nodes || nodes.length === 0) return true;

  const adjList = {};
  const inDegree = {};

  nodes.forEach((node) => {
    adjList[node.id] = [];
    inDegree[node.id] = 0;
  });

  edges.forEach((edge) => {
    if (edge.source in adjList && edge.target in adjList) {
      adjList[edge.source].push(edge.target);
      inDegree[edge.target] += 1;
    }
  });

  const queue = [];
  nodes.forEach((node) => {
    if (inDegree[node.id] === 0) queue.push(node.id);
  });

  let processedCount = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    processedCount++;
    for (const neighbor of adjList[node] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }

  return processedCount === nodes.length;
};
