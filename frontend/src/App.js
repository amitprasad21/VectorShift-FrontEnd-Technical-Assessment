import React from 'react';
import { Layout } from './components/Layout';
import { PipelineToolbar } from './components/Toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './components/SubmitButton';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/design-system.css';

function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <PipelineToolbar />
        <PipelineUI />
        <SubmitButton />
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
