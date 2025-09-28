// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:3000/api',
  PROJECTS: '/projects',
  DOCUMENTS: '/documents',
  AI: '/ai',
  HEALTH: '/health'
};

// Document Types
export const DOCUMENT_TYPES = {
  PDF: 'pdf',
  WORD: 'word',
  TEXT: 'text'
};

// Project Stages
export const PROJECT_STAGES = {
  PRELIMINARY: 'preliminar',
  ANALYSIS: 'analisis',
  DESIGN: 'diseno'
};

// UI Constants
export const BREAKPOINTS = {
  MOBILE: '768px',
  TABLET: '1024px',
  DESKTOP: '1200px'
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['.pdf', '.doc', '.docx', '.txt']
};