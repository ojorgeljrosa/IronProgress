// Fix: Added RecordedExercise to the imports to resolve the "Cannot find name 'RecordedExercise'" error on line 43
import { TrainingPlan, WorkoutSession, RecordedExercise } from '../types';
import { DEFAULT_PLANS } from '../constants';

const KEYS = {
  PLANS: 'ironprogress_plans',
  SESSIONS: 'ironprogress_sessions',
};

export const storageService = {
  getPlans: (): TrainingPlan[] => {
    const data = localStorage.getItem(KEYS.PLANS);
    return data ? JSON.parse(data) : DEFAULT_PLANS;
  },

  savePlans: (plans: TrainingPlan[]) => {
    localStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
  },

  getSessions: (): WorkoutSession[] => {
    const data = localStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveSession: (session: WorkoutSession) => {
    const sessions = storageService.getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index > -1) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getLastSessionForPlan: (planId: string): WorkoutSession | undefined => {
    const sessions = storageService.getSessions();
    return sessions
      .filter(s => s.trainingPlanId === planId && s.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  },

  getLastSessionForExercise: (exerciseId: string): RecordedExercise | undefined => {
     const sessions = storageService.getSessions();
     for (const session of sessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())) {
        const found = session.exercises.find(e => e.exerciseId === exerciseId);
        if (found) return found;
     }
     return undefined;
  }
};