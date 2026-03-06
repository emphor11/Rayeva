import React from 'react';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab }) => {
    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard';
            case 'product-ai': return 'Product AI';
            case 'proposal-ai': return 'Proposal AI';
            case 'logs': return 'AI Logs';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden h-screen">
            <Header title={getHeaderTitle()} />
            <main className="flex-1 overflow-y-auto px-12 py-10">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
