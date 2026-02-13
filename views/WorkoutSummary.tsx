
import React from 'react';
import { Trophy, ArrowLeft, ArrowUpRight, ArrowDownRight, Minus, Target } from 'lucide-react';
import { WorkoutSession, Exercise } from '../types';
import { storageService } from '../services/storageService';
import { calculateExerciseVolume, calculatePossibleVolume, calculateEfficiency, getPerformanceColor, getPerformanceBg } from '../utils/workoutUtils';

interface SummaryProps {
  session: WorkoutSession;
  onDone: () => void;
}

const WorkoutSummary: React.FC<SummaryProps> = ({ session, onDone }) => {
  const plans = storageService.getPlans();
  const plan = plans.find(p => p.id === session.trainingPlanId);
  const lastSession = storageService.getLastSessionForPlan(session.trainingPlanId);

  const totalVolume = session.exercises.reduce((sum, ex) => sum + calculateExerciseVolume(ex.sets), 0);
  const totalPossible = plan?.exercises.reduce((sum, ex) => sum + calculatePossibleVolume(ex), 0) || 0;
  const globalEfficiency = calculateEfficiency(totalVolume, totalPossible);

  const lastVolume = lastSession ? lastSession.exercises.reduce((sum, ex) => sum + calculateExerciseVolume(ex.sets), 0) : 0;
  const volumeProgression = lastVolume > 0 ? (totalVolume / lastVolume) * 100 : 100;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-2 mt-8">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/20 text-emerald-400 rounded-full mb-4">
           <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Treino Finalizado!</h2>
        <p className="text-slate-400">Excelente trabalho. Confira sua performance hoje.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Volume Total</div>
          <div className="text-3xl font-black text-emerald-400">{totalVolume.toLocaleString()} <span className="text-sm font-normal text-slate-500">kg</span></div>
          {lastVolume > 0 && (
            <div className={`text-xs font-bold mt-2 flex items-center gap-1 ${volumeProgression >= 100 ? 'text-blue-400' : 'text-red-400'}`}>
              {volumeProgression >= 100 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {volumeProgression.toFixed(1)}% vs último
            </div>
          )}
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Eficiência</div>
          <div className={`text-3xl font-black ${getPerformanceColor(globalEfficiency)}`}>{globalEfficiency.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500 mt-2 font-medium">Meta: {totalPossible.toLocaleString()} kg</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-xl px-2 uppercase tracking-tight">Detalhes por Exercício</h3>
        {session.exercises.map((recordedEx, idx) => {
          const exPlan = plan?.exercises.find(e => e.id === recordedEx.exerciseId);
          const realVol = calculateExerciseVolume(recordedEx.sets);
          const possVol = exPlan ? calculatePossibleVolume(exPlan) : 0;
          const eff = calculateEfficiency(realVol, possVol);
          
          return (
            <div key={idx} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">{recordedEx.exerciseName}</div>
                <div className="text-xs text-slate-500">{recordedEx.sets.length} séries realizadas</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-black ${getPerformanceColor(eff)}`}>{eff.toFixed(0)}%</div>
                <div className="text-[10px] font-mono text-slate-400">{realVol}kg</div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onDone}
        className="w-full py-4 bg-slate-800 border border-slate-700 rounded-2xl font-black text-lg flex items-center justify-center gap-2"
      >
        <ArrowLeft size={20} /> VOLTAR AO INÍCIO
      </button>
    </div>
  );
};

export default WorkoutSummary;
