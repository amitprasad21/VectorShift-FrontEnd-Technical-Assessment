import { checkIsDAG } from './graphValidation';

export const validateEdgeConnection = (connection, existingEdges, nodes) => {
  if (connection.source === connection.target) {
    return { isValid: false, error: 'A node cannot connect to itself.' };
  }

  const isDuplicate = existingEdges.some(
    (e) =>
      e.source === connection.source &&
      e.sourceHandle === connection.sourceHandle &&
      e.target === connection.target &&
      e.targetHandle === connection.targetHandle
  );
  if (isDuplicate) {
    return { isValid: false, error: 'This connection already exists.' };
  }

  const mockEdges = [...existingEdges, {
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
  }];
  if (!checkIsDAG(nodes, mockEdges)) {
    return { isValid: false, error: 'This would create a circular dependency.' };
  }

  return { isValid: true };
};
