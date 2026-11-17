import type {
  User, Topic, StudySet, Quiz, Question, QuestionOption, Flashcard,
  Collection, QuizAttempt, XpTransaction, Achievement, DailyChallenge,
  DocumentRecord, Visibility, ContentStatus,
} from "@/types";

// In-memory store shared across requests in a single Node process.
const g = globalThis as any;
if (!g.__qwizoStore) {
  g.__qwizoStore = {
    users: new Map<string, User>(),
    topics: new Map<string, Topic>(),
    studySets: new Map<string, StudySet>(),
    quizzes: new Map<string, Quiz>(),
    questions: new Map<string, Question>(),
    flashcards: new Map<string, Flashcard>(),
    collections: new Map<string, Collection>(),
    attempts: new Map<string, QuizAttempt>(),
    xp: new Map<string, XpTransaction[]>(),
    achievements: new Map<string, Achievement>(),
    userAchievements: new Map<string, string[]>(),
    dailyChallenges: new Map<string, DailyChallenge>(),
    dailyCompletions: new Map<string, Set<string>>(),
    documents: new Map<string, DocumentRecord>(),
    bookmarks: new Map<string, Set<string>>(), // userId -> set of studySetIds
  };
}
const store = g.__qwizoStore;

export const db = store;

// ---------- seed ----------
function seed() {
  if (store.topics.size > 0) return;
  const topics: Topic[] = [
    { id: "t-js", name: "JavaScript", slug: "javascript", description: "JS fundamentals" },
    { id: "t-react", name: "React", slug: "react", description: "React & hooks" },
    { id: "t-html", name: "HTML & CSS", slug: "html-css", description: "Web basics" },
    { id: "t-science", name: "Science", slug: "science", description: "General science" },
    { id: "t-history", name: "History", slug: "history", description: "World history" },
    { id: "t-lang", name: "Languages", slug: "languages", description: "Language learning" },
  ];
  topics.forEach((t) => store.topics.set(t.id, t));

  const achievements: Achievement[] = [
    { id: "a-first-quiz", name: "First Steps", description: "Complete your first quiz", criteria: "complete_quiz:1" },
    { id: "a-streak-3", name: "On Fire", description: "Reach a 3-day streak", criteria: "streak:3" },
    { id: "a-creator", name: "Creator", description: "Publish your first study set", criteria: "publish:1" },
  ];
  achievements.forEach((a) => store.achievements.set(a.id, a));

  // demo user
  const demo: User = {
    id: "u-demo", username: "demo", displayName: "Demo Learner",
    bio: "Exploring Qwizo", interests: ["t-js", "t-react"], xp: 120, streak: 2, createdAt: new Date().toISOString(),
  };
  store.users.set(demo.id, demo);

  // demo study set
  const ssId = "ss-demo-js";
  const quizId = "q-demo-js";
  const questions: Question[] = [
    {
      id: "qn1", quizId, text: "Which keyword declares a block-scoped variable in JavaScript?", type: "multiple_choice",
      options: [
        { id: "o1", text: "var", isCorrect: false },
        { id: "o2", text: "let", isCorrect: true },
        { id: "o3", text: "function", isCorrect: false },
        { id: "o4", text: "class", isCorrect: false },
      ],
      explanation: "`let` (and `const`) are block-scoped, unlike `var` which is function-scoped.",
      position: 0,
    },
    {
      id: "qn2", quizId, text: "JavaScript is a statically typed language.", type: "true_false",
      options: [
        { id: "o5", text: "True", isCorrect: false },
        { id: "o6", text: "False", isCorrect: true },
      ],
      explanation: "JavaScript is dynamically typed.",
      position: 1,
    },
    {
      id: "qn3", quizId, text: "What does `===` check?", type: "multiple_choice",
      options: [
        { id: "o7", text: "Value only", isCorrect: false },
        { id: "o8", text: "Value and type", isCorrect: true },
        { id: "o9", text: "Reference equality", isCorrect: false },
      ],
      explanation: "Strict equality compares both value and type without coercion.",
      position: 2,
    },
  ];
  questions.forEach((q) => store.questions.set(q.id, q));
  const quiz: Quiz = {
    id: quizId, studySetId: ssId, title: "JavaScript Basics", description: "Core JS concepts",
    difficulty: "easy", questions, createdAt: new Date().toISOString(),
  };
  store.quizzes.set(quiz.id, quiz);
  const ss: StudySet = {
    id: ssId, creatorId: demo.id, title: "JavaScript Fundamentals", description: "Starter JS quiz set",
    topicId: "t-js", visibility: "public", status: "published", quizzes: [quiz], flashcards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  store.studySets.set(ss.id, ss);

  // daily challenge
  const today = new Date().toISOString().slice(0, 10);
  store.dailyChallenges.set("dc-" + today, {
    id: "dc-" + today, title: "Daily Challenge: JavaScript", description: "Complete today's JS quiz", date: today, quizId,
  });
}
seed();

// ---------- users ----------
export function getUser(id: string) { return store.users.get(id); }
export function getUserByUsername(u: string) { return [...store.users.values()].find((x) => x.username === u); }
export function createUser(data: Partial<User> & { id: string; username: string; displayName: string }) {
  const u: User = {
    id: data.id, username: data.username, displayName: data.displayName,
    avatarUrl: data.avatarUrl, bio: data.bio, interests: data.interests || [],
    xp: 0, streak: 0, createdAt: new Date().toISOString(),
  };
  store.users.set(u.id, u);
  return u;
}
export function updateUser(id: string, patch: Partial<User>) {
  const u = store.users.get(id); if (!u) return null;
  const next = { ...u, ...patch }; store.users.set(id, next); return next;
}
export function listUsers() { return [...store.users.values()]; }

// ---------- topics ----------
export function listTopics() { return [...store.topics.values()]; }
export function getTopic(id: string) { return store.topics.get(id); }

// ---------- study sets ----------
export function getStudySet(id: string) { return store.studySets.get(id); }
export function listStudySets(filter?: { visibility?: Visibility; creatorId?: string; topicId?: string; status?: ContentStatus }) {
  let items = [...store.studySets.values()];
  if (filter?.visibility) items = items.filter((s) => s.visibility === filter.visibility);
  if (filter?.creatorId) items = items.filter((s) => s.creatorId === filter.creatorId);
  if (filter?.topicId) items = items.filter((s) => s.topicId === filter.topicId);
  if (filter?.status) items = items.filter((s) => s.status === filter.status);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function searchStudySets(q: string) {
  const lower = q.toLowerCase();
  return [...store.studySets.values()].filter((s) =>
    s.visibility === "public" && (s.title.toLowerCase().includes(lower) || (s.description || "").toLowerCase().includes(lower))
  );
}
export function createStudySet(data: Omit<StudySet, "id" | "createdAt" | "updatedAt" | "quizzes" | "flashcards"> & { quizzes?: Quiz[]; flashcards?: Flashcard[] }) {
  const id = "ss-" + Math.random().toString(36).slice(2, 10);
  const now = new Date().toISOString();
  const ss: StudySet = {
    id, creatorId: data.creatorId, title: data.title, description: data.description,
    topicId: data.topicId, visibility: data.visibility, status: data.status,
    quizzes: data.quizzes || [], flashcards: data.flashcards || [], createdAt: now, updatedAt: now,
  };
  store.studySets.set(id, ss);
  (ss.quizzes || []).forEach((q) => store.quizzes.set(q.id, q));
  (ss.quizzes || []).forEach((q) => q.questions.forEach((qn) => store.questions.set(qn.id, qn)));
  (ss.flashcards || []).forEach((f) => store.flashcards.set(f.id, f));
  return ss;
}
export function updateStudySet(id: string, patch: Partial<StudySet>) {
  const ss = store.studySets.get(id); if (!ss) return null;
  const next = { ...ss, ...patch, updatedAt: new Date().toISOString() };
  store.studySets.set(id, next);
  return next;
}
export function deleteStudySet(id: string) {
  const ss = store.studySets.get(id); if (!ss) return false;
  ss.quizzes.forEach((q: any) => { q.questions.forEach((qn: any) => store.questions.delete(qn.id)); store.quizzes.delete(q.id); });
  ss.flashcards.forEach((f: any) => store.flashcards.delete(f.id));
  store.studySets.delete(id);
  return true;
}

// ---------- quizzes ----------
export function getQuiz(id: string) {
  const q = store.quizzes.get(id);
  if (!q) return null;
  // attach questions from store
  const questions = [...store.questions.values()].filter((qn) => qn.quizId === id).sort((a, b) => a.position - b.position);
  return { ...q, questions: questions.length ? questions : q.questions };
}
export function createQuiz(data: Omit<Quiz, "id" | "createdAt" | "questions"> & { questions?: Question[] }) {
  const id = "q-" + Math.random().toString(36).slice(2, 10);
  const questions = (data.questions || []).map((qn: any, i: number) => ({ ...qn, id: qn.id || "qn-" + Math.random().toString(36).slice(2, 8), quizId: id, position: i }));
  const q: Quiz = { id, studySetId: data.studySetId, title: data.title, description: data.description, difficulty: data.difficulty, questions, createdAt: new Date().toISOString() };
  store.quizzes.set(id, q);
  questions.forEach((qn) => store.questions.set(qn.id, qn));
  return q;
}

// ---------- attempts (scoring server-side) ----------
export function createAttempt(userId: string, quizId: string, submitted: { questionId: string; selectedOptionId: string | null }[]) {
  const quiz = getQuiz(quizId);
  if (!quiz) throw new Error("Quiz not found");
  const answers = submitted.map((s) => {
    const qn = quiz.questions.find((q: any) => q.id === s.questionId);
    const opt = qn?.options.find((o: any) => o.id === s.selectedOptionId);
    const isCorrect = !!opt && opt.isCorrect;
    return { questionId: s.questionId, selectedOptionId: s.selectedOptionId, isCorrect };
  });
  const score = answers.filter((a) => a.isCorrect).length;
  const attempt: QuizAttempt = {
    id: "att-" + Math.random().toString(36).slice(2, 10),
    userId, quizId, answers, score, total: quiz.questions.length,
    completedAt: new Date().toISOString(),
  };
  store.attempts.set(attempt.id, attempt);
  // XP: 10 per correct, +20 completion bonus
  const xpAmount = score * 10 + 20;
  addXp(userId, xpAmount, "quiz_complete", attempt.id);
  updateUserStats(userId);
  return attempt;
}
export function getAttempt(id: string) { return store.attempts.get(id); }
export function listAttemptsByUser(userId: string) { return [...store.attempts.values()].filter((a) => a.userId === userId); }
export function listAttemptsByQuiz(quizId: string) { return [...store.attempts.values()].filter((a) => a.quizId === quizId); }

// ---------- xp ----------
export function addXp(userId: string, amount: number, reason: string, referenceId?: string) {
  const tx: XpTransaction = { id: "xp-" + Math.random().toString(36).slice(2, 8), userId, amount, reason, referenceId, createdAt: new Date().toISOString() };
  const list = store.xp.get(userId) || [];
  list.push(tx);
  store.xp.set(userId, list);
  const u = store.users.get(userId);
  if (u) { u.xp += amount; store.users.set(userId, u); }
  return tx;
}
export function getXpHistory(userId: string) { return store.xp.get(userId) || []; }
export function getLeaderboard(limit = 20) {
  return [...store.users.values()].sort((a, b) => b.xp - a.xp).slice(0, limit);
}

// ---------- collections ----------
export function getCollection(id: string) { return store.collections.get(id); }
export function listCollections(filter?: { ownerId?: string; visibility?: Visibility }) {
  let items = [...store.collections.values()];
  if (filter?.ownerId) items = items.filter((c) => c.ownerId === filter.ownerId);
  if (filter?.visibility) items = items.filter((c) => c.visibility === filter.visibility);
  return items;
}
export function createCollection(data: Omit<Collection, "id" | "createdAt" | "items"> & { items?: Collection["items"] }) {
  const id = "col-" + Math.random().toString(36).slice(2, 10);
  const c: Collection = { id, ownerId: data.ownerId, title: data.title, description: data.description, visibility: data.visibility, items: data.items || [], createdAt: new Date().toISOString() };
  store.collections.set(id, c);
  return c;
}
export function updateCollection(id: string, patch: Partial<Collection>) {
  const c = store.collections.get(id); if (!c) return null;
  const next = { ...c, ...patch }; store.collections.set(id, next); return next;
}

// ---------- bookmarks ----------
export function toggleBookmark(userId: string, studySetId: string) {
  const set = store.bookmarks.get(userId) || new Set<string>();
  if (set.has(studySetId)) set.delete(studySetId); else set.add(studySetId);
  store.bookmarks.set(userId, set);
  return set.has(studySetId);
}
export function isBookmarked(userId: string, studySetId: string) {
  return store.bookmarks.get(userId)?.has(studySetId) || false;
}
export function listBookmarks(userId: string) { return [...(store.bookmarks.get(userId) || new Set())]; }

// ---------- documents ----------
export function createDocument(data: Omit<DocumentRecord, "id" | "createdAt">) {
  const id = "doc-" + Math.random().toString(36).slice(2, 10);
  const d: DocumentRecord = { ...data, id, createdAt: new Date().toISOString() };
  store.documents.set(id, d);
  return d;
}
export function getDocument(id: string) { return store.documents.get(id); }
export function updateDocument(id: string, patch: Partial<DocumentRecord>) {
  const d = store.documents.get(id); if (!d) return null;
  const next = { ...d, ...patch }; store.documents.set(id, next); return next;
}
export function listDocumentsByUser(userId: string) { return [...store.documents.values()].filter((d) => d.userId === userId); }

// ---------- daily challenges ----------
export function getDailyChallenge(date?: string) {
  const d = date || new Date().toISOString().slice(0, 10);
  let c = store.dailyChallenges.get("dc-" + d);
  if (!c) {
    // reuse any
    c = [...store.dailyChallenges.values()][0];
  }
  return c || null;
}
export function completeDailyChallenge(challengeId: string, userId: string) {
  const set = store.dailyCompletions.get(challengeId) || new Set<string>();
  const already = set.has(userId);
  if (!already) { set.add(userId); store.dailyCompletions.set(challengeId, set); addXp(userId, 30, "daily_challenge", challengeId); }
  return { already, completed: true };
}
export function isDailyCompleted(challengeId: string, userId: string) {
  return store.dailyCompletions.get(challengeId)?.has(userId) || false;
}

// ---------- progress stats ----------
export function updateUserStats(userId: string) {
  const u = store.users.get(userId); if (!u) return;
  // streak: simple increment if not already today (mock)
  u.streak = Math.min(u.streak + 0, u.streak);
  store.users.set(userId, u);
}
export function getUserProgress(userId: string) {
  const attempts = listAttemptsByUser(userId);
  const totalQ = attempts.reduce((a, b) => a + b.total, 0);
  const correct = attempts.reduce((a, b) => a + b.score, 0);
  const accuracy = totalQ ? Math.round((correct / totalQ) * 100) : 0;
  return { attempts: attempts.length, totalQuestions: totalQ, correct, accuracy, xp: store.users.get(userId)?.xp || 0, streak: store.users.get(userId)?.streak || 0 };
}

// ---------- achievements ----------
export function checkAchievements(userId: string) {
  const u = store.users.get(userId); if (!u) return [];
  const unlocked = store.userAchievements.get(userId) || [];
  const newly: string[] = [];
  const attempts = listAttemptsByUser(userId);
  if (attempts.length >= 1 && !unlocked.includes("a-first-quiz")) { newly.push("a-first-quiz"); }
  if (u.streak >= 3 && !unlocked.includes("a-streak-3")) { newly.push("a-streak-3"); }
  const published = listStudySets({ creatorId: userId, status: "published" });
  if (published.length >= 1 && !unlocked.includes("a-creator")) { newly.push("a-creator"); }
  if (newly.length) {
    store.userAchievements.set(userId, [...unlocked, ...newly]);
    newly.forEach((id) => {
      const a = store.achievements.get(id);
      if (a) addXp(userId, 25, "achievement", id);
    });
  }
  return newly.map((id) => store.achievements.get(id)!);
}
export function getUserAchievements(userId: string) {
  return (store.userAchievements.get(userId) || []).map((id: string) => store.achievements.get(id)).filter(Boolean) as Achievement[];
}
export function listAchievements() { return [...store.achievements.values()]; }

// keep seed idempotent
export { seed as ensureSeed };
seed();

