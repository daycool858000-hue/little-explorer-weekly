import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL, browser=await chromium.launch();
const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
try{
 await p.goto(base+'#junior/junior-seed');
 await p.getByRole('button',{name:'收藏這篇',exact:true}).click();
 await p.getByRole('button',{name:'注音：開',exact:true}).click();
 await p.getByRole('button',{name:'完成閱讀',exact:true}).click();
 await p.reload();
 await p.getByRole('button',{name:'已收藏 ✓',exact:true}).waitFor();
 await p.getByRole('button',{name:'注音：關',exact:true}).waitFor();
 await p.getByRole('button',{name:'已完成閱讀 ✓',exact:true}).waitFor();
 await p.goto(base+'#saved');
 assert.ok(await p.locator('a[href="#junior/junior-seed"]').count());
 await p.goto(base+'#junior/junior-seed');
 const lab=p.locator('#seed-lab');await lab.scrollIntoViewIfNeeded();
 assert.equal(await lab.getByRole('checkbox').isChecked(),false);
 await lab.getByRole('button',{name:'開始觀察',exact:true}).click();
 for(let i=0;i<2;i++)await lab.getByRole('button',{name:'觀察下一步',exact:true}).click();
 assert.ok((await lab.innerText()).includes('4 / 4'));
 await lab.getByRole('button',{name:'重新觀察',exact:true}).click();
 await lab.getByRole('radio').nth(1).check();
 await lab.getByRole('button',{name:'開始觀察',exact:true}).click();
 assert.ok((await lab.innerText()).includes('氧氣'));
 await p.goto(base+'#library/review');
 await p.getByRole('button',{name:'開始知識回顧',exact:true}).click();
 const questions=JSON.parse(fs.readFileSync('src/planet/knowledge-review.json')),seen=new Set();
 for(let i=0;i<24;i++){
  const prompt=await p.locator('.recall-card h2').innerText(),q=questions.find(q=>q.prompt===prompt);assert.ok(q);assert.ok(!seen.has(q.id));seen.add(q.id);
  await p.locator('.recall-options button').nth((q.answer+1)%q.options.length).click();
  await p.getByRole('button',{name:'再試一次',exact:true}).click();
  await p.locator('.recall-options button').nth(q.answer).click();
  assert.ok((await p.locator('.recall-feedback').innerText()).includes(q.explanation));
  assert.equal(await p.getByRole('link',{name:'回原文章找線索 →'}).getAttribute('href'),q.articleHref);
  await p.getByRole('button',{name:'換下一題',exact:true}).click();
 }
 console.log('passed: saved/reload/zhuyin/completion, seed static/restart/water, all 24 recall/retry/source links');
}finally{await browser.close()}
