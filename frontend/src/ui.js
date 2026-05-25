import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { nodeTypes, getDefaultData } from './nodes/registry';
import { AlertCircle } from 'lucide-react';
import 'reactflow/dist/style.css';

const gridSize = 16;

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const getNodeID = useStore((s) => s.getNodeID);
  const addNode = useStore((s) => s.addNode);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleConnect = useCallback((connection) => {
    const result = onConnect(connection);
    if (result && !result.isValid) {
      setToast({ show: true, message: result.error });
      setTimeout(() => setToast({ show: false, message: '' }), 4000);
    }
  }, [onConnect]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    if (!reactFlowWrapper.current || !reactFlowInstance) return;

    const raw = event.dataTransfer.getData('application/reactflow');
    if (!raw) return;

    try {
      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: getDefaultData(nodeID, type) });
    } catch (err) {
      console.error('Drop failed:', err);
    }
  }, [reactFlowInstance, addNode, getNodeID]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="canvas-container" ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: 'var(--color-primary)', strokeWidth: 2 }}
        minZoom={0.2}
        maxZoom={1.5}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#6366f1" gap={gridSize} size={1.5} style={{ opacity: 0.15 }} />
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable />
      </ReactFlow>

      {toast.show && (
        <div className="pipeline-toast error" role="alert" aria-live="assertive">
          <AlertCircle size={18} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
