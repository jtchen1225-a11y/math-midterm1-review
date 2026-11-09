/* 第 1 章 工作紙一　導數的概念與基本求導公式。節次：1-1 重點回顧、1-2 選擇題、1-3 填空題、1-4 解答題
   範圍以「第一段考後複習工作紙（一）」為限；本檔由 build/build_site.py 產生，公式 TeX 皆由 OMML 轉出，請勿手改。 */
window.DECK = window.DECK || [];
(function () {
  /* 共用繪圖與互動工具（由 build.py 內嵌到每一章）。動態數值只顯示純文字數字，不產生公式。 */
  const K = {
    FS: 26,
    n(v, d) { const s = (+v).toFixed(d === undefined ? 2 : d); return (+s === 0 ? s.replace('-', '') : s).replace('-', '−'); },
    plot(o) {
      const W = o.W || 380, H = o.H || K.H || 262, m = 10, fs = K.FS;
      const [x0, x1] = o.x, [y0, y1] = o.y;
      const X = v => m + (v - x0) / (x1 - x0) * (W - 2 * m), Y = v => H - m - (v - y0) / (y1 - y0) * (H - 2 * m);
      let s = '', labs = '';
      const lab = (x, y, l, c) => { const hw = String(l).length * fs * 0.3; labs += SV.vlabel(Math.max(hw + 2, Math.min(W - hw - 2, x)), Math.max(fs, Math.min(H - 4, y)), l, c, fs); };
      (o.shade || []).forEach(a => {
        const lo = Math.min(a.a, a.b), hi = Math.max(a.a, a.b), N = 60, up = [], dn = [];
        const g = a.g || (() => 0);
        for (let i = 0; i <= N; i++) { const t = lo + (hi - lo) * i / N; up.push([X(t), Y(Math.max(y0, Math.min(y1, a.f(t))))]); dn.unshift([X(t), Y(Math.max(y0, Math.min(y1, g(t))))]); }
        s += SV.poly(up.concat(dn), a.c || 'rgba(37,99,235,.28)', 'none', 0);
      });
      const ax = (y0 <= 0 && y1 >= 0) ? Y(0) : H - m, ay = (x0 <= 0 && x1 >= 0) ? X(0) : m;
      s += SV.seg(m, ax, W - m, ax, '#5b6678', 2) + SV.seg(ay, m, ay, H - m, '#5b6678', 2);
      (o.xt || []).forEach(v => { const [p, l] = Array.isArray(v) ? v : [v, K.n(v, 0)]; s += SV.seg(X(p), ax - 5, X(p), ax + 5, '#5b6678', 2); lab(X(p), ax + fs + 3, l, '#172033'); });
      (o.yt || []).forEach(v => { const [p, l] = Array.isArray(v) ? v : [v, K.n(v, 0)]; s += SV.seg(ay - 5, Y(p), ay + 5, Y(p), '#5b6678', 2); lab(ay - fs * 0.9, Y(p) + fs * 0.35, l, '#172033'); });
      (o.vl || []).forEach(v => { s += SV.seg(X(v.x), Y(v.y0 === undefined ? y0 : v.y0), X(v.x), Y(v.y1 === undefined ? y1 : v.y1), v.c || '#7c3aed', v.w || 2, v.dash === undefined ? '6 5' : v.dash); });
      (o.fs || []).forEach(c => {
        const a = c.a === undefined ? x0 : c.a, b = c.b === undefined ? x1 : c.b, N = 240; let d = '', pen = false;
        for (let i = 0; i <= N; i++) {
          const t = a + (b - a) * i / N, v = c.f(t);
          if (Number.isFinite(v) && v >= y0 && v <= y1) { d += (pen ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(v).toFixed(1); pen = true; } else pen = false;
        }
        s += `<path d="${d}" fill="none" stroke="${c.c || '#2563eb'}" stroke-width="${c.w || 3.5}"${c.dash ? ` stroke-dasharray="${c.dash}"` : ''}/>`;
      });
      (o.pts || []).forEach(p => {
        s += SV.dot(X(p.x), Y(p.y), p.c || '#e11d48', p.r || 6.5);
        if (p.t) lab(X(p.x) + (p.dx || 0), Y(p.y) + (p.dy === undefined ? -13 : p.dy), p.t, p.c || '#e11d48');
      });
      return `<div style="width:100%;text-align:center"><svg viewBox="0 0 ${W} ${H}" style="max-width:100%">${s}<g style="text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:7px;stroke-linejoin:round">${labs}</g></svg></div>`;
    },
    slide(h, c) {
      h.innerHTML = `<div style="width:100%"><div class="kfig"></div><div class="ictrl"><label class="klab"></label>
        <input type="range" class="ks" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.val}"></div></div>`;
      const inp = h.querySelector('.ks'), lab = h.querySelector('.klab'), fig = h.querySelector('.kfig');
      const draw = () => { const v = +inp.value; K.H = 205; fig.innerHTML = c.fig(v); K.H = 0; lab.innerHTML = c.text(v); };
      inp.oninput = draw; draw();
    },
    opts(h, list, cols) {
      h.innerHTML = `<div style="width:100%;display:grid;grid-template-columns:${cols === 1 ? '1fr' : '1fr 1fr'};gap:${cols === 1 ? 8 : 12}px">${list.map(([l, x]) =>
        `<div style="border:2px solid var(--ct,#2563eb);border-radius:12px;padding:10px 12px;font-size:var(--mrd-body);text-align:left;background:#f7f9fd"><b>${l}.</b> ${x}</div>`).join('')}</div>`;
      if (window.MJ) MJ(h);
    },
    steps(h, list) {
      h.innerHTML = `<div style="width:100%"><div class="kbox" style="font-size:var(--mrd-body);line-height:1.5;text-align:left;padding:4px 10px"></div>
        <div class="ictrl"><label>步驟 <span class="ival kv">1</span> / ${list.length}</label>
        <input type="range" class="ks" min="1" max="${list.length}" step="1" value="1"></div></div>`;
      const inp = h.querySelector('.ks'), box = h.querySelector('.kbox'), kv = h.querySelector('.kv');
      const draw = () => {
        const n = +inp.value; kv.textContent = n;
        box.innerHTML = list.slice(0, n).map((t, i) => `<div style="margin:6px 0;${i === n - 1 ? 'color:#172033;font-weight:700' : 'color:#4b5568'}">${t}</div>`).join('');
        if (window.MJ) MJ(box);
      };
      inp.oninput = draw; draw();
    }
  };

  window.DECK.push({
    ch: 1,
    title: "工作紙一　導數的概念與基本求導公式",
    color: "#2563eb",
    sections: ["1-1 重點回顧", "1-2 選擇題", "1-3 填空題", "1-4 解答題"],
    slides: [
      {sec:"1-1",
       secName:"重點回顧",
       title:"導數的定義",
       points:["分子：函數值的增量", "分母：自變數的增量 h", "取 \\(h\\to 0\\) 的極限"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "定義", "tex": "f'(a)=\\mathop{\\lim}\\limits_{h\\to 0}\\frac{f(a+h)-f(a)}{h}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"1-1",
       secName:"重點回顧",
       title:"導數＝割線斜率的極限",
       points:["h 越小，割線越接近切線", "導數就是<span class=\"k\">瞬時變化率</span>"],
       visual:(h)=>{const f=x=>x*x;K.slide(h,{min:0.1,max:2,step:0.1,val:1.5,
         text:v=>`h ＝ <span class="ival">${K.n(v,1)}</span>　割線斜率 ＝ ${K.n(2+v,2)}`,
         fig:v=>K.plot({x:[-0.6,3.3],y:[-1.5,10],xt:[1],yt:[4,8],fs:[{f},{f:x=>2*x-1,c:'#a0aec0',w:2.5,dash:'6 5'},{f:x=>1+(2+v)*(x-1),c:'#e11d48',w:3}],
           pts:[{x:1,y:1,t:'P',dx:-22,dy:-6},{x:1+v,y:(1+v)*(1+v),t:'Q',dx:-24,dy:4,c:'#7c3aed'}]})})},
       caption:"\\(y={x}^{2}\\)：割線（紅）趨近切線（灰）"},
      {sec:"1-1",
       secName:"重點回顧",
       title:"基本求導公式要熟",
       points:["負指數、根號先化成冪", "\\(\\ln \\,2x\\) 的導數仍是 \\(\\frac{1}{x}\\)"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}, {"label": "正弦", "tex": "(\\sin \\,x)'=\\cos \\,x", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}, {"label": "餘弦", "tex": "(\\cos \\,x)'=-\\sin \\,x", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"1-1",
       secName:"重點回顧",
       title:"指數與對數的導數",
       points:["\\({e}^{x}\\) 的導數是自己", "\\(\\ln \\,x\\) 只在 \\(x&gt;0\\) 有定義"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "指數", "tex": "({e}^{x})'={e}^{x}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}, {"label": "對數", "tex": "(\\ln \\,x)'=\\frac{1}{x}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"1-2",
       secName:"選擇題",
       title:"第 1 題｜三角函數的導數",
       points:[],
       caption:"提示：先求 \\(f'(x)\\) 再代值",
       visual:(h)=>K.opts(h,[["A", "\\(\\frac{1}{2}\\)"], ["B", "\\(\\frac{\\sqrt{3}}{2}\\)"], ["C", "\\(-\\frac{1}{2}\\)"], ["D", "\\(-\\frac{\\sqrt{3}}{2}\\)"]],1),
       example:{"q": "函數 \\(f(x)=\\sin x\\) 在 \\(x=\\frac{\\pi }{3}\\) 處的導數為（　　）", "steps": ["\\({f}'(x)=\\cos x\\)，\\({f}'\\left( \\frac{\\pi }{3} \\right)=\\cos \\frac{\\pi }{3}=\\frac{1}{2}\\)。"], "ans": "(A) \\(\\frac{1}{2}\\)"}},
      {sec:"1-2",
       secName:"選擇題",
       title:"第 2 題｜辨識正確的公式",
       points:[],
       caption:"提示：每個選項都求一次導數比對",
       visual:(h)=>K.opts(h,[["A", "\\((\\cos x{)}'=\\sin x\\)"], ["B", "\\(({e}^{3x}{)}'={e}^{3x}\\)"], ["C", "\\(({x}^{-2}{)}'=-2{x}^{-3}\\)"], ["D", "\\((\\ln 2x{)}'=\\frac{2}{x}\\)"]],1),
       example:{"q": "下列求導運算中，正確的是（　　）", "steps": ["(A) 應為 \\(-\\sin x\\)；(B) 應為 \\(3{e}^{3x}\\)；(D) \\((\\ln 2x{)}'=\\frac{2}{2x}=\\frac{1}{x}\\)。"], "ans": "(C) \\(({x}^{-2}{)}'=-2{x}^{-3}\\)"}},
      {sec:"1-2",
       secName:"選擇題",
       title:"第 3 題｜瞬時速度",
       points:[],
       caption:"提示：速度 ＝ 位移對時間的導數",
       visual:(h)=>K.opts(h,[["A", "3 m/s"], ["B", "5 m/s"], ["C", "7 m/s"], ["D", "9 m/s"]],2),
       example:{"q": "某質點的位移函數為 \\(s(t)=2{t}^{3}-5{t}^{2}+3t\\)（\\(s\\) 單位：m，\\(t\\) 單位：s），則 \\(t=2\\) s 時的瞬時速度為（　　）", "steps": ["\\(v(t)={s}'(t)=6{t}^{2}-10t+3\\)，\\(v(2)=24-20+3=7\\)（m/s）。"], "ans": "(C) 7 m/s"}},
      {sec:"1-2",
       secName:"選擇題",
       title:"第 4 題｜負指數求導",
       points:[],
       caption:"提示：\\(\\frac{3}{x}\\) 先寫成 \\(3{x}^{-1}\\)",
       visual:(h)=>K.opts(h,[["A", "\\(4{x}^{3}-\\frac{3}{{x}^{2}}\\)"], ["B", "\\(4{x}^{3}+\\frac{3}{{x}^{2}}\\)"], ["C", "\\({x}^{3}+\\frac{3}{{x}^{2}}\\)"], ["D", "\\(4{x}^{3}-\\frac{1}{{x}^{2}}\\)"]],1),
       example:{"q": "函數 \\(f(x)={x}^{4}-\\frac{3}{x}\\) 的導函數 \\({f}'(x)=\\)（　　）", "steps": ["\\({\\left( -3{x}^{-1} \\right)}'=3{x}^{-2}\\)，故 \\({f}'(x)=4{x}^{3}+\\frac{3}{{x}^{2}}\\)。"], "ans": "(B) \\(4{x}^{3}+\\frac{3}{{x}^{2}}\\)"}},
      {sec:"1-2",
       secName:"選擇題",
       title:"第 5 題｜導數定義的變形",
       points:[],
       caption:"提示：分母要湊成和增量一致",
       visual:(h)=>K.opts(h,[["A", "\\(2\\)"], ["B", "\\(-2\\)"], ["C", "\\(\\frac{1}{2}\\)"], ["D", "\\(-4\\)"]],2),
       example:{"q": "設 \\(f(x)\\) 可導且 \\({f}'({x}_{0})=2\\)，則 \\(\\mathop{\\lim}\\limits_{h\\to 0}\\frac{f({x}_{0}-h)-f({x}_{0})}{h}=\\)（　　）", "steps": ["原式 \\(=-\\mathop{\\lim}\\limits_{h\\to 0}\\frac{f({x}_{0}-h)-f({x}_{0})}{-h}=-{f}'({x}_{0})=-2\\)。"], "ans": "(B) \\(-2\\)"}},
      {sec:"1-3",
       secName:"填空題",
       title:"第 6 題｜根號求導",
       points:[],
       caption:"提示：\\(\\sqrt[3]{x}={x}^{\\frac{1}{3}}\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "已知 \\(f(x)=\\sqrt[3]{x}\\)，則 \\({f}'(8)=\\)＿＿＿＿＿＿。", "steps": ["\\({f}'(x)=\\frac{1}{3}{x}^{-\\frac{2}{3}}\\)，\\({f}'(8)=\\frac{1}{3}⋅\\frac{1}{4}=\\frac{1}{12}\\)。"], "ans": "\\(\\frac{1}{12}\\)"}},
      {sec:"1-3",
       secName:"填空題",
       title:"第 7 題｜由導數值求參數",
       points:[],
       caption:"提示：先求導，再代 x＝2 列方程",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "設 \\(f(x)=a{x}^{2}+3x\\)，若 \\({f}'(2)=11\\)，則 \\(a=\\)＿＿＿＿＿＿。", "steps": ["\\({f}'(x)=2ax+3\\)，\\({f}'(2)=4a+3=11\\)，得 \\(a=2\\)。"], "ans": "\\(2\\)"}},
      {sec:"1-3",
       secName:"填空題",
       title:"第 8 題｜增量是 3Δx",
       points:[],
       caption:"提示：乘 3 再除 3，湊出導數定義",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "導數定義", "tex": "f'(a)=\\mathop{\\lim}\\limits_{h\\to 0}\\frac{f(a+h)-f(a)}{h}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "設 \\(f(x)={x}^{2}\\)，則 \\(\\mathop{\\lim}\\limits_{\\Delta x\\to 0}\\frac{f(1+3\\Delta x)-f(1)}{\\Delta x}=\\)＿＿＿＿＿＿。", "steps": ["原式 \\(=3\\mathop{\\lim}\\limits_{\\Delta x\\to 0}\\frac{f(1+3\\Delta x)-f(1)}{3\\Delta x}=3{f}'(1)=3\\times 2=6\\)。"], "ans": "\\(6\\)"}},
      {sec:"1-3",
       secName:"填空題",
       title:"第 9 題｜f′(2) 是常數",
       points:[],
       caption:"提示：把 \\(f'(2)\\) 當作常數求導；再令 x＝2",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#2563eb", "fill": "#f7f9fd", "border": "#2563eb", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "已知 \\(f(x)={x}^{2}+3x\\,{f}'(2)\\)，則 \\({f}'(2)=\\)＿＿＿＿＿＿。", "steps": ["\\({f}'(2)\\) 是常數，\\({f}'(x)=2x+3{f}'(2)\\)；令 \\(x=2\\)：\\({f}'(2)=4+3{f}'(2)\\)，得 \\({f}'(2)=-2\\)。"], "ans": "\\(-2\\)"}},
      {sec:"1-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（1）",
       visual:(h)=>K.steps(h,["💡 先化成冪的形式再求導。先自己算，再拖動滑桿看步驟。", "（1）\\(f(1+h)-f(1)=(1+h{)}^{2}+(1+h)-2=3h+{h}^{2}\\)，", "\\({f}'(1)=\\mathop{\\lim}\\limits_{h\\to 0}\\frac{3h+{h}^{2}}{h}=\\mathop{\\lim}\\limits_{h\\to 0}(3+h)=3\\)。", "答：\\(3\\)"]),
       caption:"定義與基本公式",
       example:{"q": "（1）用導數的定義求 \\(f(x)={x}^{2}+x\\) 在 \\(x=1\\) 處的導數。", "ans": "\\(3\\)"}},
      {sec:"1-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（2）",
       visual:(h)=>K.steps(h,["💡 先化成冪的形式再求導。先自己算，再拖動滑桿看步驟。", "（2）\\(y=3{x}^{4}-2{x}^{\\frac{1}{2}}+5{x}^{-1}\\)，\\({y}'=12{x}^{3}-{x}^{-\\frac{1}{2}}-5{x}^{-2}=12{x}^{3}-\\frac{1}{\\sqrt{x}}-\\frac{5}{{x}^{2}}\\)。", "答：\\(12{x}^{3}-\\frac{1}{\\sqrt{x}}-\\frac{5}{{x}^{2}}\\)"]),
       caption:"定義與基本公式",
       example:{"q": "（2）求 \\(y=3{x}^{4}-2\\sqrt{x}+\\frac{5}{x}\\) 的導數。", "ans": "\\(12{x}^{3}-\\frac{1}{\\sqrt{x}}-\\frac{5}{{x}^{2}}\\)"}},
      {sec:"1-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（3）",
       visual:(h)=>K.steps(h,["💡 先化成冪的形式再求導。先自己算，再拖動滑桿看步驟。", "（3）\\({y}'=2{e}^{x}-3(-\\sin x)+\\frac{1}{x}=2{e}^{x}+3\\sin x+\\frac{1}{x}\\)。", "答：\\(2{e}^{x}+3\\sin x+\\frac{1}{x}\\)"]),
       caption:"定義與基本公式",
       example:{"q": "（3）求 \\(y=2{e}^{x}-3\\cos x+\\ln x\\) 的導數。", "ans": "\\(2{e}^{x}+3\\sin x+\\frac{1}{x}\\)"}},
      {sec:"1-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（1）",
       visual:(h)=>K.steps(h,["💡 速度 ＝ s′(t)，加速度 ＝ v′(t)。先自己算，再拖動滑桿看步驟。", "（1）\\(v(t)={s}'(t)=3{t}^{2}-12t+9\\)。", "答：\\(v(t)=3{t}^{2}-12t+9\\)"]),
       caption:"題幹：某質點沿直線運動，位移 \\(s(t)={t}^{3}-6{t}^{2}+9t\\)（\\(t\\ge 0\\)，\\(s\\) 單位：m，\\(t\\) 單位：s）。",
       example:{"q": "（1）求速度 \\(v(t)\\)", "ans": "\\(v(t)=3{t}^{2}-12t+9\\)"}},
      {sec:"1-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（2）",
       visual:(h)=>K.steps(h,["💡 速度 ＝ s′(t)，加速度 ＝ v′(t)。先自己算，再拖動滑桿看步驟。", "（2）\\(v(t)=3(t-1)(t-3)=0\\)，得 \\(t=1\\) s 或 \\(t=3\\) s。", "答：\\(t=1\\) 或 \\(t=3\\)"]),
       caption:"題幹：某質點沿直線運動，位移 \\(s(t)={t}^{3}-6{t}^{2}+9t\\)（\\(t\\ge 0\\)，\\(s\\) 單位：m，\\(t\\) 單位：s）。",
       example:{"q": "（2）求質點瞬間靜止的時刻", "ans": "\\(t=1\\) 或 \\(t=3\\)"}},
      {sec:"1-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（3）",
       visual:(h)=>K.steps(h,["💡 速度 ＝ s′(t)，加速度 ＝ v′(t)。先自己算，再拖動滑桿看步驟。", "（3）\\(a(t)={v}'(t)=6t-12\\)，\\(a(2)=0\\)（m/s²）。", "答：\\(0\\)"]),
       caption:"題幹：某質點沿直線運動，位移 \\(s(t)={t}^{3}-6{t}^{2}+9t\\)（\\(t\\ge 0\\)，\\(s\\) 單位：m，\\(t\\) 單位：s）。",
       example:{"q": "（3）求 \\(t=2\\) 時的加速度", "ans": "\\(0\\)"}},
      {sec:"1-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（4）",
       visual:(h)=>K.steps(h,["💡 速度 ＝ s′(t)，加速度 ＝ v′(t)。先自己算，再拖動滑桿看步驟。", "（4）平均速度 \\(=\\frac{s(3)-s(0)}{3-0}=\\frac{0-0}{3}=0\\)（m/s）。", "答：\\(0\\)"]),
       caption:"題幹：某質點沿直線運動，位移 \\(s(t)={t}^{3}-6{t}^{2}+9t\\)（\\(t\\ge 0\\)，\\(s\\) 單位：m，\\(t\\) 單位：s）。",
       example:{"q": "（4）求前 3 秒的平均速度。", "ans": "\\(0\\)"}}
    ]
  });
})();
