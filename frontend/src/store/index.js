import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { validateEdgeConnection } from '../utils/edgeValidation';

export const useStore = create(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      nodeIDs: {},
      history: [],
      future: [],

      getNodeID: (type) => {
        const newIDs = { ...get().nodeIDs };
        if (newIDs[type] === undefined) newIDs[type] = 0;
        newIDs[type] += 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
      },

      snapshot: () => {
        const { nodes, edges } = get();
        set((state) => ({
          history: [...state.history.slice(-50), { nodes, edges }],
          future: [],
        }));
      },

      undo: () => {
        const { history, nodes, edges } = get();
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        set({
          history: history.slice(0, -1),
          future: [{ nodes, edges }, ...get().future.slice(0, 50)],
          nodes: prev.nodes,
          edges: prev.edges,
        });
      },

      redo: () => {
        const { future, nodes, edges } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          history: [...get().history, { nodes, edges }],
          future: future.slice(1),
          nodes: next.nodes,
          edges: next.edges,
        });
      },

      addNode: (node) => {
        get().snapshot();
        set({ nodes: [...get().nodes, node] });
      },

      removeNode: (nodeId) => {
        get().snapshot();
        set({
          nodes: get().nodes.filter((n) => n.id !== nodeId),
          edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        });
      },

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        const validation = validateEdgeConnection(connection, get().edges, get().nodes);
        if (!validation.isValid) return validation;

        get().snapshot();
        const newEdge = {
          ...connection,
          id: `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'var(--color-edge)', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: 'var(--color-edge-arrow)',
          },
        };
        set({ edges: addEdge(newEdge, get().edges) });
        return { isValid: true };
      },

      updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
              : node
          ),
        });
      },

      updateDynamicHandles: (nodeId, variables) => {
        const prefix = `${nodeId}-param-`;
        const activeHandleIds = new Set(variables.map((v) => `${prefix}${v}`));
        set({
          edges: get().edges.filter((edge) => {
            if (edge.target === nodeId && edge.targetHandle?.startsWith(prefix)) {
              return activeHandleIds.has(edge.targetHandle);
            }
            return true;
          }),
        });
      },
    }),
    {
      name: 'pipeline-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        nodeIDs: state.nodeIDs,
      }),
    }
  )
);
