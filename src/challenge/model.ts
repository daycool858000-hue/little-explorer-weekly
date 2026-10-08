import type { Issue, Progress, Response, Step, UnitProgress } from './types.ts';
export const STORAGE_KEY = 'explorer-challenge-v1';
export const emptyResponse = (): Response => ({value: '', selected: [], attempts: 0, hints: 0, status: 'idle'});
export const emptyProgress = (): Progress => ({version: 1, last: null, units: {}});
export const passed = (response?: Response) => response?.status === 'passed' || response?.status === 'revealed';
export function numericValue(value: string): number | null {
  const normalized = value.trim().replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 65248)).replace(/．/g, '.');
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const n = Number(normalized); return Number.isFinite(n) ? n : null;
}
export function isCorrect(step: Step, response: Response): boolean {
  if (step.kind === 'read') return true;
  if (step.kind === 'reflect' || step.kind === 'estimate') return response.selected.length === 1;
  if (step.kind === 'number') { const n = numericValue(response.value); return n !== null && typeof step.answer === 'number' && Math.abs(n - step.answer) < 0.000001; }
  if (Array.isArray(step.answer)) {
    const actual = step.kind === 'order' ? response.selected : [...response.selected].sort((a,b) => a-b);
    const expected = step.kind === 'order' ? step.answer : [...step.answer].sort((a,b) => a-b);
    return actual.length === expected.length && actual.every((n,i) => n === expected[i]);
  }
  return response.selected.length === 1 && response.selected[0] === step.answer;
}
export function hasAnswer(step: Step, response: Response): boolean {
  if (step.kind === 'read') return true;
  if (step.kind === 'number') return numericValue(response.value) !== null;
  if (step.kind === 'order') return response.selected.length === step.options?.length;
  return response.selected.length > 0;
}
const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const bounded = (value: unknown, max: number) => typeof value === 'number' && Number.isInteger(value) ? Math.max(0, Math.min(value, max)) : 0;
export function sanitizeProgress(raw: unknown, issues: Issue[]): Progress {
  const input = record(raw), result = emptyProgress();
  if (input.version !== 1) return result;
  const units = record(input.units);
  for (const issue of issues) for (const unit of issue.units) {
    if (!Object.hasOwn(units, unit.id)) continue;
    const source = record(units[unit.id]), responses = record(source.responses);
    const next: UnitProgress = {step: bounded(source.step, unit.steps.length - 1), completed: false, responses: {}};
    for (const step of unit.steps) {
      const r = record(responses[step.id]), response = emptyResponse();
      response.value = typeof r.value === 'string' ? r.value.slice(0,32) : '';
      response.selected = Array.isArray(r.selected) ? [...new Set(r.selected.filter((v): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < (step.options?.length || 0)))] : [];
      response.attempts = bounded(r.attempts, 2); response.hints = bounded(r.hints, step.hints.length);
      if (r.status === 'revealed' && response.attempts >= 2) response.status = 'revealed';
      else if (r.status === 'passed' && isCorrect(step, response)) response.status = 'passed';
      else if (r.status === 'retry') response.status = 'retry';
      next.responses[step.id] = response;
    }
    next.completed = source.completed === true && unit.steps.every(s => passed(next.responses[s.id]));
    result.units[unit.id] = next;
  }
  const last = record(input.last);
  if (issues.some(i => i.id === last.week && i.units.some(u => u.id === last.unit))) result.last = {week: String(last.week), unit: String(last.unit)};
  return result;
}
export function resolveRoute(hash: string, issues: Issue[], progress: Progress) {
  const [, week, id, rawStep] = hash.split('/');
  if (!week) return {kind: 'home' as const};
  const issue = issues.find(i => i.id === week);
  if (!issue) return {kind: 'missing' as const};
  if (!id) return {kind: 'issue' as const, issue};
  const unit = issue.units.find(u => u.id === id);
  if (!unit) return {kind: 'missing' as const};
  const saved = progress.units[unit.id];
  if (rawStep === 'done' && saved?.completed) return {kind: 'complete' as const, issue, unit};
  const n = rawStep && /^\d+$/.test(rawStep) ? Number(rawStep) - 1 : (saved?.step || 0);
  return {kind: 'task' as const, issue, unit, index: Math.max(0, Math.min(n, unit.steps.length - 1))};
}
