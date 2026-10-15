import { validatePhase5 } from './scripts/phase5-validation.mjs';
import { defineConfig } from 'vite';
import { validatePlanet } from './scripts/planet-validation.mjs';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { validateProject, validateIssues, loadIssues } from './scripts/content-validation.mjs';
export default defineConfig(({ mode }) => {
  const reviewing = mode === 'review', phase5 = mode === 'phase5', folder = '.local-review';
  return {
    plugins: [react(), {
      name: 'content-release-boundary',
      buildStart() {
        validateProject();
        validatePhase5('src/planet/phase5',false);
        if (phase5) validatePhase5();
        validatePlanet();
        if (reviewing && existsSync(folder)) validateIssues([...loadIssues('src/content'), ...loadIssues(folder)], 'magazine', n => existsSync(folder + '/assets/' + n + '.svg') || existsSync('public/assets/' + n + '.svg'), { draft: true });
      },
      resolveId(id) { if(id === 'virtual:review-visuals') return '\0review-visuals'; if(id === 'virtual:phase5-readings') return '\0phase5-readings'; if (id === 'virtual:review-content') return '\0review-content'; },
      load(id) {
        if(id === '\0review-visuals'){
          const file=phase5?'.local-review/phase5-images6/visuals.json':'src/planet/reading-visuals.json';
          const entries=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
          return 'export default '+JSON.stringify({enabled:true,entries});
        }
        if(id === '\0phase5-readings'){ const root=phase5?'.local-review/phase5':'src/planet/phase5'; const read=(kind:string)=>existsSync(root+'/'+kind)?readdirSync(root+'/'+kind).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync(root+'/'+kind+'/'+n,'utf8'))):[]; return 'export default '+JSON.stringify({privateReview:phase5,junior:read('junior'),advanced:read('advanced'),middle:read('middle')}); }
        if (id !== '\0review-content') return;
        const drafts = reviewing && existsSync(folder) ? readdirSync(folder).filter(n => /^week-\d+\.json$/.test(n)).map(n => JSON.parse(readFileSync(folder + '/' + n, 'utf8'))) : [];
        return 'export default ' + JSON.stringify(drafts);
      },
      generateBundle() {
        const file=phase5?'.local-review/phase5-images6/visuals.json':'src/planet/reading-visuals.json';
        if(phase5&&existsSync(file)){
          const entries=Object.values(JSON.parse(readFileSync(file,'utf8'))) as {src:string}[];
          for(const src of new Set(entries.map(e=>e.src))){
            if(!/^review-media\/[a-z0-9-]+\.jpg$/.test(src))throw Error('私人圖片路徑不符規範');
            this.emitFile({type:'asset',fileName:src,source:readFileSync('.local-review/phase5-images6/assets/'+src.split('/')[1])});
          }
        }
        if (reviewing && existsSync(folder + '/assets')) for (const n of readdirSync(folder + '/assets')) {
          if (!/^[a-z0-9-]+\.svg$/.test(n)) throw Error('審閱素材檔名不符規範');
          this.emitFile({ type: 'asset', fileName: 'assets/' + n, source: readFileSync(folder + '/assets/' + n) });
        }
      },
    }],
    base: './', build: { outDir: phase5 ? '.local-review/phase5/build' : reviewing ? '.local-review/build' : 'docs', emptyOutDir: true },
  };
});

