import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
const reviewing=process.argv.includes('--review');
const output=reviewing?'.local-review/build':'docs';
const destination=reviewing?'.local-review/preview':'preview';
const root = new URL("../", import.meta.url);
const read = p => readFileSync(new URL(p, root), "utf8");
const assets = Object.fromEntries(readdirSync(new URL("public/assets/", root)).filter(n=>n.endsWith(".svg")).map(n=>[n.slice(0,-4),"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(read("public/assets/"+n))]));
if(reviewing)for(const n of readdirSync(new URL('.local-review/assets/',root)).filter(n=>n.endsWith('.svg')))assets[n.slice(0,-4)]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(read('.local-review/assets/'+n));
let html=read(output+'/index.html');
html=html.replace(/<link rel="manifest"[^>]*>/,"");
html=html.replace(/href="\.\/assets\/logo.svg"/,()=> 'href="'+assets.logo+'"');
html=html.replace(/<link[^>]+href="([^"]+\.css)"[^>]*>/g,(_,p)=>"<style>"+read(output+"/"+p)+"</style>");
function inlineCode(p){
 let code=read(output+'/'+p);
 for(const folder of ['assets','story-scenes'])for(const n of readdirSync(new URL(output+'/'+folder+'/',root))){
  if(!/\.(svg|jpg|png|webp)$/.test(n))continue;
  const mime=n.endsWith('.svg')?'image/svg+xml':n.endsWith('.jpg')?'image/jpeg':'image/'+n.split('.').at(-1);
  const uri='data:'+mime+';base64,'+readFileSync(new URL(output+'/'+folder+'/'+n,root)).toString('base64');
  for(const path of ['./'+folder+'/'+n,folder+'/'+n])code=code.replaceAll(JSON.stringify(path),JSON.stringify(uri));
  code=code.replaceAll('new URL('+JSON.stringify(n)+',import.meta.url).href',JSON.stringify(uri));
 }
 const earth='data:image/jpeg;base64,'+readFileSync(new URL(output+'/earth-nasa.jpg',root)).toString('base64');
 code=code.replaceAll('"earth-nasa.jpg"',JSON.stringify(earth)).replaceAll('"./earth-nasa.jpg"',JSON.stringify(earth));
 return code.replaceAll('</script','<\\/script');
}
html=html.replace(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g,(_,p)=>'<script>window.explorerAssets='+JSON.stringify(assets).replaceAll("<","\\u003c")+';</script><script type="module">'+inlineCode(p)+"</script>");
mkdirSync(new URL(destination+"/",root),{recursive:true});
writeFileSync(new URL(destination+"/standalone.html",root),html);
writeFileSync(new URL(destination+"/THIRD-PARTY-NOTICES.txt",root),read("public/THIRD-PARTY-NOTICES.txt"));
console.log('Created '+destination+'/standalone.html (all illustrations and code included)');
