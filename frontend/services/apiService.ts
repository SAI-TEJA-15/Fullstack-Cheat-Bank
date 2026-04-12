import { CheatSheet, User } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}`;

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export interface CreateCheatSheetPayload {
  title: string;
  description: string;
  category: string;
  authorName: string;
  tags: string[];
  content: CheatSheet['content'];
}

export const getToken = (): string | null => {
  return sessionStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

export const getCurrentUserFromStorage = (): User | null => {
  const userJson = sessionStorage.getItem('user');

  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
};

const apiRequest = async <T>(path: string, options: RequestInit = {}, requiresAuth = false): Promise<T> => {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (requiresAuth) {
    const token = getToken();

    if (!token) {
      throw { message: 'Please sign in first.', status: 401 };
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    }

    throw {
      message: data.message || 'Request failed.',
      status: response.status,
    };
  }

  return data as T;
};

export const registerUser = async (formData: RegisterFormData): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const loginUser = async (loginData: LoginFormData): Promise<{ token: string; user: User }> => {
  const response = await apiRequest<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
  });

  sessionStorage.setItem('token', response.token);
  sessionStorage.setItem('user', JSON.stringify(response.user));

  return response;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiRequest<{ user: User }>('/auth/me', { method: 'GET' }, true);
  sessionStorage.setItem('user', JSON.stringify(response.user));
  return response.user;
};

export const fetchApprovedCheatSheets = async (): Promise<CheatSheet[]> => {
  const response = await apiRequest<{ cheatSheets: CheatSheet[] }>('/cheat-sheets', { method: 'GET' });
  return response.cheatSheets;
};

export const fetchPendingCheatSheets = async (): Promise<CheatSheet[]> => {
  const response = await apiRequest<{ cheatSheets: CheatSheet[] }>('/cheat-sheets/pending', { method: 'GET' }, true);
  return response.cheatSheets;
};

export const submitCheatSheet = async (payload: CreateCheatSheetPayload): Promise<{ message: string; cheatSheet: CheatSheet }> => {
  return apiRequest<{ message: string; cheatSheet: CheatSheet }>(
    '/cheat-sheets',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    true
  );
};

export const approveCheatSheet = async (id: number): Promise<{ message: string; cheatSheet: CheatSheet }> => {
  return apiRequest<{ message: string; cheatSheet: CheatSheet }>(
    `/cheat-sheets/${id}/approve`,
    { method: 'POST' },
    true
  );
};

export const rejectCheatSheet = async (id: number): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(
    `/cheat-sheets/${id}/reject`,
    { method: 'POST' },
    true
  );
};

export const incrementView = async (id: number): Promise<void> => {
  await apiRequest<void>(`/cheat-sheets/${id}/view`, { method: 'POST' });
};

export const incrementDownload = async (id: number): Promise<void> => {
  await apiRequest<void>(`/cheat-sheets/${id}/download`, { method: 'POST' });
};
