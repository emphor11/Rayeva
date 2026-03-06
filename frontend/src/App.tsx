import { useState } from 'react';
import Layout from './components/layout/Layout';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './views/Dashboard';
import ProductAI from './views/ProductAI';
import ProposalAI from './views/ProposalAI';
import AILogs from './views/AILogs';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'product-ai': return <ProductAI />;
      case 'proposal-ai': return <ProposalAI />;
      case 'logs': return <AILogs />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Layout activeTab={activeTab}>
        {renderContent()}
      </Layout>
    </div>
  );
}

export default App;
