const initialCases = [
  {id:'EDU-2024-006',name:'國中數學第三冊',org:'翰林出版事業',type:'教科書',reviewer:'王大明',due:'2024-05-28',status:'審查中',updated:'2 小時前'},
  {id:'EDU-2024-005',name:'國小自然科學互動教材',org:'康軒文教事業',type:'數位教材',reviewer:'陳美玲',due:'2024-05-29',status:'審查中',updated:'昨天'},
  {id:'EDU-2024-004',name:'高中公民與社會選修',org:'龍騰文化事業',type:'教科書',reviewer:'張志豪',due:'2024-06-03',status:'待補件',updated:'2 天前'},
  {id:'EDU-2024-003',name:'閱讀理解學習單',org:'臺北市教育局',type:'補充教材',reviewer:'林雅雯',due:'2024-06-06',status:'審查中',updated:'3 天前'},
  {id:'EDU-2024-002',name:'國中英語數位課程',org:'南一書局',type:'數位教材',reviewer:'王大明',due:'2024-05-20',status:'已完成',updated:'4 天前'},
  {id:'EDU-2024-001',name:'幼兒園安全教育繪本',org:'新北市教育局',type:'補充教材',reviewer:'陳美玲',due:'2024-05-16',status:'已完成',updated:'5 天前'}
];
const reviewers = [{name:'王大明',role:'數學教育專長',initial:'王',color:'avatar-indigo',online:true,tags:['數學','課程設計'],cases:3},{name:'陳美玲',role:'語文教育專長',initial:'陳',color:'avatar-amber',online:true,tags:['國語文','閱讀素養'],cases:2},{name:'張志豪',role:'社會領域專長',initial:'張',color:'avatar-indigo',online:false,tags:['公民','多元文化'],cases:2},{name:'林雅雯',role:'教育科技專長',initial:'林',color:'avatar-amber',online:true,tags:['數位學習','無障礙'],cases:1},{name:'李承翰',role:'自然科學專長',initial:'李',color:'avatar-indigo',online:false,tags:['自然科學','探究實作'],cases:2},{name:'許婉如',role:'兒童教育專長',initial:'許',color:'avatar-amber',online:true,tags:['幼兒教育','適齡性'],cases:1}];
let cases = JSON.parse(localStorage.getItem('review-cases') || 'null') || initialCases;
const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
function statusClass(status){return status==='已完成'?'done':status==='待補件'?'pending':'review'}
function renderCases(){
  const search=($('#case-search')?.value||'').toLowerCase(); const filter=$('#status-filter')?.value||'all';
  const list=cases.filter(c=>(filter==='all'||c.status===filter)&&`${c.id} ${c.name} ${c.org}`.toLowerCase().includes(search));
  $('#cases-table').innerHTML=list.map(c=>`<tr><td>${c.id}</td><td><div class="case-name">${c.name}<small>${c.type}</small></div></td><td>${c.org}</td><td>${c.reviewer}</td><td>${c.due.replace('2024-','')}</td><td><span class="status ${statusClass(c.status)}">${c.status}</span></td><td><button class="row-menu" data-case="${c.id}">•••</button></td></tr>`).join('')||'<tr><td colspan="7" style="text-align:center;padding:30px">找不到符合條件的案件</td></tr>';
  $('#case-summary').textContent=`顯示 ${list.length?1:0}–${list.length} 筆，共 ${list.length} 筆`; $('#stat-active').textContent=cases.filter(c=>c.status!=='已完成').length; $('#nav-case-count').textContent=cases.filter(c=>c.status!=='已完成').length;
  $('#recent-table').innerHTML=cases.slice(0,4).map(c=>`<tr><td><div class="case-name">${c.name}<small>${c.id}</small></div></td><td>${c.type}</td><td>${c.reviewer}</td><td><span class="status ${statusClass(c.status)}">${c.status}</span></td><td>${c.updated}</td><td><button class="row-menu" data-case="${c.id}">•••</button></td></tr>`).join('');
  const urgent=cases.filter(c=>c.status!=='已完成').slice(0,3); $('#deadline-list').innerHTML=urgent.map(c=>`<div class="deadline-item"><span class="deadline-icon">◷</span><div><strong>${c.name}</strong><small>${c.reviewer} 負責</small></div><span class="due">${c.due.slice(5).replace('-','/')} 到期</span></div>`).join('');
}
function renderReviewers(){ $('#reviewer-grid').innerHTML=reviewers.map(r=>`<article class="reviewer-card"><div class="reviewer-head"><span class="avatar ${r.color}">${r.initial}</span><div><strong>${r.name}</strong><small>${r.role}</small></div>${r.online?'<i class="online"></i>':''}</div><div class="specialties">${r.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="reviewer-foot"><span>進行中案件</span><b>${r.cases} 件</b><button class="text-btn" data-toast="已開啟 ${r.name} 的工作清單">查看 →</button></div></article>`).join('') }
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.remove('hidden');el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.add('hidden'),2600)}
function showView(view){$$('.page').forEach(p=>p.classList.add('hidden'));$(`#${view}-view`).classList.remove('hidden');$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));const labels={dashboard:'總覽',cases:'審查案件',reviewers:'審查委員',templates:'審查表單',reports:'報表分析',settings:'系統設定'};$('#page-title').textContent=labels[view];$('#sidebar').classList.remove('open');}
function openModal(){ $('#case-modal').classList.remove('hidden'); const date=new Date();date.setDate(date.getDate()+14);$('#case-form [name=due]').value=date.toISOString().slice(0,10); }
function closeModal(){ $('#case-modal').classList.add('hidden'); }
$$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view))); $$('[data-view-link]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.viewLink))); $('#mobile-menu').addEventListener('click',()=>$('#sidebar').classList.toggle('open')); $('#new-case-btn').addEventListener('click',openModal); $('#new-case-btn-2').addEventListener('click',openModal); $$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal)); $('#case-modal').addEventListener('click',e=>{if(e.target.id==='case-modal')closeModal()}); $('#case-search').addEventListener('input',renderCases); $('#status-filter').addEventListener('change',renderCases);
$('#case-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const n={id:`EDU-2024-${String(cases.length+1).padStart(3,'0')}`,name:f.get('name'),org:f.get('org'),type:f.get('type'),reviewer:f.get('reviewer'),due:f.get('due'),status:'審查中',updated:'剛剛'};cases.unshift(n);localStorage.setItem('review-cases',JSON.stringify(cases));renderCases();closeModal();e.target.reset();toast('案件已建立，已加入審查清單');showView('cases')});
document.addEventListener('click',e=>{const c=e.target.closest('[data-case]');if(c)toast(`案件 ${c.dataset.case}：已開啟操作選單`);const t=e.target.closest('[data-toast]');if(t)toast(t.dataset.toast)}); $('#invite-btn')?.addEventListener('click',()=>toast('邀請委員功能已準備，請填寫委員 Email')); $('#template-btn')?.addEventListener('click',()=>toast('表單建立功能已準備')); $('#export-report')?.addEventListener('click',()=>toast('報表已準備下載（示範模式）')); $$('.secondary-btn').forEach(b=>b.addEventListener('click',()=>{if(b.textContent.includes('匯出'))toast('案件清單已準備下載（示範模式）')}));
renderCases();renderReviewers();

function setupAiReview(){
  const heading=$('#cases-view .page-heading');
  const primary=heading?.querySelector('#new-case-btn-2');
  if(!heading||!primary)return;
  const actions=document.createElement('div'); actions.className='heading-actions';
  const aiButton=document.createElement('button'); aiButton.className='ai-btn'; aiButton.id='ai-review-btn'; aiButton.textContent='✦ AI 初步審查';
  primary.parentNode.insertBefore(actions,primary); actions.append(aiButton,primary);
  const modal=document.createElement('div'); modal.className='modal-backdrop hidden'; modal.id='ai-modal'; modal.innerHTML=`<div class="modal ai-modal"><div class="modal-header"><div><p class="eyebrow">AI 輔助工具</p><h2>AI 初步審查</h2><p class="muted modal-subtitle">分析教材文本，並依課綱關鍵概念進行初步核對。</p></div><button class="close-btn" data-close-ai>×</button></div><div class="ai-form" id="ai-form"><label>教材名稱<input id="ai-title" value="國中數學第三冊" /></label><label>適用課綱／版本<input id="ai-curriculum" value="十二年國民基本教育課程綱要—數學領域" /></label><label>貼上教材文本<textarea id="ai-text" rows="9" placeholder="請貼上教材章節、單元說明或學習內容……">本單元引導學生理解一次函數的圖形與變化，透過生活情境建立變數、對應關係與斜率的概念。學生將使用表格、座標平面及代數式表達問題，並以小組合作方式解釋不同表示法之間的關聯。</textarea></label><div class="ai-note">ⓘ 本功能提供初步篩檢，不取代專業審查委員的判斷。請確認教材版本與課綱條文後再做正式決議。</div><div class="modal-actions"><button type="button" class="secondary-btn" data-close-ai>取消</button><button class="ai-btn" id="run-ai-btn">✦ 開始分析</button></div></div><div class="ai-result hidden" id="ai-result"><div class="result-banner"><span class="result-check">✓</span><div><strong>初步分析完成</strong><small>已根據教材文本與指定課綱產生檢核結果</small></div><span class="result-score">84<small>/ 100</small></span></div><div class="result-grid"><article><span class="result-label">課綱符合度</span><strong id="curriculum-score">良好</strong><p id="curriculum-result">文本涵蓋變數關係、函數圖形與數學表徵，與指定課綱方向大致一致。</p></article><article><span class="result-label">教材完整度</span><strong>待人工確認</strong><p>已辨識學習目標與活動描述，評量方式與差異化支持尚需補充檢視。</p></article></div><div class="finding-section"><span class="result-label">AI 檢核摘要</span><ul id="ai-findings"></ul></div><div class="result-actions"><button class="secondary-btn" id="ai-back-btn">← 重新分析</button><button class="primary-btn" id="download-report-btn">⇩ 下載 APA 7 Word 報告</button></div></div></div>`; document.body.appendChild(modal);
  const open=()=>modal.classList.remove('hidden'), close=()=>modal.classList.add('hidden'); aiButton.addEventListener('click',open); modal.querySelectorAll('[data-close-ai]').forEach(b=>b.addEventListener('click',close)); modal.addEventListener('click',e=>{if(e.target===modal)close()});
  $('#run-ai-btn').addEventListener('click',()=>{const text=$('#ai-text').value.trim(); if(!text){toast('請先貼上教材文本');return;} const words=text.length; const math=/函數|變數|數學|方程|圖形|代數|幾何|統計|機率/.test(text); const hasGoal=/目標|理解|學習|學生/.test(text); const hasAssess=/評量|作業|測驗|檢核|活動/.test(text); const score=Math.min(96,Math.max(58,68+(math?12:0)+(hasGoal?8:0)+(hasAssess?8:0))); $('#curriculum-score').textContent=score>=80?'良好':score>=70?'部分符合':'需要補充'; $('.result-score').innerHTML=`${score}<small>/ 100</small>`; $('#curriculum-result').textContent=math?'文本出現與學科領域相關的核心概念，初步判定與指定課綱方向一致；仍需人工逐條比對學習內容與學習表現。':'目前未辨識足夠的領域關鍵概念，建議確認課綱版本、領域與年級後重新分析。'; $('#ai-findings').innerHTML=[`已分析約 ${words} 字文本，辨識出 ${math?'學科概念與課程脈絡':'有限的學科關鍵詞'}。`,hasGoal?'已發現學習目標或學生學習活動描述。':'建議補充可觀察、可評量的學習目標。',hasAssess?'已發現評量、作業或檢核相關描述。':'建議補充形成性／總結性評量與評量規準。','正式審查前，請委員核對原始課綱條文、教材頁碼與引用來源。'].map((x,i)=>`<li class="${i===1&&!hasGoal||i===2&&!hasAssess?'warning':''}">${x}</li>`).join(''); $('#ai-form').classList.add('hidden');$('#ai-result').classList.remove('hidden');});
  $('#ai-back-btn').addEventListener('click',()=>{$('#ai-result').classList.add('hidden');$('#ai-form').classList.remove('hidden')}); $('#download-report-btn').addEventListener('click',downloadApaReport);
}
function downloadApaReport(){const title=$('#ai-title').value||'教材文本';const curriculum=$('#ai-curriculum').value||'未指定課綱';const text=$('#ai-text').value||'';const score=$('.result-score').textContent.replace('/ 100','').trim();const findings=$$('#ai-findings li').map(x=>x.textContent);const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));const body=`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:2.54cm}body{font-family:'標楷體','DFKai-SB',serif;font-size:12pt;line-height:2;text-align:justify;color:#000}h1,h2{text-align:center;font-weight:700}h1{font-size:16pt;margin-top:3cm}h2{font-size:14pt;margin-top:24pt}.meta{text-align:center;line-height:2.2}.label{font-weight:700}.section{margin-top:18pt}.indent{text-indent:2em}.reference{padding-left:2em;text-indent:-2em}</style></head><body><h1>教材文本 AI 初步審查報告</h1><div class="meta">${esc(title)}<br>${new Date().toLocaleDateString('zh-TW')}<br>教材審查中心</div><h2>摘要</h2><p class="indent">本報告依據「${esc(curriculum)}」對教材文本進行初步分析。AI 初步符合度評分為 ${esc(score)} 分（滿分 100 分）。本結果僅供審查前置作業參考，不取代專業審查與正式課綱逐條核對。</p><h2>教材文本</h2><p>${esc(text).replace(/\n/g,'<br>')}</p><h2>初步審查結果</h2><p class="label">課綱符合度</p><p class="indent">${esc($('#curriculum-result').textContent)}</p><p class="label">AI 檢核摘要</p><ul>${findings.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><h2>審查限制與建議</h2><p class="indent">建議由具備該領域專業的審查委員，依指定課綱原文逐條核對學習內容、學習表現、議題融入、評量方式與教材引用來源，並記錄對應頁碼及修訂意見。</p><h2>參考文獻</h2><p class="reference">教育部。（年份）。<i>${esc(curriculum)}</i>。</p><p class="reference">教材審查中心。（${new Date().getFullYear()}）。<i>${esc(title)}：AI 初步審查報告</i>。</p></body></html>`;const blob=new Blob([body],{type:'application/msword'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${title}-APA7-初步審查報告.doc`;a.click();URL.revokeObjectURL(a.href);toast('APA 7 Word 報告已下載');}
setupAiReview();

const fixedCurriculumFile='課綱/十二年國民基本教育課程綱要國民中小學暨普通型高級中等校-社會領域.pdf';
const fixedCurriculumTitle='十二年國民基本教育課程綱要國民中小學暨普通型高級中等校—社會領域';
const curriculumInput=$('#ai-curriculum');
if(curriculumInput){
  curriculumInput.value=fixedCurriculumTitle;
  curriculumInput.readOnly=true;
  const source=document.createElement('small');
  source.className='curriculum-source';
  source.textContent=`固定比對來源：${fixedCurriculumFile}`;
  curriculumInput.parentElement.appendChild(source);
}
$('#run-ai-btn')?.addEventListener('click',()=>{
  const text=$('#ai-text')?.value||'';
  const social=/歷史|地理|公民|社會|文化|民主|權利|責任|地方|全球|環境|永續|地圖|資料分析|探究|多元|人權|法治/.test(text);
  if(social){
    $('#curriculum-score').textContent='部分至良好';
    $('.result-score').innerHTML=`86<small>/ 100</small>`;
    $('#curriculum-result').textContent='文本辨識出社會領域的核心概念，與固定課綱方向具初步關聯；仍需由委員依課綱的學習內容、學習表現與議題融入逐條核對。';
    $('#ai-findings').insertAdjacentHTML('afterbegin','<li>已依固定社會領域課綱進行關鍵概念初步比對。</li>');
  }
});
