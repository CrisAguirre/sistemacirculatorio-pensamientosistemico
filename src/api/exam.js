import { api } from './apiClient';

// Evaluaciones (contenido a construir desde cero).
export const examApi = {
  getBySimulation: (id) => api(`/exams/${id}`),
  submit: (id, data) => api(`/exams/${id}/submit`, { method: 'POST', body: data }),
};
