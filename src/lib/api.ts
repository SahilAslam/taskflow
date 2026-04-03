import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject token on every request
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    const token = (session as any)?.token || localStorage.getItem('taskflow_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: Partial<{ name: string; bio: string; avatar: string }>) =>
    api.put('/auth/profile', data),
};

// ─── Boards ──────────────────────────────────────────────────────────────────
export const boardsApi = {
  getAll: () => api.get('/boards'),
  create: (data: { title: string; description?: string; background?: string; visibility?: string }) =>
    api.post('/boards', data),
  getOne: (id: string) => api.get(`/boards/${id}`),
  update: (id: string, data: Partial<{ title: string; description: string; background: string; visibility: string }>) =>
    api.put(`/boards/${id}`, data),
  delete: (id: string) => api.delete(`/boards/${id}`),
  star: (id: string) => api.post(`/boards/${id}/star`),
  inviteMember: (id: string, email: string) => api.post(`/boards/${id}/invite`, { email }),
};

// ─── Lists ───────────────────────────────────────────────────────────────────
export const listsApi = {
  create: (data: { title: string; boardId: string }) => api.post('/lists', data),
  update: (id: string, data: Partial<{ title: string; color: string }>) =>
    api.put(`/lists/${id}`, data),
  delete: (id: string) => api.delete(`/lists/${id}`),
  reorder: (boardId: string, listIds: string[]) =>
    api.put('/lists/reorder', { boardId, listIds }),
};

// ─── Cards ───────────────────────────────────────────────────────────────────
export const cardsApi = {
  create: (data: { title: string; listId: string; boardId: string }) =>
    api.post('/cards', data),
  getOne: (id: string) => api.get(`/cards/${id}`),
  update: (id: string, data: Record<string, any>) => api.put(`/cards/${id}`, data),
  delete: (id: string) => api.delete(`/cards/${id}`),
  move: (data: { cardId: string; newListId: string; newPosition: number; boardId: string }) =>
    api.put('/cards/move', data),
  addComment: (id: string, text: string) => api.post(`/cards/${id}/comments`, { text }),
  deleteComment: (id: string, commentId: string) =>
    api.delete(`/cards/${id}/comments/${commentId}`),
  updateChecklist: (id: string, checklist: any[]) =>
    api.put(`/cards/${id}/checklist`, { checklist }),
};

// ─── Activity ────────────────────────────────────────────────────────────────
export const activityApi = {
  getForBoard: (boardId: string, page = 1) =>
    api.get(`/activity/board/${boardId}?page=${page}`),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
