
import { MuscleGroup, TrainingPlan } from './types';

export const DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const MUSCLE_GROUPS = Object.values(MuscleGroup);

export const DEFAULT_PLANS: TrainingPlan[] = [
  { id: '1', dayOfWeek: 1, name: 'Peito e Tríceps', exercises: [] },
  { id: '2', dayOfWeek: 2, name: 'Costas e Bíceps', exercises: [] },
  { id: '3', dayOfWeek: 3, name: 'Pernas', exercises: [] },
  { id: '4', dayOfWeek: 4, name: 'Ombros', exercises: [] },
  { id: '5', dayOfWeek: 5, name: 'Superiores (Foco)', exercises: [] },
  { id: '6', dayOfWeek: 6, name: 'Pernas (Foco)', exercises: [] },
];
