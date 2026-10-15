/// <reference types="vite/client" />
declare module 'virtual:review-content' { const issues: (typeof import('./content/week-1.json'))[]; export default issues; }

declare module 'virtual:phase5-readings' { const data:{privateReview:boolean;junior:import('./planet/reading-data').Reading[];advanced:import('./planet/reading-data').Reading[];middle:(typeof import('./planet/content/week-1.json'))['articles']}; export default data; }
declare module 'virtual:review-visuals' { const data:{enabled:boolean;entries:Record<string,{src:string;alt:string;caption:string;author:string;source:string;license:string;licenseUrl:string;risk:string;type:string;width:number;height:number}>}; export default data; }
