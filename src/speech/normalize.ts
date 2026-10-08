export type SpeechLanguage = 'zh-TW' | 'en-US';
const ones=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function englishInteger(n:number):string {
  if(n<20)return ones[n];
  if(n<100)return tens[Math.floor(n/10)]+(n%10?'-'+ones[n%10]:'');
  for(const [size,name]of [[1e12,'trillion'],[1e9,'billion'],[1e6,'million'],[1000,'thousand'],[100,'hundred']] as const)if(n>=size)return englishInteger(Math.floor(n/size))+' '+name+(n%size?' '+englishInteger(n%size):'');
  return String(n);
}
const digits='零一二三四五六七八九';
function chineseInteger(n:number):string {
  if(n===0)return '零';
  if(n>=1e8)return chineseInteger(Math.floor(n/1e8))+'億'+(n%1e8?(n%1e8<1e7?'零':'')+chineseInteger(n%1e8):'');
  if(n>=10000)return chineseInteger(Math.floor(n/10000))+'萬'+(n%10000?(n%10000<1000?'零':'')+chineseInteger(n%10000):'');
  let result='',zero=false;
  for(const [size,name]of [[1000,'千'],[100,'百'],[10,'十'],[1,'']] as const){const d=Math.floor(n/size);n%=size;if(d){if(zero)result+='零';result+=digits[d]+name;zero=false;}else if(result&&n)zero=true;}
  return result.replace(/^一十/,'十');
}
export function numberWords(value:string,lang:SpeechLanguage,quantity=false):string {
  const clean=value.replaceAll(',',''),negative=clean.startsWith('-'),[whole,fraction]=clean.replace(/^[-+]/,'').split('.');
  const n=Number(whole);if(!Number.isSafeInteger(n)||n<0)return value;
  let result=lang==='en-US'?englishInteger(n):chineseInteger(n);
  if(lang==='zh-TW'&&quantity&&fraction===undefined)result=result.replace(/^二(?=百|千|萬|億|$)/,'兩');
  if(fraction!==undefined)result+=(lang==='en-US'?' point ':'點')+[...fraction].map(d=>lang==='en-US'?ones[Number(d)]:digits[Number(d)]).join(lang==='en-US'?' ':'');
  return (negative?(lang==='en-US'?'minus ':'負'):'')+result;
}
const num='(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?';
const units:Record<string,[string,string,string]>={mL:['毫升','milliliter','milliliters'],ml:['毫升','milliliter','milliliters'],L:['公升','liter','liters'],l:['公升','liter','liters'],km:['公里','kilometer','kilometers'],cm:['公分','centimeter','centimeters'],mm:['毫米','millimeter','millimeters'],m:['公尺','meter','meters'],kg:['公斤','kilogram','kilograms'],g:['公克','gram','grams'],mg:['毫克','milligram','milligrams'],h:['小時','hour','hours'],min:['分鐘','minute','minutes'],s:['秒','second','seconds']};
export function normalizeSpeech(input:string,lang:SpeechLanguage):string {
  const en=lang==='en-US',say=(n:string,q=false)=>numberWords(n,lang,q);
  let text=input.normalize('NFKC');
  // Protect decimal points and clock semantics before expanding remaining numbers.
  text=text.replace(/\b([01]?\d|2[0-3]):([0-5]\d)(?:\s*(a\.m\.|p\.m\.|am\b|pm\b))?/gi,(_,h:string,m:string,period:string|undefined)=>{
    const hour=Number(h),minute=Number(m),p=period?.toLowerCase().startsWith('p')?'p.m.':period?'a.m.':'';
    return en?say(String(hour))+(minute===0?'':minute<10?' oh '+say(String(minute)):' '+say(String(minute)))+(p?' '+p:minute===0?" o'clock":''):(p?(p==='p.m.'?(hour===12?'中午':'下午'):(hour===12?'午夜':'上午')):'')+say(String(hour))+'點'+(minute?say(String(minute))+'分':'整');
  });
  text=text.replace(new RegExp('(NT\\$|NTD\\s*|US\\$|USD\\s*|HK\\$|HKD\\s*|JPY\\s*|EUR\\s*|\\$|€|¥)\\s*('+num+')','gi'),(_,symbol:string,n:string)=>{
    const c=symbol.trim().toUpperCase();const names=c.startsWith('NT')?['新臺幣','New Taiwan dollar']:c.startsWith('US')?['美元','US dollar']:c.startsWith('HK')?['港幣','Hong Kong dollar']:c==='€'||c==='EUR'?['歐元','euro']:c==='¥'||c==='JPY'?['日圓','yen']:['元','dollar'];
    return en?say(n)+' '+names[1]+(Number(n.replaceAll(',',''))===1||names[1]==='yen'?'':'s'):(names[0]==='新臺幣'?names[0]+say(n,true)+'元':say(n,true)+names[0]);
  });
  text=text.replace(new RegExp('('+num+')\\s*(新臺幣|新台幣|美元|港幣|日圓|歐元|元)','g'),(_,n:string,u:string)=>en?say(n)+' '+({'美元':'US dollars','港幣':'Hong Kong dollars','日圓':'yen','歐元':'euros'}[u]||'New Taiwan dollars'):say(n,true)+u);
  text=text.replace(new RegExp('('+num+')\\s*[%％]','g'),(_,n:string)=>en?say(n)+' percent':'百分之'+say(n));
  // NFKC turns superscripts into 2/3. The unit suffix stays tied to its quantity.
  text=text.replace(new RegExp('('+num+')\\s*(mL|ml|km|cm|mm|kg|mg|min|L|l|m|g|h|s)(?:([23])|\\^([23]))?(?![A-Za-z0-9])','g'),(_,n:string,u:string,power:string,caret:string)=>{
    const unit=units[u],p=power||caret,prefix=p==='2'?(en?'square ':'平方'):p==='3'?(en?'cubic ':'立方'):'';
    return en?say(n)+' '+prefix+unit[Number(n.replaceAll(',',''))===1?1:2]:say(n,true)+prefix+unit[0];
  });
  text=text.replace(/([零一二兩三四五六七八九十百千萬億點負]+)(公里|公尺|公分|毫米|公升|毫升)\s*\/\s*(h|min|s|小時|分鐘|秒)(?![A-Za-z])/g,(_,n:string,u:string,d:string)=>'每'+(units[d]?.[0]||d)+n+u);
  text=text.replace(/\b(kilometers?|meters?|centimeters?|millimeters?|liters?|milliliters?)\s*\/\s*(h|min|s)(?![A-Za-z])/g,(_,u:string,d:string)=>u+' per '+units[d][1]);
  text=text.replace(new RegExp('('+num+')\\s*/\\s*('+num+')','g'),(_,a:string,b:string)=>en?say(a)+' over '+say(b):say(b)+'分之'+say(a));
  text=text.replace(new RegExp('('+num+')\\s*:\\s*('+num+')','g'),(_,a:string,b:string)=>en?say(a)+' to '+say(b):say(a)+'比'+say(b));
  text=text.replace(new RegExp('('+num+')\\s*°\\s*([CF])','g'),(_,n:string,u:string)=>en?say(n)+' degrees '+(u==='C'?'Celsius':'Fahrenheit'):(u==='C'?'攝氏':'華氏')+say(n)+'度');
  const operators:Record<string,string>=en?{'×':' times ','÷':' divided by ','+':' plus ','−':' minus ','=':' equals ','≠':' is not equal to ','≤':' is at most ','≥':' is at least ','→':' then ','%':' percent '}: {'×':'乘以','÷':'除以','+':'加','−':'減','=':'等於','≠':'不等於','≤':'小於或等於','≥':'大於或等於','→':'接著','%':'百分比'};
  text=text.replace(/[×÷+−=≠≤≥→%]/g,c=>operators[c]);
  text=text.replace(/\s*[~～]\s*/g,en?' to ':'到');
  text=text.replace(/(\d)\s*-\s*(?=\d)/g,'$1'+(en?' minus ':'減'));
  text=text.replace(new RegExp('(^|[\\s(（])-(?='+num+')','g'),'$1'+(en?'minus ':'負'));
  if(!en){
    text=text.replace(/\b(mL|ml|km|cm|mm|kg|mg|min|L|m|g)\b/g,u=>units[u][0]);
    text=text.replace(/\bNT\$/g,'新臺幣').replace(/\bNTD\b/g,'新臺幣').replace(/\b3D\b/gi,'立體').replace(/\b2D\b/gi,'平面').replace(/\bDNA\b/g,'D N A').replace(/\bLED\b/g,'L E D');
  }
  text=text.replace(new RegExp(num,'g'),n=>say(n));
  return text.replace(/\s+/g,' ').trim();
}
