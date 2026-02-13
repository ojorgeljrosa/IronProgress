
import React, { useState } from 'react';
import { Dumbbell, Settings, BarChart3, ListChecks } from 'lucide-react';
import WorkoutView from './views/WorkoutView';
import SetupView from './views/SetupView';
import DashboardView from './views/DashboardView';

type Tab = 'workout' | 'setup' | 'dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('workout');

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/20">
            <Dumbbell size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">IronProgress</h1>
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'workout' && <WorkoutView />}
        {activeTab === 'setup' && <SetupView />}
        {activeTab === 'dashboard' && <DashboardView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-slate-900 border-t border-slate-800 px-6 py-4 pb-8 md:pb-6 flex justify-around items-center z-10 shadow-2xl">
        <NavButton 
          active={activeTab === 'workout'} 
          onClick={() => setActiveTab('workout')} 
          icon={<Dumbbell />} 
          label="Treinar" 
        />
        <NavButton 
          active={activeTab === 'setup'} 
          onClick={() => setActiveTab('setup')} 
          icon={<Settings />} 
          label="Ajustes" 
        />
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<BarChart3 />} 
          label="Análise" 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <div className={`${active ? 'bg-emerald-400/10 p-2 rounded-xl' : ''}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: active ? 3 : 2 })}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default App;
