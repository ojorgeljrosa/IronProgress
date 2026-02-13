
import { Exercise, RecordedExercise, RecordedSet } from '../types';

export const calculateExerciseVolume = (sets: RecordedSet[]): number => {
  return sets.reduce((total, set) => total + (set.reps * set.load), 0);
};

export const calculatePossibleVolume = (exercise: Exercise): number => {
  return exercise.plannedSets * exercise.plannedReps * exercise.targetLoad;
};

export const calculateEfficiency = (real: number, possible: number): number => {
  if (possible === 0) return 0;
  return (real / possible) * 100;
};

export const getPerformanceColor = (efficiency: number): string => {
  return efficiency >= 92 ? 'text-green-400' : 'text-red-400';
};

export const getPerformanceBg = (efficiency: number): string => {
  return efficiency >= 92 ? 'bg-green-500/20' : 'bg-red-500/20';
};
