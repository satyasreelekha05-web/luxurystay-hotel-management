import API from './api';

export const sendChatMessage = (message) => API.post('/ai/chat', { message });
export const getRecommendations = (data) => API.post('/ai/recommend', data);
export const getReviewSummary = (reviews) => API.post('/ai/review-summary', { reviews });
