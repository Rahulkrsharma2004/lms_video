// src/types.ts
export interface AssessmentData {
    type: 'multiple-choice' | 'short-answer';
    question: string;
    options?: string[];
    correctAnswer?: number;
  }
  
  export interface VideoData {
    id: number;
    title: string;
    videoUrl: string;
    assessment: AssessmentData;
  }
  
  export interface AssessmentProps {
    type: 'multiple-choice' | 'short-answer';
    question: string;
    options?: string[];
    correctAnswer?: number;
    onComplete: (isCorrect: boolean) => void;
  }
  