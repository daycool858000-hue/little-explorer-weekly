export type Visual = { title: string; headers: string[]; rows: string[][]; bars?: boolean; note?: string };
export type Step = {
  id: string; kind: 'read' | 'choice' | 'number' | 'select' | 'order' | 'estimate' | 'reflect';
  title: string; text: string; prompt: string; options?: string[]; answer?: number | number[];
  unit?: string; hints: string[]; explanation: string; replies?: string[]; visual?: Visual;
};
export type Unit = { id: string; category: string; title: string; description: string; visual?: Visual; skills: string[]; takeaways: string[]; steps: Step[] };
export type Issue = { id: string; number: number; title: string; description: string; units: Unit[] };
export type Response = { value: string; selected: number[]; attempts: number; hints: number; status: 'idle' | 'retry' | 'passed' | 'revealed' };
export type UnitProgress = { step: number; completed: boolean; responses: Record<string, Response> };
export type Progress = { version: 1; last: { week: string; unit: string } | null; units: Record<string, UnitProgress> };
