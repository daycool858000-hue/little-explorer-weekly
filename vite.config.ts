import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { validateProject, validateIssues, loadIssues } from './scripts/content-validation.mjs';
export default defineConfig(({ mode }) => {
  const reviewing = mode === 'review', folder = '.local-review';
  return {
    plugins: [react(), {
      name: 'content-release-boundary',
      buildStart() {
        validateProject();
        if (reviewing && existsSync(folder)) validateIssues([...loadIssues('src/content'), ...loadIssues(folder)], 'magazine', n => existsSync(folder + '/assets/' + n + '.svg') || existsSync('public/assets/' + n + '.svg'), { draft: true });
      },
      resolveId(id) { if (id === 'virtual:review-content') return '\0review-content'; },
      load(id) {
        if (id !== '\0review-content') return;
        const drafts = reviewing && existsSync(folder) ? readdirSync(folder).filter(n => /^week-\d+\.json$/.test(n)).map(n => JSON.parse(readFileSync(folder + '/' + n, 'utf8'))) : [];
        return 'export default ' + JSON.stringify(drafts);
      },
      generateBundle() {
        if (reviewing && existsSync(folder + '/assets')) for (const n of readdirSync(folder + '/assets')) {
          if (!/^[a-z0-9-]+\.svg$/.test(n)) throw Error('審閱素材檔名不符規範');
          this.emitFile({ type: 'asset', fileName: 'assets/' + n, source: readFileSync(folder + '/assets/' + n) });
        }
      },
    }],
    base: './', build: { outDir: reviewing ? '.local-review/build' : 'docs', emptyOutDir: true },
  };
});

