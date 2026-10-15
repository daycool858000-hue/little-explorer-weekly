import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {validatePlanet} from '../scripts/planet-validation.mjs';
test('published planet sources require release authorization and cannot ship draft records',()=>{assert.deepEqual(validatePlanet(),{remade:16,stories:16,junior:4,uniqueIds:36})});
test('production bundle excludes private week five and preserves distributed licenses',()=>{
 const files=fs.readdirSync('docs/assets').filter(n=>n.endsWith('.js'));assert.ok(files.length);const bundle=files.map(n=>fs.readFileSync('docs/assets/'+n,'utf8')).join('');
 for(const forbidden of ['friends-apart','when-everyone-laughs','認識自己，也認識別人'])assert.ok(!bundle.includes(forbidden),'私人內容不可進入 build');
 assert.ok(fs.existsSync('docs/THIRD-PARTY-NOTICES.txt'));
 for(const key of ['explorer-magazine-v1','explorer-challenge-v1','explorer-speech-v1'])assert.ok(bundle.includes(key));
 assert.doesNotMatch(bundle,/AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/);
});
