/* 第 2 章 工作紙二　求導法則：乘積、商、鏈式法則與二階導數。節次：2-1 重點回顧、2-2 選擇題、2-3 填空題、2-4 解答題
   範圍以「第一段考後複習工作紙（二）」為限；本檔由 build/build_site.py 產生，公式 TeX 皆由 OMML 轉出，請勿手改。 */
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
    ch: 2,
    title: "工作紙二　求導法則：乘積、商、鏈式法則與二階導數",
    color: "#7c3aed",
    sections: ["2-1 重點回顧", "2-2 選擇題", "2-3 填空題", "2-4 解答題"],
    slides: [
      {sec:"2-1",
       secName:"重點回顧",
       title:"鏈式法則：外層導數 × 內層導數",
       points:["先導外層、內層不動，再乘內層導數"],
       formula:{"label": "鏈式法則（u＝g(x)）", "tex": "\\frac{dy}{dx}=\\frac{dy}{du}\\cdot \\frac{du}{dx}"},
       visual:(h)=>{K.slide(h,{min:0.5,max:3,step:0.5,val:2,
         text:v=>`k ＝ <span class="ival">${K.n(v,1)}</span>　原點切線斜率 ＝ ${K.n(v,1)}`,
         fig:v=>K.plot({x:[-3.2,3.2],y:[-1.6,1.6],xt:[-2,2],yt:[1],fs:[{f:x=>Math.sin(v*x)},{f:x=>v*x,c:'#e11d48',w:3}],pts:[{x:0,y:0,t:'O',dx:-20,dy:28}]})})},
       caption:"\\(y=\\sin \\,kx\\)：\\(y'=k\\cos \\,kx\\)，在原點斜率剛好是 k"},
      {sec:"2-1",
       secName:"重點回顧",
       title:"乘積與商的求導",
       points:["乘積：前導後不導＋前不導後導", "商：分母平方，分子「上導下 − 上下導」"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "乘積法則", "tex": "(uv)'=u'v+uv'", "color": "#7c3aed", "fill": "#f7f9fd", "border": "#7c3aed", "w": "100%", "pad": "8px 4px"}, {"label": "商法則", "tex": "(\\frac{u}{v})'=\\frac{u'v-uv'}{{v}^{2}}", "color": "#7c3aed", "fill": "#f7f9fd", "border": "#7c3aed", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"2-2",
       secName:"選擇題",
       title:"第 1 題｜鏈式法則（三角）",
       points:[],
       caption:"提示：外層 cos，內層 3x−1",
       visual:(h)=>K.opts(h,[["A", "\\(\\sin (3x-1)\\)"], ["B", "\\(-\\sin (3x-1)\\)"], ["C", "\\(3\\sin (3x-1)\\)"], ["D", "\\(-3\\sin (3x-1)\\)"]],1),
       example:{"q": "函數 \\(y=\\cos (3x-1)\\) 的導數為（　　）", "steps": ["\\({y}'=-\\sin (3x-1)⋅(3x-1{)}'=-3\\sin (3x-1)\\)。"], "ans": "(D) \\(-3\\sin (3x-1)\\)"}},
      {sec:"2-2",
       secName:"選擇題",
       title:"第 2 題｜乘積法則",
       points:[],
       caption:"提示：x 與 \\({e}^{x}\\) 兩個因子",
       visual:(h)=>K.opts(h,[["A", "\\({e}^{x}\\)"], ["B", "\\(x{e}^{x}\\)"], ["C", "\\((x+1){e}^{x}\\)"], ["D", "\\((x-1){e}^{x}\\)"]],1),
       example:{"q": "函數 \\(f(x)=x{e}^{x}\\) 的導函數 \\({f}'(x)=\\)（　　）", "steps": ["\\({f}'(x)=1⋅{e}^{x}+x⋅{e}^{x}=(x+1){e}^{x}\\)。"], "ans": "(C) \\((x+1){e}^{x}\\)"}},
      {sec:"2-2",
       secName:"選擇題",
       title:"第 3 題｜鏈式法則（冪）",
       points:[],
       caption:"提示：別漏乘內層的導數 2",
       visual:(h)=>K.opts(h,[["A", "\\(5(2x+1{)}^{4}\\)"], ["B", "\\(2(2x+1{)}^{5}\\)"], ["C", "\\(10(2x+1{)}^{5}\\)"], ["D", "\\(10(2x+1{)}^{4}\\)"]],1),
       example:{"q": "函數 \\(y=(2x+1{)}^{5}\\) 的導數為（　　）", "steps": ["\\({y}'=5(2x+1{)}^{4}⋅2=10(2x+1{)}^{4}\\)。"], "ans": "(D) \\(10(2x+1{)}^{4}\\)"}},
      {sec:"2-2",
       secName:"選擇題",
       title:"第 4 題｜商法則",
       points:[],
       caption:"提示：分子：上導下 − 上下導",
       visual:(h)=>K.opts(h,[["A", "\\(\\frac{1}{(x+1{)}^{2}}\\)"], ["B", "\\(-\\frac{1}{(x+1{)}^{2}}\\)"], ["C", "\\(\\frac{x}{(x+1{)}^{2}}\\)"], ["D", "\\(\\frac{2x+1}{(x+1{)}^{2}}\\)"]],1),
       example:{"q": "函數 \\(y=\\frac{x}{x+1}\\) 的導數為（　　）", "steps": ["\\({y}'=\\frac{1⋅(x+1)-x⋅1}{(x+1{)}^{2}}=\\frac{1}{(x+1{)}^{2}}\\)。"], "ans": "(A) \\(\\frac{1}{(x+1{)}^{2}}\\)"}},
      {sec:"2-2",
       secName:"選擇題",
       title:"第 5 題｜鏈式法則（指數）",
       points:[],
       caption:"提示：內層是 \\({x}^{2}\\)",
       visual:(h)=>K.opts(h,[["A", "\\(e\\)"], ["B", "\\(2e\\)"], ["C", "\\({e}^{2}\\)"], ["D", "\\(2\\)"]],2),
       example:{"q": "已知 \\(f(x)={e}^{{x}^{2}}\\)，則 \\({f}'(1)=\\)（　　）", "steps": ["\\({f}'(x)={e}^{{x}^{2}}⋅2x\\)，\\({f}'(1)=2e\\)。"], "ans": "(B) \\(2e\\)"}},
      {sec:"2-3",
       secName:"填空題",
       title:"第 6 題｜鏈式法則（對數）",
       points:[],
       caption:"提示：\\((\\ln \\,u)'=\\frac{u'}{u}\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "鏈式法則", "tex": "\\frac{dy}{dx}=\\frac{dy}{du}\\cdot \\frac{du}{dx}", "color": "#7c3aed", "fill": "#f7f9fd", "border": "#7c3aed", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "函數 \\(y=\\ln (2x+3)\\) 在 \\(x=0\\) 處的導數是＿＿＿＿＿＿。", "steps": ["\\({y}'=\\frac{2}{2x+3}\\)，\\(x=0\\) 時 \\({y}'=\\frac{2}{3}\\)。"], "ans": "\\(\\frac{2}{3}\\)"}},
      {sec:"2-3",
       secName:"填空題",
       title:"第 7 題｜乘積法則（含 ln）",
       points:[],
       caption:"提示：兩個因子各導一次",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "乘積法則", "tex": "(uv)'=u'v+uv'", "color": "#7c3aed", "fill": "#f7f9fd", "border": "#7c3aed", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "已知 \\(f(x)={x}^{2}\\ln x\\)，則 \\({f}'(e)=\\)＿＿＿＿＿＿。", "steps": ["\\({f}'(x)=2x\\ln x+{x}^{2}⋅\\frac{1}{x}=2x\\ln x+x\\)，\\({f}'(e)=2e+e=3e\\)。"], "ans": "\\(3e\\)"}},
      {sec:"2-3",
       secName:"填空題",
       title:"第 8 題｜平方的三角函數",
       points:[],
       caption:"提示：\\({\\sin }^{2}x=(\\sin \\,x{)}^{2}\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "鏈式法則", "tex": "\\frac{dy}{dx}=\\frac{dy}{du}\\cdot \\frac{du}{dx}", "color": "#7c3aed", "fill": "#f7f9fd", "border": "#7c3aed", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "已知 \\(f(x)={\\sin }^{2}x\\)，則 \\({f}'\\left( \\frac{\\pi }{4} \\right)=\\)＿＿＿＿＿＿。", "steps": ["\\({f}'(x)=2\\sin x\\cos x=\\sin 2x\\)，\\({f}'\\left( \\frac{\\pi }{4} \\right)=\\sin \\frac{\\pi }{2}=1\\)。"], "ans": "\\(1\\)"}},
      {sec:"2-3",
       secName:"填空題",
       title:"第 9 題｜二階導數",
       points:[],
       caption:"提示：對 \\(f'(x)\\) 再求導一次",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#7c3aed", "fill": "#f7f9fd", "border": "#7c3aed", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "已知 \\(f(x)={x}^{3}-2{x}^{2}+x\\)，則 \\({f}''(1)=\\)＿＿＿＿＿＿。", "steps": ["\\({f}'(x)=3{x}^{2}-4x+1\\)，\\({f}''(x)=6x-4\\)，\\({f}''(1)=2\\)。"], "ans": "\\(2\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（1）",
       visual:(h)=>K.steps(h,["💡 先判斷是乘積、商還是複合。先自己算，再拖動滑桿看步驟。", "（1）\\({y}'=2x\\sin x+{x}^{2}\\cos x\\)。"]),
       caption:"題幹：求下列函數的導數。",
       example:{"q": "（1）\\(y={x}^{2}\\sin x\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（2）",
       visual:(h)=>K.steps(h,["💡 先判斷是乘積、商還是複合。先自己算，再拖動滑桿看步驟。", "（2）\\({y}'=\\frac{2x(x-1)-({x}^{2}+1)⋅1}{(x-1{)}^{2}}=\\frac{{x}^{2}-2x-1}{(x-1{)}^{2}}\\)。"]),
       caption:"題幹：求下列函數的導數。",
       example:{"q": "（2）\\(y=\\frac{{x}^{2}+1}{x-1}\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（3）",
       visual:(h)=>K.steps(h,["💡 先判斷是乘積、商還是複合。先自己算，再拖動滑桿看步驟。", "（3）\\(y=(1+{x}^{2}{)}^{\\frac{1}{2}}\\)，\\({y}'=\\frac{1}{2}(1+{x}^{2}{)}^{-\\frac{1}{2}}⋅2x=\\frac{x}{\\sqrt{1+{x}^{2}}}\\)。"]),
       caption:"題幹：求下列函數的導數。",
       example:{"q": "（3）\\(y=\\sqrt{1+{x}^{2}}\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（4）",
       visual:(h)=>K.steps(h,["💡 先判斷是乘積、商還是複合。先自己算，再拖動滑桿看步驟。", "（4）\\({y}'=-{e}^{-x}\\cos x+{e}^{-x}(-\\sin x)=-{e}^{-x}(\\sin x+\\cos x)\\)。"]),
       caption:"題幹：求下列函數的導數。",
       example:{"q": "（4）\\(y={e}^{-x}\\cos x\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（1）",
       visual:(h)=>K.steps(h,["💡 乘積法則＋二階導數。先自己算，再拖動滑桿看步驟。", "（1）\\({f}'(x)=1⋅\\ln x+x⋅\\frac{1}{x}=\\ln x+1\\)。", "答：\\(\\ln x+1\\)"]),
       caption:"題幹：已知函數 \\(f(x)=x\\ln x\\)（\\(x&gt;0\\)）。",
       example:{"q": "（1）求 \\({f}'(x)\\)", "ans": "\\(\\ln x+1\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（2）",
       visual:(h)=>K.steps(h,["💡 乘積法則＋二階導數。先自己算，再拖動滑桿看步驟。", "（2）\\({f}''(x)=\\frac{1}{x}\\)。", "答：\\(\\frac{1}{x}\\)"]),
       caption:"題幹：已知函數 \\(f(x)=x\\ln x\\)（\\(x&gt;0\\)）。",
       example:{"q": "（2）求 \\({f}''(x)\\)", "ans": "\\(\\frac{1}{x}\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（3）",
       visual:(h)=>K.steps(h,["💡 乘積法則＋二階導數。先自己算，再拖動滑桿看步驟。", "（3）\\(\\ln x+1=0\\Rightarrow \\ln x=-1\\Rightarrow x=\\frac{1}{e}\\)。", "答：\\(x=\\frac{1}{e}\\)"]),
       caption:"題幹：已知函數 \\(f(x)=x\\ln x\\)（\\(x&gt;0\\)）。",
       example:{"q": "（3）解方程 \\({f}'(x)=0\\)", "ans": "\\(x=\\frac{1}{e}\\)"}},
      {sec:"2-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（4）",
       visual:(h)=>K.steps(h,["💡 乘積法則＋二階導數。先自己算，再拖動滑桿看步驟。", "（4）\\(g(x)=2x\\ln 2x\\)，\\({g}'(x)=2\\ln 2x+2x⋅\\frac{2}{2x}=2\\ln 2x+2\\)（或 \\({g}'(x)=2{f}'(2x)\\)）。", "答：\\(2\\ln 2x+2\\)"]),
       caption:"題幹：已知函數 \\(f(x)=x\\ln x\\)（\\(x&gt;0\\)）。",
       example:{"q": "（4）若 \\(g(x)=f(2x)\\)，求 \\({g}'(x)\\)。", "ans": "\\(2\\ln 2x+2\\)"}}
    ]
  });
})();
