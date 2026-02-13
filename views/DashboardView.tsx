
import React, { useMemo, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, AreaChart, Area
} from 'recharts';
import { Calendar, TrendingUp, Target, BarChart3, Filter } from 'lucide-react';
import { storageService } from '../services/storageService';
import { calculateExerciseVolume, calculatePossibleVolume, calculateEfficiency } from '../utils/workoutUtils';
import { MuscleGroup } from '../types';

const DashboardView: React.FC = () => {
  const sessions = storageService.getSessions().filter(s => s.isCompleted);
  const plans = storageService.getPlans();
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'TODOS'>('TODOS');

  const volumeHistory = useMemo(() => {
    return sessions.map(s => {
      const vol = s.exercises.reduce((acc, ex) => acc + calculateExerciseVolume(ex.sets), 0);
      return {
        date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        volume: vol,
        fullDate: s.date
      };
    }).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [sessions]);

  const muscleVolumes = useMemo(() => {
    const data: Record<string, number> = {};
    sessions.forEach(s => {
      s.exercises.forEach(ex => {
        data[ex.muscleGroup] = (data[ex.muscleGroup] || 0) + calculateExerciseVolume(ex.sets);
      });
    });
    return Object.entries(data)
      .map(([name, volume]) => ({ name, volume }))
      .sort((a, b) => b.volume - a.volume);
  }, [sessions]);

  const stats = useMemo(() => {
    const totalV = volumeHistory.reduce((acc, v) => acc + v.volume, 0);
    const avgV = volumeHistory.length ? totalV / volumeHistory.length : 0;
    const lastV = volumeHistory.length ? volumeHistory[volumeHistory.length - 1].volume : 0;
    const prevV = volumeHistory.length > 1 ? volumeHistory[volumeHistory.length - 2].volume : 0;
    const trend = prevV ? ((lastV - prevV) / prevV) * 100 : 0;

    return { totalV, avgV, lastV, trend };
  }, [volumeHistory]);

  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="flex justify-center text-slate-700"><BarChart3 size={80} /></div>
        <h3 className="text-xl font-bold text-slate-400">Nenhum treino concluído ainda.</h3>
        <p className="text-slate-500">Conclua seu primeiro treino para visualizar as estatísticas aqui!</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Analytics</h2>
          <p className="text-slate-400 text-sm">Acompanhe sua evolução</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-lg text-slate-400 flex items-center gap-2">
           <Calendar size={16} /> Últimos 30 dias
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Volume Total" value={`${(stats.totalV / 1000).toFixed(1)}t`} sub="Acumulado" />
        <StatCard label="Média/Treino" value={`${(stats.avgV / 1000).toFixed(1)}t`} sub="Consistência" />
        <StatCard label="Último Treino" value={`${(stats.lastV / 1000).toFixed(1)}t`} sub={`${stats.trend > 0 ? '+' : ''}${stats.trend.toFixed(1)}%`} trend={stats.trend} />
        <StatCard label="Frequência" value={sessions.length.toString()} sub="Treinos" />
      </div>

      {/* Volume Chart */}
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
        <h3 className="font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-emerald-400" size={20} /> Evolução de Volume (kg)</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeHistory}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Muscle Group Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
           <h3 className="font-bold mb-4 flex items-center gap-2"><Target className="text-blue-400" size={20} /> Volume por Músculo</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={muscleVolumes} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                  />
                  <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Filter className="text-slate-400" size={20} /> Top Exercícios</h3>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {sessions.flatMap(s => s.exercises)
              .reduce((acc: any[], curr) => {
                const existing = acc.find(a => a.name === curr.exerciseName);
                const vol = calculateExerciseVolume(curr.sets);
                if (existing) {
                  existing.volume += vol;
                  existing.count += 1;
                } else {
                  acc.push({ name: curr.exerciseName, volume: vol, count: 1 });
                }
                return acc;
              }, [])
              .sort((a, b) => b.volume - a.volume)
              .slice(0, 6)
              .map((ex, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                  <div>
                    <div className="text-sm font-bold">{ex.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{ex.count} execuções</div>
                  </div>
                  <div className="text-emerald-400 font-mono font-bold">{(ex.volume / 1000).toFixed(1)}k</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, subText?: string, sub?: string, trend?: number }> = ({ label, value, sub, trend }) => (
  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black">{value}</div>
    <div className={`text-[10px] font-bold mt-1 ${trend !== undefined ? (trend > 0 ? 'text-emerald-400' : 'text-red-400') : 'text-slate-500'}`}>
      {sub}
    </div>
  </div>
);

export default DashboardView;
