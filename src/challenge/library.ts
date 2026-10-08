import type { Issue } from './types';
const files = import.meta.glob<{ default: Issue }>('../content/challenge/week-*.json', { eager: true });
export const challengeIssues = Object.values(files).map(file => file.default).sort((a, b) => a.number - b.number);
