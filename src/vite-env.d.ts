/// <reference types="vite/client" />
declare module 'virtual:review-content' { const issues: (typeof import('./content/week-1.json'))[]; export default issues; }
