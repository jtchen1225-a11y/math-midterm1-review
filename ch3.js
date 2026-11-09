/* 第 3 章 工作紙三　導數的幾何意義：切線斜率與切線方程。節次：3-1 重點回顧、3-2 選擇題、3-3 填空題、3-4 解答題
   範圍以「第一段考後複習工作紙（三）」為限；本檔由 build/build_site.py 產生，公式 TeX 皆由 OMML 轉出，請勿手改。 */
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
    ch: 3,
    title: "工作紙三　導數的幾何意義：切線斜率與切線方程",
    color: "#059669",
    sections: ["3-1 重點回顧", "3-2 選擇題", "3-3 填空題", "3-4 解答題"],
    slides: [
      {sec:"3-1",
       secName:"重點回顧",
       title:"切線斜率就是 f′(a)",
       points:["先求 \\(f'(a)\\) 得斜率", "再用點斜式寫切線"],
       formula:{"label": "切線", "tex": "y-f(a)=f'(a)(x-a)"},
       visual:(h)=>{const f=x=>x*x*x-3*x*x+2,d=x=>3*x*x-6*x;K.slide(h,{min:-1,max:3,step:0.25,val:-0.5,
         text:v=>`a ＝ <span class="ival">${K.n(v,2)}</span>　斜率 ＝ ${K.n(d(v),2)}`,
         fig:v=>K.plot({x:[-1.6,3.6],y:[-4,4],xt:[-1,2],yt:[2],fs:[{f},{f:x=>f(v)+d(v)*(x-v),c:'#e11d48',w:3}],pts:[{x:v,y:f(v),t:'P',dx:0,dy:-14}]})})},
       caption:"\\(y={x}^{3}-3{x}^{2}+2\\)：拖動切點，看斜率的正負與大小"},
      {sec:"3-1",
       secName:"重點回顧",
       title:"過曲線外一點作切線：先設切點",
       points:["已知點不在曲線上，不能直接代", "設切點 \\((t,f(t))\\)，代入已知點解 t"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "切點式切線", "tex": "y-f(t)=f'(t)(x-t)", "color": "#059669", "fill": "#f7f9fd", "border": "#059669", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"3-2",
       secName:"選擇題",
       title:"第 1 題｜切線斜率",
       points:[],
       caption:"提示：斜率 \\(k=f'(1)\\)",
       visual:(h)=>K.opts(h,[["A", "\\(-1\\)"], ["B", "\\(0\\)"], ["C", "\\(1\\)"], ["D", "\\(2\\)"]],2),
       example:{"q": "曲線 \\(y={x}^{3}-2x\\) 在點 \\((1,-1)\\) 處的切線斜率為（　　）", "steps": ["\\({y}'=3{x}^{2}-2\\)，\\(x=1\\) 時 \\(k=3-2=1\\)。"], "ans": "(C) \\(1\\)"}},
      {sec:"3-2",
       secName:"選擇題",
       title:"第 2 題｜切線方程",
       points:[],
       caption:"提示：斜率加切點，用點斜式",
       visual:(h)=>K.opts(h,[["A", "\\(y=x+1\\)"], ["B", "\\(y=x-1\\)"], ["C", "\\(y=ex\\)"], ["D", "\\(y=2x+1\\)"]],2),
       example:{"q": "曲線 \\(y={e}^{x}\\) 在點 \\((0,1)\\) 處的切線方程為（　　）", "steps": ["\\({y}'={e}^{x}\\)，\\(k={e}^{0}=1\\)，切線 \\(y-1=1⋅(x-0)\\)，即 \\(y=x+1\\)。"], "ans": "(A) \\(y=x+1\\)"}},
      {sec:"3-2",
       secName:"選擇題",
       title:"第 3 題｜傾斜角",
       points:[],
       caption:"提示：\\(\\tan \\,\\theta =k\\)，\\(\\theta \\in [0,\\pi )\\)",
       visual:(h)=>K.opts(h,[["A", "\\(\\frac{\\pi }{6}\\)"], ["B", "\\(\\frac{\\pi }{4}\\)"], ["C", "\\(\\frac{\\pi }{3}\\)"], ["D", "\\(\\frac{3\\pi }{4}\\)"]],2),
       example:{"q": "曲線 \\(y=\\frac{1}{3}{x}^{3}\\) 在 \\(x=1\\) 處切線的傾斜角為（　　）", "steps": ["\\({y}'={x}^{2}\\)，\\(k=1\\)，\\(\\tan \\theta =1\\)，\\(\\theta \\in [0,\\pi )\\)，故 \\(\\theta =\\frac{\\pi }{4}\\)。"], "ans": "(B) \\(\\frac{\\pi }{4}\\)"}},
      {sec:"3-2",
       secName:"選擇題",
       title:"第 4 題｜平行切線",
       points:[],
       caption:"提示：平行 ⇒ 斜率相等",
       visual:(h)=>K.opts(h,[["A", "\\((1,1)\\)"], ["B", "\\((-2,4)\\)"], ["C", "\\((4,16)\\)"], ["D", "\\((2,4)\\)"]],2),
       example:{"q": "曲線 \\(y={x}^{2}\\) 的一條切線與直線 \\(y=4x-1\\) 平行，則切點坐標為（　　）", "steps": ["切線斜率 \\(=4\\)，\\({y}'=2x=4\\Rightarrow x=2\\)，切點 \\((2,4)\\)。"], "ans": "(D) \\((2,4)\\)"}},
      {sec:"3-2",
       secName:"選擇題",
       title:"第 5 題｜由斜率求參數",
       points:[],
       caption:"提示：先求導，再代 x＝1",
       visual:(h)=>K.opts(h,[["A", "\\(1\\)"], ["B", "\\(2\\)"], ["C", "\\(3\\)"], ["D", "\\(4\\)"]],2),
       example:{"q": "若曲線 \\(y={x}^{2}+ax\\) 在 \\(x=1\\) 處的切線斜率為 \\(5\\)，則 \\(a=\\)（　　）", "steps": ["\\({y}'=2x+a\\)，\\(x=1\\) 時 \\(2+a=5\\)，得 \\(a=3\\)。"], "ans": "(C) \\(3\\)"}},
      {sec:"3-3",
       secName:"填空題",
       title:"第 6 題｜切線方程",
       points:[],
       caption:"提示：先確認點在曲線上",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "切線", "tex": "y-f(a)=f'(a)(x-a)", "color": "#059669", "fill": "#f7f9fd", "border": "#059669", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "曲線 \\(y=2{x}^{3}-x\\) 在點 \\((1,1)\\) 處的切線方程為＿＿＿＿＿＿。", "steps": ["\\({y}'=6{x}^{2}-1\\)，\\(k=5\\)，\\(y-1=5(x-1)\\)，即 \\(y=5x-4\\)。"], "ans": "\\(y=5x-4\\)"}},
      {sec:"3-3",
       secName:"填空題",
       title:"第 7 題｜三角函數的切線",
       points:[],
       caption:"提示：斜率 \\(=\\cos \\,\\pi\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "切線", "tex": "y-f(a)=f'(a)(x-a)", "color": "#059669", "fill": "#f7f9fd", "border": "#059669", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "曲線 \\(y=\\sin x\\) 在點 \\((\\pi ,0)\\) 處的切線方程為＿＿＿＿＿＿。", "steps": ["\\({y}'=\\cos x\\)，\\(k=\\cos \\pi =-1\\)，\\(y-0=-(x-\\pi )\\)，即 \\(y=-x+\\pi\\)。"], "ans": "\\(y=-x+\\pi\\)"}},
      {sec:"3-3",
       secName:"填空題",
       title:"第 8 題｜對數函數的切線",
       points:[],
       caption:"提示：斜率 \\(=\\frac{1}{e}\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "切線", "tex": "y-f(a)=f'(a)(x-a)", "color": "#059669", "fill": "#f7f9fd", "border": "#059669", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "曲線 \\(y=\\ln x\\) 在點 \\((e,1)\\) 處的切線方程為＿＿＿＿＿＿。", "steps": ["\\({y}'=\\frac{1}{x}\\)，\\(k=\\frac{1}{e}\\)，\\(y-1=\\frac{1}{e}(x-e)\\)，即 \\(y=\\frac{1}{e}x\\)。"], "ans": "\\(y=\\frac{1}{e}x\\)"}},
      {sec:"3-3",
       secName:"填空題",
       title:"第 9 題｜過原點的切線",
       points:[],
       caption:"提示：原點不在曲線上，先設切點",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "切點式切線", "tex": "y-f(t)=f'(t)(x-t)", "color": "#059669", "fill": "#f7f9fd", "border": "#059669", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "過原點作曲線 \\(y={x}^{2}+1\\) 的切線，切線方程為＿＿＿＿＿＿。", "steps": ["設切點 \\((t,{t}^{2}+1)\\)，切線 \\(y=2tx-{t}^{2}+1\\)；過原點：\\(1-{t}^{2}=0\\)，\\(t=\\pm 1\\)，得 \\(y=\\pm 2x\\)。"], "ans": "\\(y=2x\\) 或 \\(y=-2x\\)"}},
      {sec:"3-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（1）",
       visual:(h)=>K.steps(h,["💡 切點是聯立方程的重根。先自己算，再拖動滑桿看步驟。", "（1）\\({f}'(x)=3{x}^{2}-6x\\)。", "答：\\(3{x}^{2}-6x\\)"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}+2\\)。",
       example:{"q": "（1）求 \\({f}'(x)\\)", "ans": "\\(3{x}^{2}-6x\\)"}},
      {sec:"3-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（2）",
       visual:(h)=>K.steps(h,["💡 切點是聯立方程的重根。先自己算，再拖動滑桿看步驟。", "（2）\\({f}'(-1)=3+6=9\\)，切線 \\(l\\)：\\(y+2=9(x+1)\\)，即 \\(y=9x+7\\)。", "答：\\(y=9x+7\\)"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}+2\\)。",
       example:{"q": "（2）求曲線 \\(y=f(x)\\) 在點 \\(P(-1,-2)\\) 處的切線 \\(l\\) 的方程", "ans": "\\(y=9x+7\\)"}},
      {sec:"3-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（3）",
       visual:(h)=>K.steps(h,["💡 切點是聯立方程的重根。先自己算，再拖動滑桿看步驟。", "（3）聯立 \\({x}^{3}-3{x}^{2}+2=9x+7\\)，得 \\({x}^{3}-3{x}^{2}-9x-5=0\\)。", "切點 \\(x=-1\\) 是重根：\\((x+1{)}^{2}(x-5)=0\\)，另一交點 \\(x=5\\)，", "\\(y=9\\times 5+7=52\\)，故 \\(Q(5,52)\\)。", "答：\\(Q(5,52)\\)"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}+2\\)。",
       example:{"q": "（3）求切線 \\(l\\) 與曲線的另一個交點 \\(Q\\) 的坐標。", "ans": "\\(Q(5,52)\\)"}},
      {sec:"3-4",
       secName:"解答題",
       points:[],
       title:"第 11 題｜過曲線外一點作切線",
       visual:(h)=>K.steps(h,["💡 點 (1, −3) 不在曲線上，先設切點。先自己算，再拖動滑桿看步驟。", "設切點 \\((t,{t}^{2})\\)，斜率 \\(2t\\)，切線 \\(y-{t}^{2}=2t(x-t)\\)，即 \\(y=2tx-{t}^{2}\\)。", "代入 \\((1,-3)\\)：\\(-3=2t-{t}^{2}\\)，\\({t}^{2}-2t-3=0\\)，\\((t-3)(t+1)=0\\)，\\(t=3\\) 或 \\(t=-1\\)。", "\\(t=3\\)：切點 \\((3,9)\\)，切線 \\(y=6x-9\\)；", "\\(t=-1\\)：切點 \\((-1,1)\\)，切線 \\(y=-2x-1\\)。", "答：\\(y=6x-9\\) 或 \\(y=-2x-1\\)"]),
       caption:"過曲線外一點作切線",
       example:{"q": "求過點 \\((1,-3)\\) 且與曲線 \\(y={x}^{2}\\) 相切的直線方程。", "ans": "\\(y=6x-9\\) 或 \\(y=-2x-1\\)"}}
    ]
  });
})();
