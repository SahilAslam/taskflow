// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

// ─── Board ───────────────────────────────────────────────────────────────────
export interface BoardMember {
  user: User;
  role: 'owner' | 'admin' | 'member';
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  background: string;
  owner: User;
  members: BoardMember[];
  isStarred: boolean;
  visibility: 'private' | 'workspace' | 'public';
  createdAt: string;
  updatedAt: string;
}

// ─── List ────────────────────────────────────────────────────────────────────
export interface List {
  _id: string;
  title: string;
  boardId: string;
  position: number;
  color?: string;
  cards?: Card[];
  createdAt: string;
}

// ─── Card ────────────────────────────────────────────────────────────────────
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface Label {
  text: string;
  color: string;
}

export interface ChecklistItem {
  _id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  _id: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Attachment {
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Card {
  _id: string;
  title: string;
  description: string;
  listId: string;
  boardId: string;
  position: number;
  priority: Priority;
  labels: Label[];
  dueDate?: string;
  checklist: ChecklistItem[];
  assignees: User[];
  attachments: Attachment[];
  comments: Comment[];
  coverColor?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Activity ────────────────────────────────────────────────────────────────
export interface Activity {
  _id: string;
  boardId: string;
  userId: User;
  action: string;
  entityType: 'board' | 'list' | 'card' | 'comment';
  entityId: string;
  entityTitle: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  totalBoards: number;
  totalCards: number;
  completedCards: number;
  pendingCards: number;
  overdueCards: number;
  cardsByPriority: { _id: Priority; count: number }[];
  dailyActivity: { _id: string; count: number }[];
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
}
