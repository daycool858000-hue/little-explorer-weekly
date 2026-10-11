import fs from 'node:fs';
const read=kind=>fs.readdirSync('src/planet/'+kind).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(fs.readFileSync('src/planet/'+kind+'/'+n,'utf8')));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
fs.mkdirSync('review',{recursive:true});
for(const kind of ['stories','junior']){
const books=read(kind);let html='<h1>'+ (kind==='stories'?'16 篇故事全文審閱':'一二年級第一期：四篇全文及注音審閱')+'</h1><p>2026-10-10。本次 AI 協助新編；不是第三方故事摘錄，未宣稱教師或教育部審定。朗讀使用裝置語音，沒有預錄音檔。正文、問題、來源均由網站資料直接產生，避免審閱文件與網站不一致。</p>';
let md='# '+(kind==='stories'?'16 篇故事全文審閱':'一二年級第一期：全文與注音審閱')+'\n\n2026-10-10。由正式候選 JSON 直接產生。完整注音請開同名 HTML。\n';
for(const b of books){const render=t=>{if(!b.annotated?.[t])return esc(t);let i=0;return [...t].map(c=>/\p{Script=Han}/u.test(c)?'<ruby>'+esc(c)+'<rt>'+b.annotated[t][i++]+'</rt></ruby>':esc(c)).join('')};
html+='<section><h2>'+render(b.title)+'</h2><p>'+esc(b.id+'｜'+b.grade+'｜'+b.theme)+'</p><img src="../public/'+b.image+'" alt="'+esc(b.imageAlt)+'">'+b.paragraphs.map(p=>'<p class="text">'+render(p)+'</p>').join('');
md+='\n## '+b.title+'\n\n'+b.id+'｜'+b.grade+'｜'+b.theme+'\n\n'+b.paragraphs.join('\n\n')+'\n\n';
const word=Array.isArray(b.word)?b.word.join('：'):b.word+'：'+b.definition;
html+='<h3>詞語／背景</h3><p>'+esc(word)+'</p><h3>閱讀後問題</h3><p>'+render(b.question)+'</p>';
md+='詞語：'+word+'\n\n問題：'+b.question+'\n\n';
if(b.options){html+=b.options.map((o,i)=>'<p>'+String(i+1)+'. '+render(o)+'</p>').join('')+'<p>答案：'+(b.answer+1)+'。'+render(b.explanation)+'</p><h3>生活小活動</h3><p>'+render(b.activity)+'</p>';md+=b.options.map((o,i)=>(i+1)+'. '+o).join('\n')+'\n\n答案：'+(b.answer+1)+'。'+b.explanation+'\n\n生活小活動：'+b.activity+'\n\n';}
else{html+='<p>'+esc(b.thinkingHint)+'</p><p>'+esc(b.fictionNote)+'</p>';md+='思考線索：'+b.thinkingHint+'\n\n事實與虛構：'+b.fictionNote+'\n\n';}
html+='<h3>来源與權利</h3><p>'+esc(JSON.stringify(b.provenance))+'</p>'+b.sources.map(s=>'<p><a href="'+esc(s.url)+'">'+esc(s.title)+'</a>｜'+s.checkedAt+'</p>').join('')+'</section>';
md+='來源：\n'+b.sources.map(s=>'- ['+s.title+']('+s.url+')（'+s.checkedAt+'）').join('\n')+'\n\n';
}
html=html.replaceAll('来源','來源');
fs.writeFileSync('review/'+kind+'.html','<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>問號星球內容審閱</title><style>body{max-width:900px;margin:30px auto;padding:20px;color:#243746;background:#faf9f3;font:20px/1.9 Arial,"Microsoft JhengHei",sans-serif}section{break-before:page;border-top:2px solid #57828a;margin-top:45px;padding-top:25px}img{width:min(600px,100%)}ruby{margin:0 .06em;line-height:3}rt{font-size:.4em}a{overflow-wrap:anywhere}.text{margin:28px 0}@media print{img{max-height:180px;object-fit:contain}}</style>'+html+'</html>');
fs.writeFileSync('review/'+kind+'.md',md);
}
console.log('review/stories.html and review/junior.html generated from all 20 complete readings');
