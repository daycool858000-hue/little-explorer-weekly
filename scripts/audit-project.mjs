import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const findings=[];
for(const file of files){
 if(/(?:^|\/)(?:\.env(?:\..*)?|credentials|id_rsa|id_ed25519)$|\.(?:pem|p12|pfx|key)$/i.test(file))findings.push({file,reason:'需要檢查的私人檔名'});
 let text;try{text=readFileSync(file,'utf8');}catch{continue;}
 if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:ghp_|github_pat_|sk-proj-)[A-Za-z0-9_]{25,}|AKIA[A-Z0-9]{16}/.test(text))findings.push({file,reason:'可能的憑證格式（不輸出內容）'});
 if(file.startsWith('.local-review/'))findings.push({file,reason:'私人草稿不應追蹤'});
}
console.log(JSON.stringify({trackedFiles:files.length,findings,note:'限已追蹤檔案與常見憑證格式；不是完整安全或個資審查。'},null,2));
if(findings.length)process.exitCode=1;
