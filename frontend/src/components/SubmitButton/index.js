import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useStore } from '../../store';
import { checkIsDAG } from '../../utils/graphValidation';
import { parsePipelineAPI } from '../../services/api';
import './styles.css';

export const SubmitButton = () => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const closeBtnRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false, status: 'success', title: '', description: '',
    numNodes: 0, numEdges: 0, isDag: true, isLocalFallback: false,
  });

  const closeModal = () => setModalState((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    if (modalState.isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [modalState.isOpen]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape' && modalState.isOpen) closeModal(); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalState.isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nodes.length === 0) {
      setModalState({
        isOpen: true, status: 'warning', title: 'Empty Canvas',
        description: 'Add some nodes to your pipeline before submitting.',
        numNodes: 0, numEdges: 0, isDag: true, isLocalFallback: false,
      });
      return;
    }

    setIsLoading(true);
    const clientIsDag = checkIsDAG(nodes, edges);

    try {
      const data = await parsePipelineAPI(nodes, edges);

      alert(`Pipeline Analysis:\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nDAG: ${data.is_dag ? 'Valid' : 'Invalid (cycles detected)'}`);

      setModalState({
        isOpen: true,
        status: data.is_dag ? 'success' : 'warning',
        title: data.is_dag ? 'Pipeline Valid' : 'Pipeline Contains Cycles',
        description: data.is_dag
          ? 'Your workflow forms a valid Directed Acyclic Graph.'
          : 'Your workflow contains circular paths that must be resolved.',
        numNodes: data.num_nodes, numEdges: data.num_edges, isDag: data.is_dag, isLocalFallback: false,
      });
    } catch {
      alert(`Pipeline Analysis (Local):\n\nNodes: ${nodes.length}\nEdges: ${edges.length}\nDAG: ${clientIsDag ? 'Valid' : 'Invalid (cycles detected)'}\n\nBackend offline.`);

      setModalState({
        isOpen: true,
        status: clientIsDag ? 'success' : 'warning',
        title: clientIsDag ? 'Valid (Local)' : 'Contains Cycles (Local)',
        description: clientIsDag
          ? 'Validated locally — backend is offline.'
          : 'Local validation found cycles — backend is offline.',
        numNodes: nodes.length, numEdges: edges.length, isDag: clientIsDag, isLocalFallback: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { isOpen, status, title, description, numNodes, numEdges, isDag } = modalState;

  return (
    <div className="submit-container">
      <button onClick={handleSubmit} disabled={isLoading} className="btn-primary btn-submit" aria-label="Submit Pipeline">
        {isLoading ? (
          <><span className="spinner" /><span>Analyzing...</span></>
        ) : (
          <><Send size={16} /><span>Submit Pipeline</span></>
        )}
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-label="Pipeline results">
          <div className={`modal-content glass-panel ${status}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-status-icon">
              {status === 'success' && <CheckCircle2 size={28} />}
              {status === 'warning' && <AlertTriangle size={28} />}
              {status === 'error' && <XCircle size={28} />}
            </div>

            <h2 className="modal-title">{title}</h2>
            <p className="modal-description">{description}</p>

            <div className="modal-stats">
              <div className="stat-card">
                <span className="stat-val">{numNodes}</span>
                <span className="stat-label">Nodes</span>
              </div>
              <div className="stat-card">
                <span className="stat-val">{numEdges}</span>
                <span className="stat-label">Edges</span>
              </div>
            </div>

            <div className={`dag-badge ${isDag ? 'dag-valid' : 'dag-invalid'}`}>
              <span>DAG: {isDag ? 'VALID' : 'INVALID (Cycles)'}</span>
            </div>

            <button ref={closeBtnRef} onClick={closeModal} className="modal-btn-close">
              Back to Canvas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitButton;
