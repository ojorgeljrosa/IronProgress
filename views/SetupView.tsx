
import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, Save } from 'lucide-react';
import { TrainingPlan, Exercise, MuscleGroup } from '../types';
import { storageService } from '../services/storageService';
import { DAYS_PT, MUSCLE_GROUPS } from '../constants';

const SetupView: React.FC = () => {
  const [plans, setPlans] = useState<TrainingPlan[]>(storageService.getPlans());
  const [expandedDay, setExpandedDay] = useState<number | null>(new Date().getDay() || 1);

  const handleAddExercise = (dayIdx: number) => {
    const newPlans = [...plans];
    const newExercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Exercício',
      plannedSets: 3,
      plannedReps: 12,
      restSeconds: 60,
      primaryMuscle: MuscleGroup.PeitoMedio,
      targetLoad: 0
    };
    newPlans[dayIdx].exercises.push(newExercise);
    setPlans(newPlans);
  };

  const handleUpdateExercise = (dayIdx: number, exIdx: number, updates: Partial<Exercise>) => {
    const newPlans = [...plans];
    newPlans[dayIdx].exercises[exIdx] = { ...newPlans[dayIdx].exercises[exIdx], ...updates };
    setPlans(newPlans);
  };

  const handleRemoveExercise = (dayIdx: number, exIdx: number) => {
    const newPlans = [...plans];
    newPlans[dayIdx].exercises.splice(exIdx, 1);
    setPlans(newPlans);
  };

  const saveAll = () => {
    storageService.savePlans(plans);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Configurar Treinos</h2>
        <button 
          onClick={saveAll}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
        >
          <Save size={20} /> Salvar Tudo
        </button>
      </div>

      <div className="space-y-4">
        {plans.map((plan, dayIdx) => (
          <div key={plan.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
              className="w-full flex justify-between items-center p-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="text-left">
                <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{DAYS_PT[plan.dayOfWeek]}</span>
                <h3 className="text-lg font-bold">{plan.name || 'Treino não nomeado'}</h3>
              </div>
              {expandedDay === dayIdx ? <ChevronDown /> : <ChevronRight />}
            </button>

            {expandedDay === dayIdx && (
              <div className="p-4 border-t border-slate-700 bg-slate-900/40">
                <div className="mb-4">
                   <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome do Treino</label>
                   <input 
                    type="text" 
                    value={plan.name}
                    onChange={(e) => {
                      const newPlans = [...plans];
                      newPlans[dayIdx].name = e.target.value;
                      setPlans(newPlans);
                    }}
                    placeholder="Ex: Push / Pull / Legs"
                    className="bg-slate-800 border border-slate-700 rounded-lg p-2 w-full text-slate-200"
                  />
                </div>

                <div className="space-y-4">
                  {plan.exercises.map((ex, exIdx) => (
                    <div key={ex.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative group">
                      <button 
                        onClick={() => handleRemoveExercise(dayIdx, exIdx)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome do Exercício</label>
                          <input 
                            type="text" 
                            value={ex.name}
                            onChange={(e) => handleUpdateExercise(dayIdx, exIdx, { name: e.target.value })}
                            className="bg-slate-700 border border-slate-600 rounded p-2 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Grupo Muscular</label>
                          <select 
                            value={ex.primaryMuscle}
                            onChange={(e) => handleUpdateExercise(dayIdx, exIdx, { primaryMuscle: e.target.value as MuscleGroup })}
                            className="bg-slate-700 border border-slate-600 rounded p-2 w-full"
                          >
                            {MUSCLE_GROUPS.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Séries</label>
                          <input 
                            type="number" 
                            value={ex.plannedSets}
                            onChange={(e) => handleUpdateExercise(dayIdx, exIdx, { plannedSets: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border border-slate-600 rounded p-2 w-full text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Reps</label>
                          <input 
                            type="number" 
                            value={ex.plannedReps}
                            onChange={(e) => handleUpdateExercise(dayIdx, exIdx, { plannedReps: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border border-slate-600 rounded p-2 w-full text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Carga (kg)</label>
                          <input 
                            type="number" 
                            value={ex.targetLoad}
                            onChange={(e) => handleUpdateExercise(dayIdx, exIdx, { targetLoad: parseFloat(e.target.value) || 0 })}
                            className="bg-slate-700 border border-slate-600 rounded p-2 w-full text-center text-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Descanso (s)</label>
                          <input 
                            type="number" 
                            value={ex.restSeconds}
                            onChange={(e) => handleUpdateExercise(dayIdx, exIdx, { restSeconds: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border border-slate-600 rounded p-2 w-full text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => handleAddExercise(dayIdx)}
                    className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-emerald-600/50 hover:bg-emerald-600/5 text-slate-400 hover:text-emerald-400 rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus size={20} /> Adicionar Exercício
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupView;
