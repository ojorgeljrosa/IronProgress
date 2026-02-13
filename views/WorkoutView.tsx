
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, ChevronRight, ChevronLeft, Plus, Timer as TimerIcon, Trophy } from 'lucide-react';
import { TrainingPlan, Exercise, WorkoutSession, RecordedExercise, RecordedSet } from '../types';
import { storageService } from '../services/storageService';
import { calculateExerciseVolume, calculatePossibleVolume, calculateEfficiency, getPerformanceColor } from '../utils/workoutUtils';
import Timer from '../components/Timer';
import WorkoutSummary from './WorkoutSummary';

const WorkoutView: React.FC = () => {
  const [plans] = useState<TrainingPlan[]>(storageService.getPlans());
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Auto-detect day
  useEffect(() => {
    if (!activeSession) {
      const today = new Date().getDay();
      const plan = plans.find(p => p.dayOfWeek === today);
      if (plan && plan.exercises.length > 0) {
        // Just pre-selecting, user needs to hit start
      }
    }
  }, [plans, activeSession]);

  const startWorkout = (plan: TrainingPlan) => {
    const session: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      trainingPlanId: plan.id,
      date: new Date().toISOString(),
      exercises: plan.exercises.map(ex => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.primaryMuscle,
        sets: []
      })),
      isCompleted: false
    };
    setActiveSession(session);
    setCurrentExIdx(0);
    setCompleted(false);
  };

  const handleRecordSet = (reps: number, load: number) => {
    if (!activeSession) return;
    const newSession = { ...activeSession };
    newSession.exercises[currentExIdx].sets.push({ reps, load });
    setActiveSession(newSession);
    setIsResting(true);
  };

  const finishWorkout = () => {
    if (!activeSession) return;
    const finalSession = { ...activeSession, isCompleted: true };
    storageService.saveSession(finalSession);
    setCompleted(true);
  };

  if (completed && activeSession) {
    return <WorkoutSummary session={activeSession} onDone={() => setActiveSession(null)} />;
  }

  if (!activeSession) {
    const today = new Date().getDay();
    const todayPlan = plans.find(p => p.dayOfWeek === today);

    return (
      <div className="p-4 max-w-xl mx-auto space-y-6">
        <h2 className="text-3xl font-black text-center mt-8 tracking-tighter">PRONTO PARA O TREINO?</h2>
        
        {todayPlan ? (
          <div className="bg-slate-800 border-2 border-emerald-500/30 p-6 rounded-3xl shadow-xl">
             <div className="text-emerald-400 font-bold text-sm uppercase mb-2">Treino de Hoje</div>
             <h3 className="text-2xl font-bold mb-4">{todayPlan.name}</h3>
             <div className="space-y-2 mb-6">
                {todayPlan.exercises.slice(0, 4).map(ex => (
                  <div key={ex.id} className="flex items-center gap-2 text-slate-400 text-sm">
                    <CheckCircle2 size={14} /> {ex.name}
                  </div>
                ))}
                {todayPlan.exercises.length > 4 && <div className="text-slate-500 text-xs">+ {todayPlan.exercises.length - 4} mais</div>}
             </div>
             <button 
               onClick={() => startWorkout(todayPlan)}
               className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
             >
               <Play fill="currentColor" /> INICIAR TREINO
             </button>
          </div>
        ) : (
          <div className="text-center p-8 bg-slate-800 rounded-3xl border border-slate-700">
            <p className="text-slate-400">Nenhum treino programado para hoje.</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase px-2">Outros Treinos</p>
          {plans.filter(p => p.dayOfWeek !== today).map(p => (
            <button 
              key={p.id}
              onClick={() => startWorkout(p)}
              className="w-full bg-slate-800/50 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center transition-colors"
            >
              <div className="text-left">
                <div className="text-lg font-bold">{p.name}</div>
                <div className="text-xs text-slate-500 uppercase">{p.exercises.length} exercícios</div>
              </div>
              <ChevronRight className="text-slate-600" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentExercise = plans.find(p => p.id === activeSession.trainingPlanId)?.exercises[currentExIdx];
  const recordedEx = activeSession.exercises[currentExIdx];
  
  if (!currentExercise) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] p-4 max-w-xl mx-auto">
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Exercício {currentExIdx + 1} de {activeSession.exercises.length}</span>
          <span className="text-xs font-bold text-blue-400 uppercase">{currentExercise.primaryMuscle}</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight leading-tight">{currentExercise.name}</h2>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-700">
           <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${((currentExIdx + (recordedEx.sets.length / currentExercise.plannedSets)) / activeSession.exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-4">
        {isResting ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold text-slate-300">Descanso</h3>
            <Timer 
              initialSeconds={currentExercise.restSeconds} 
              onComplete={() => setIsResting(false)} 
            />
            <button 
              onClick={() => setIsResting(false)}
              className="text-slate-400 font-bold underline underline-offset-4"
            >
              Pular Descanso
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sets Tracker */}
            <div className="grid grid-cols-1 gap-3">
              {recordedEx.sets.map((set, idx) => (
                <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex justify-between items-center animate-in slide-in-from-left-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-400 text-xs">
                      {idx + 1}
                    </div>
                    <div className="text-lg font-bold">
                      {set.reps} <span className="text-slate-500 font-normal">reps</span> × {set.load} <span className="text-slate-500 font-normal">kg</span>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-mono font-bold">
                    {set.reps * set.load} <span className="text-[10px] text-slate-500">KG·VOL</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <SetInputForm 
              defaultReps={currentExercise.plannedReps}
              defaultLoad={currentExercise.targetLoad}
              onRecord={handleRecordSet}
              isExtraSet={recordedEx.sets.length >= currentExercise.plannedSets}
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-800 flex gap-4">
        <button 
          onClick={() => setCurrentExIdx(prev => Math.max(0, prev - 1))}
          disabled={currentExIdx === 0}
          className="p-4 bg-slate-800 rounded-2xl disabled:opacity-30"
        >
          <ChevronLeft />
        </button>

        {recordedEx.sets.length >= currentExercise.plannedSets && !isResting ? (
          currentExIdx < activeSession.exercises.length - 1 ? (
            <button 
              onClick={() => { setCurrentExIdx(prev => prev + 1); setIsResting(false); }}
              className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              PRÓXIMO EXERCÍCIO <ChevronRight />
            </button>
          ) : (
            <button 
              onClick={finishWorkout}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              ENCERRAR TREINO <Trophy />
            </button>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 font-medium italic">
            Complete as séries planejadas...
          </div>
        )}
      </div>
    </div>
  );
};

const SetInputForm: React.FC<{ 
  defaultReps: number; 
  defaultLoad: number; 
  onRecord: (reps: number, load: number) => void;
  isExtraSet: boolean;
}> = ({ defaultReps, defaultLoad, onRecord, isExtraSet }) => {
  const [reps, setReps] = useState(defaultReps);
  const [load, setLoad] = useState(defaultLoad);

  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{isExtraSet ? 'Série Extra' : 'Registrar Série'}</h3>
        <div className="flex gap-1">
          {[1, 2, 5].map(v => (
             <button key={v} onClick={() => setLoad(l => Math.max(0, l + v))} className="bg-slate-700 text-[10px] font-bold px-2 py-1 rounded hover:bg-slate-600">+{v}</button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center block">Carga (kg)</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setLoad(Math.max(0, load - 1))} className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold">-</button>
            <input 
              type="number" 
              value={load} 
              onChange={e => setLoad(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent text-3xl font-black text-center text-emerald-400 outline-none" 
            />
            <button onClick={() => setLoad(load + 1)} className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold">+</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center block">Repetições</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setReps(Math.max(0, reps - 1))} className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold">-</button>
            <input 
              type="number" 
              value={reps} 
              onChange={e => setReps(parseInt(e.target.value) || 0)}
              className="w-full bg-transparent text-3xl font-black text-center text-slate-100 outline-none" 
            />
            <button onClick={() => setReps(reps + 1)} className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold">+</button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onRecord(reps, load)}
        className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
      >
        REGISTRAR SÉRIE <CheckCircle2 size={24} />
      </button>
    </div>
  );
};

export default WorkoutView;
