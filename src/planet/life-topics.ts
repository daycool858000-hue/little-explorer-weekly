export const lifeDirections=[{id:'self',title:'情緒與自我認識',description:'看見擔心、心情與比較，也認識自己的需要。'},{id:'friendship',title:'友誼與人際互動',description:'面對不同想法，練習聽懂彼此。'},{id:'boundaries',title:'界線與尊重',description:'玩笑、身體與選擇，都需要尊重。'},{id:'responsibility',title:'群體壓力與行為責任',description:'不盲目跟隨，也思考安全、求助與修補。'}];
export const lifeTags:Record<string,{primary:string;tags:string[]}>= {
 'quiet-today':{primary:'self',tags:['情緒與感受','表達需要','求助']},'no-hug-please':{primary:'boundaries',tags:['身體與個人界線','求助']},
 feelings:{primary:'self',tags:['情緒與感受','溝通與表達']},
 'junior-take-turns':{primary:'friendship',tags:['尊重差異']},'junior-anger':{primary:'self',tags:['情緒與感受']},'junior-different-ideas':{primary:'friendship',tags:['人際相處','尊重差異']},'junior-queue':{primary:'responsibility',tags:['選擇與後果']},'junior-say-no':{primary:'boundaries',tags:['身體與個人界線']},
 'advanced-comparison':{primary:'self',tags:['自我認識']},'advanced-anger-brain':{primary:'self',tags:['情緒與感受']},'advanced-majority':{primary:'responsibility',tags:['同儕壓力']},'advanced-responsibility':{primary:'responsibility',tags:['行為責任與後果']},
 'life-worry':{primary:'self',tags:['擔心','求助']},'life-jokes':{primary:'boundaries',tags:['溝通與表達','尊重拒絕']},'life-exclusion':{primary:'responsibility',tags:['排擠','霸凌與求助']},'life-repair':{primary:'responsibility',tags:['修補關係','行為後果']}
};
