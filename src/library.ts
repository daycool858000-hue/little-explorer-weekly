import type template from "./content/week-1.json";
const files = import.meta.glob<{default: typeof template}>("./content/week-*.json", {eager: true});
export const issues = Object.values(files).map(f => f.default).sort((a,b) => a.number - b.number);
export const articles = issues.flatMap(i => i.articles);

