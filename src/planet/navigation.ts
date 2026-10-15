const key='question-planet-return-context';
export function canonicalHash(hash:string){return hash==='#library/life'||hash==='#topic/feelings'?'#life':hash||'#'}
function readingId(href:string){const p=href.split('/');return p[0]==='#archive'&&p[1]==='read'?'archive:'+p[2]:['#read','#junior','#advanced','#stories'].includes(p[0])?p[1]:null}
export function rememberReadingOrigin(href:string,from:string){const id=readingId(href);if(!id||readingId(from))return;try{sessionStorage.setItem(key,JSON.stringify({id,from:canonicalHash(from)}))}catch{/* 仍可返回預設目錄 */}}
export function readerReturn(id:string,fallback:string){try{const x=JSON.parse(sessionStorage.getItem(key)||'null');if(x?.id===id&&typeof x.from==='string'&&/^#(?:life(?:\?|$)|topic\/|grades\/|junior$|stories$|catalog$|saved$|search$|issue\/|library$)/.test(x.from))return x.from}catch{/* 保留閱讀 */}return fallback}
export function captureReadingOrigin(event:{target:EventTarget|null},from:string){const target=event.target as Element|null;const href=target?.closest('a')?.getAttribute('href');if(href?.startsWith('#'))rememberReadingOrigin(href,from)}
