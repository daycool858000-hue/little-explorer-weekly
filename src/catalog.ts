export type Publication = { id: string; number: number; title: string; publishedAt?: string; status?: string };
export function adjacent<T extends Publication>(items: T[], id: string) {
  const sorted = [...items].sort((a, b) => a.number - b.number);
  const index = sorted.findIndex(i => i.id === id);
  return { previous: index > 0 ? sorted[index - 1] : undefined, next: index >= 0 ? sorted[index + 1] : undefined };
}
export function matches(query: string, ...text: unknown[]) {
  const words = query.trim().normalize('NFKC').toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const haystack = text.flat(Infinity).join(' ').normalize('NFKC').toLocaleLowerCase();
  return words.every(word => haystack.includes(word));
}
export const lifeTopics = ['情緒認識', '心情低落與情緒調適', '人際相處與友誼', '身體自主權與界線', '自我認同與外界評價', '同儕壓力與排擠', '霸凌與求助', '尊重別人的選擇', '行為責任與後果'];
