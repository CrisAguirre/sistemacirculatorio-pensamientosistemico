import { api } from './apiClient';

export const authApi = {
  register: (data) => api('/auth/register', { method: 'POST', body: data }),
  login: (data) => api('/auth/login', { method: 'POST', body: data }),
  profile: () => api('/auth/profile'),
};
