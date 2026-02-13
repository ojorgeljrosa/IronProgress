
export enum MuscleGroup {
  PeitoSuperior = 'Peito Superior',
  PeitoInferior = 'Peito Inferior',
  PeitoMedio = 'Peito Médio',
  CostasTrapezio = 'Costas Trapézio',
  CostasDorsal = 'Costas Dorsal',
  OmbroAnterior = 'Ombro Anterior',
  OmbroLateral = 'Ombro Lateral',
  OmbroPosterior = 'Ombro Posterior',
  Biceps = 'Bíceps',
  Triceps = 'Tríceps',
  Quadriceps = 'Quadríceps',
  PosteriorCoxa = 'Posterior Coxa',
  Panturrilha = 'Panturrilha',
  Gluteos = 'Glúteos',
  Abdomen = 'Abdômen'
}

export interface Exercise {
  id: string;
  name: string;
  plannedSets: number;
  plannedReps: number;
  restSeconds: number;
  primaryMuscle: MuscleGroup;
  secondaryMuscle?: MuscleGroup;
  targetLoad: number; // For volume possible calculation
}

export interface TrainingPlan {
  id: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc. (0 and 7 handled as rest/optional)
  name: string;
  exercises: Exercise[];
}

export interface RecordedSet {
  reps: number;
  load: number;
}

export interface RecordedExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: RecordedSet[];
}

export interface WorkoutSession {
  id: string;
  trainingPlanId: string;
  date: string;
  exercises: RecordedExercise[];
  isCompleted: boolean;
}

export interface AnalyticsData {
  date: string;
  totalVolume: number;
  efficiency: number;
}
