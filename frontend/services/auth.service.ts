import api from './api';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export const authService = {
  /**
   * POST /auth/login — logs in and sets httpOnly cookie
   */
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  /**
   * POST /auth/register — registers and sets httpOnly cookie
   */
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  /**
   * POST /auth/logout — clears the httpOnly cookie
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * GET /auth/me — returns the current authenticated user
   */
  getMe: async (): Promise<AuthUser> => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },
};
