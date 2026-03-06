import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center px-10 sticky top-0 z-10">
            <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">Home</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium tracking-tight">{title}</span>
            </div>
        </header>
    );
};

export default Header;
