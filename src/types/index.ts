export type Visibility = "public" | "private" | "unlisted";
export type ContentStatus = "draft" | "published";

export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  xp: number;
  streak: number;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  explanation?: string;
  position: number;
}

export interface Quiz {
  id: string;
  studySetId: string;
  title: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  createdAt: string;
}

export interface StudySet {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  topicId?: string;
  visibility: Visibility;
  status: ContentStatus;
  quizzes: Quiz[];
  flashcards: Flashcard[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  studySetId: string;
  front: string;
  back: string;
  position: number;
}

export interface Collection {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  visibility: Visibility;
  items: { contentType: "study_set" | "quiz"; contentId: string }[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: { questionId: string; selectedOptionId: string | null; isCorrect: boolean }[];
  score: number;
  total: number;
  completedAt: string;
}

export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  referenceId?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  date: string;
  quizId?: string;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  title: string;
  fileType: string;
  storagePath: string;
  processingStatus: "uploaded" | "processing" | "ready" | "failed";
  extractedText?: string;
  createdAt: string;
}

