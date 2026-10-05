import React from 'react';
import { Waves, MapPin, FileText, Cpu, Compass, Activity, Database, AlertCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onRunDemo: () => void;
  isProcessingDemo: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onRunDemo,
  isProcessingDemo
}) => {
  return (
    <header className="bg-[#0B192C] text-white border-b border-[#1E3E62] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Ministry Credentials */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded bg-[#1E3E62] border border-[#295F98] flex items-center justify-center text-cyan-400">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-wider text-white">AQUAFORGE</span>
                <span className="bg-[#295F98] text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded text-cyan-100 uppercase">
                  SIH26057
                </span>
              </div>
              <div className="text-[11px] text-gray-300 font-medium">
                MoES &bull; National Institute of Ocean Technology (NIOT) &bull; Team PRAYAS
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-[#1E3E62] text-white'
                  : 'text-gray-300 hover:bg-[#1E3E62]/50 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('surveys')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                currentTab === 'surveys'
                  ? 'bg-[#1E3E62] text-white'
                  : 'text-gray-300 hover:bg-[#1E3E62]/50 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Surveys</span>
            </button>

            <button
              onClick={() => onTabChange('map')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                currentTab === 'map'
                  ? 'bg-[#1E3E62] text-white'
                  : 'text-gray-300 hover:bg-[#1E3E62]/50 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>GIS Map</span>
            </button>

            <button
              onClick={() => onTabChange('reports')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                currentTab === 'reports'
                  ? 'bg-[#1E3E62] text-white'
                  : 'text-gray-300 hover:bg-[#1E3E62]/50 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => onTabChange('models')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                currentTab === 'models'
                  ? 'bg-[#1E3E62] text-white'
                  : 'text-gray-300 hover:bg-[#1E3E62]/50 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Models & Data</span>
            </button>
          </nav>

          {/* Action Button: Run Demo Survey */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onRunDemo}
              disabled={isProcessingDemo}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition shadow-sm ${
                isProcessingDemo
                  ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isProcessingDemo ? 'Executing Pipeline...' : 'Run Demo Survey'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
