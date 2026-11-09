/* 第 4 章 工作紙四　導數的應用：單調性、極值、最值與拐點。節次：4-1 重點回顧、4-2 選擇題、4-3 填空題、4-4 解答題
   範圍以「第一段考後複習工作紙（四）」為限；本檔由 build/build_site.py 產生，公式 TeX 皆由 OMML 轉出，請勿手改。 */
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
    ch: 4,
    title: "工作紙四　導數的應用：單調性、極值、最值與拐點",
    color: "#d97706",
    sections: ["4-1 重點回顧", "4-2 選擇題", "4-3 填空題", "4-4 解答題"],
    slides: [
      {sec:"4-1",
       secName:"重點回顧",
       title:"f′ 的正負決定遞增或遞減",
       points:["\\(f'&gt;0\\) 遞增，\\(f'&lt;0\\) 遞減", "f′ 變號的地方就是極值點"],
       formula:{"label": "單調性", "tex": "f'(x)&gt;0\\Rightarrow f(x)\\text{ 遞增}"},
       visual:(h)=>{const f=x=>x*x*x-3*x*x-9*x+5,d=x=>3*x*x-6*x-9;K.slide(h,{min:-2,max:4,step:0.25,val:0,
         text:v=>`x＝<span class="ival">${K.n(v,2)}</span>　f′＝${K.n(d(v),1)}　${d(v)>0?'遞增':d(v)<0?'遞減':'駐點'}`,
         fig:v=>K.plot({x:[-2.5,4.5],y:[-25,14],xt:[-1,3],yt:[10,-20],fs:[{f},{f:x=>f(v)+d(v)*(x-v),a:v-0.8,b:v+0.8,c:'#e11d48',w:3}],pts:[{x:v,y:f(v),c:d(v)>=0?'#059669':'#e11d48'}]})})},
       caption:"\\(f(x)={x}^{3}-3{x}^{2}-9x+5\\)：拖動 x，比較切線方向與 f′ 的正負"},
      {sec:"4-1",
       secName:"重點回顧",
       title:"極值與拐點的判別",
       points:["極值看 \\(f'\\) 變號或 \\(f''\\) 的正負", "拐點看 \\(f''\\) 變號"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "極大", "tex": "f'(a)=0,f''(a)&lt;0\\Rightarrow \\text{極大}", "color": "#d97706", "fill": "#f7f9fd", "border": "#d97706", "w": "100%", "pad": "8px 4px"}, {"label": "極小", "tex": "f'(a)=0,f''(a)&gt;0\\Rightarrow \\text{極小}", "color": "#d97706", "fill": "#f7f9fd", "border": "#d97706", "w": "100%", "pad": "8px 4px"}, {"label": "拐點", "tex": "f''(x)\\text{ 變號}\\Rightarrow \\text{拐點}", "color": "#d97706", "fill": "#f7f9fd", "border": "#d97706", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"4-2",
       secName:"選擇題",
       title:"第 1 題｜遞減區間",
       points:[],
       caption:"提示：解 \\(f'(x)&lt;0\\)",
       visual:(h)=>K.opts(h,[["A", "\\((-\\infty ,0)\\)"], ["B", "\\((0,2)\\)"], ["C", "\\((2,+\\infty )\\)"], ["D", "\\((-\\infty ,2)\\)"]],2),
       example:{"q": "函數 \\(f(x)={x}^{3}-3{x}^{2}\\) 的單調遞減區間是（　　）", "steps": ["\\({f}'(x)=3{x}^{2}-6x=3x(x-2)&lt;0\\Rightarrow 0&lt;x&lt;2\\)。"], "ans": "(B) \\((0,2)\\)"}},
      {sec:"4-2",
       secName:"選擇題",
       title:"第 2 題｜極小值點",
       points:[],
       caption:"提示：看 \\(f'\\) 在哪裡由負變正",
       visual:(h)=>K.opts(h,[["A", "\\(x=-1\\)"], ["B", "\\(x=0\\)"], ["C", "\\(x=1\\)"], ["D", "\\(x=\\sqrt{3}\\)"]],2),
       example:{"q": "函數 \\(f(x)=2{x}^{3}-6x\\) 的極小值點為（　　）", "steps": ["\\({f}'(x)=6(x+1)(x-1)\\)，在 \\(x=1\\) 處 \\({f}'\\) 由負變正，為極小值點。"], "ans": "(C) \\(x=1\\)"}},
      {sec:"4-2",
       secName:"選擇題",
       title:"第 3 題｜含 ln 的極值",
       points:[],
       caption:"提示：先寫定義域 \\(x&gt;0\\)",
       visual:(h)=>K.opts(h,[["A", "\\(1\\)"], ["B", "\\(0\\)"], ["C", "\\(e\\)"], ["D", "\\(e-1\\)"]],2),
       example:{"q": "函數 \\(f(x)=x-\\ln x\\) 的極小值為（　　）", "steps": ["定義域 \\(x&gt;0\\)，\\({f}'(x)=1-\\frac{1}{x}=\\frac{x-1}{x}\\)，\\(x=1\\) 處由負變正，極小值 \\(f(1)=1\\)。"], "ans": "(A) \\(1\\)"}},
      {sec:"4-2",
       secName:"選擇題",
       title:"第 4 題｜恆遞增求參數",
       points:[],
       caption:"提示：\\(f'(x)\\ge 0\\) 對所有 x 成立",
       visual:(h)=>K.opts(h,[["A", "\\(a\\le 3\\)"], ["B", "\\(a&lt;3\\)"], ["C", "\\(a&gt;3\\)"], ["D", "\\(a\\ge 3\\)"]],2),
       example:{"q": "若函數 \\(f(x)={x}^{3}+3{x}^{2}+ax\\) 在 \\(\\mathbb{R}\\) 上單調遞增，則實數 \\(a\\) 的取值範圍是（　　）", "steps": ["\\({f}'(x)=3{x}^{2}+6x+a\\ge 0\\) 恆成立，\\(\\Delta =36-12a\\le 0\\)，得 \\(a\\ge 3\\)。"], "ans": "(D) \\(a\\ge 3\\)"}},
      {sec:"4-2",
       secName:"選擇題",
       title:"第 5 題｜拐點",
       points:[],
       caption:"提示：解 \\(f''(x)=0\\) 並確認變號",
       visual:(h)=>K.opts(h,[["A", "\\((0,1)\\)"], ["B", "\\((1,-1)\\)"], ["C", "\\((2,-3)\\)"], ["D", "\\((-1,-3)\\)"]],1),
       example:{"q": "曲線 \\(y={x}^{3}-3{x}^{2}+1\\) 的拐點為（　　）", "steps": ["\\({y}''=6x-6\\)，\\(x=1\\) 兩側 \\({y}''\\) 變號，\\(y(1)=-1\\)，拐點 \\((1,-1)\\)。"], "ans": "(B) \\((1,-1)\\)"}},
      {sec:"4-3",
       secName:"填空題",
       title:"第 6 題｜極大值",
       points:[],
       caption:"提示：先找駐點，再判斷極大",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "極大", "tex": "f'(a)=0,f''(a)&lt;0\\Rightarrow \\text{極大}", "color": "#d97706", "fill": "#f7f9fd", "border": "#d97706", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "函數 \\(f(x)={x}^{3}-12x\\) 的極大值為＿＿＿＿＿＿。", "steps": ["\\({f}'(x)=3(x+2)(x-2)\\)，極大值點 \\(x=-2\\)，\\(f(-2)=-8+24=16\\)。"], "ans": "\\(16\\)"}},
      {sec:"4-3",
       secName:"填空題",
       title:"第 7 題｜乘積型的極值",
       points:[],
       caption:"提示：\\(f'(x)=(x+1){e}^{x}\\) 的正負",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "極小", "tex": "f'(a)=0,f''(a)&gt;0\\Rightarrow \\text{極小}", "color": "#d97706", "fill": "#f7f9fd", "border": "#d97706", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "函數 \\(f(x)=x{e}^{x}\\) 的極小值為＿＿＿＿＿＿。", "steps": ["\\({f}'(x)=(x+1){e}^{x}\\)，\\(x=-1\\) 處由負變正，極小值 \\(f(-1)=-\\frac{1}{e}\\)。"], "ans": "\\(-\\frac{1}{e}\\)"}},
      {sec:"4-3",
       secName:"填空題",
       title:"第 8 題｜閉區間最值",
       points:[],
       caption:"提示：比較駐點與端點的函數值",
       visual:(h)=>{const f=x=>x*x*x-3*x;h.innerHTML=K.plot({x:[-0.4,2.4],y:[-2.6,2.6],xt:[1,2],yt:[2,-2],shade:[],fs:[{f,a:0,b:2},{f,a:-0.4,b:0,c:'#a0aec0',w:2,dash:'6 5'},{f,a:2,b:2.4,c:'#a0aec0',w:2,dash:'6 5'}],vl:[{x:0,c:'#a0aec0'},{x:2,c:'#a0aec0'}]})},
       example:{"q": "函數 \\(f(x)={x}^{3}-3x\\) 在閉區間 \\([0,2]\\) 上的最大值為＿＿＿＿，最小值為＿＿＿＿。", "steps": ["駐點 \\(x=1\\)（\\(x=-1\\) 不在區間內）；\\(f(0)=0\\)，\\(f(1)=-2\\)，\\(f(2)=2\\)。"], "ans": "最大值 \\(2\\)，最小值 \\(-2\\)"}},
      {sec:"4-3",
       secName:"填空題",
       title:"第 9 題｜由極值求參數",
       points:[],
       caption:"提示：兩個條件：\\(f'(1)=0\\)、\\(f(1)=-2\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#d97706", "fill": "#f7f9fd", "border": "#d97706", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "若 \\(f(x)={x}^{3}+a{x}^{2}+bx\\) 在 \\(x=1\\) 處取得極值 \\(-2\\)，則 \\(a=\\)＿＿＿＿，\\(b=\\)＿＿＿＿。", "steps": ["\\({f}'(1)=3+2a+b=0\\)，\\(f(1)=1+a+b=-2\\)，解得 \\(a=0\\)，\\(b=-3\\)；", "檢驗：\\({f}'(x)=3{x}^{2}-3\\) 在 \\(x=1\\) 兩側變號。"], "ans": "\\(a=0\\)，\\(b=-3\\)"}},
      {sec:"4-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（1）",
       visual:(h)=>K.steps(h,["💡 f′ 看增減與極值，f″ 看拐點。先自己算，再拖動滑桿看步驟。", "（1）\\({f}'(x)=3{x}^{2}-6x-9=3(x+1)(x-3)\\)，\\({f}''(x)=6x-6\\)。"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}-9x+5\\)。",
       example:{"q": "（1）求 \\({f}'(x)\\) 及 \\({f}''(x)\\)"}},
      {sec:"4-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（2）",
       visual:(h)=>K.steps(h,["💡 f′ 看增減與極值，f″ 看拐點。先自己算，再拖動滑桿看步驟。", "（2）遞增區間 \\((-\\infty ,-1)\\)、\\((3,+\\infty )\\)；遞減區間 \\((-1,3)\\)。"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}-9x+5\\)。",
       example:{"q": "（2）求 \\(f(x)\\) 的單調區間"}},
      {sec:"4-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（3）",
       visual:(h)=>K.steps(h,["💡 f′ 看增減與極值，f″ 看拐點。先自己算，再拖動滑桿看步驟。", "（3）\\({f}''(-1)=-12&lt;0\\)，極大值 \\(f(-1)=10\\)；\\({f}''(3)=12&gt;0\\)，極小值 \\(f(3)=-22\\)。"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}-9x+5\\)。",
       example:{"q": "（3）求 \\(f(x)\\) 的極大值和極小值"}},
      {sec:"4-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（4）",
       visual:(h)=>K.steps(h,["💡 f′ 看增減與極值，f″ 看拐點。先自己算，再拖動滑桿看步驟。", "（4）\\({f}''(x)=0\\Rightarrow x=1\\)，兩側變號，\\(f(1)=-6\\)，拐點 \\((1,-6)\\)。"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}-9x+5\\)。",
       example:{"q": "（4）求曲線的拐點"}},
      {sec:"4-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（5）",
       visual:(h)=>K.steps(h,["💡 f′ 看增減與極值，f″ 看拐點。先自己算，再拖動滑桿看步驟。", "（5）\\(f(-2)=3\\)，\\(f(-1)=10\\)，\\(f(3)=-22\\)，\\(f(4)=-15\\)；最大值 \\(10\\)，最小值 \\(-22\\)。"]),
       caption:"題幹：已知函數 \\(f(x)={x}^{3}-3{x}^{2}-9x+5\\)。",
       example:{"q": "（5）求 \\(f(x)\\) 在閉區間 \\([-2,4]\\) 上的最大值和最小值。"}},
      {sec:"4-4",
       secName:"解答題",
       points:[],
       title:"第 11 題｜方程的實根個數",
       visual:(h)=>K.steps(h,["💡 看 \\(y=-m\\) 與曲線交點數。先自己算，再拖動滑桿看步驟。", "\\({g}'(x)=3{x}^{2}-3=3(x+1)(x-1)\\)，極大值 \\(g(-1)=2\\)，極小值 \\(g(1)=-2\\)。", "直線 \\(y=-m\\) 與 \\(y=g(x)\\) 有三個交點 \\(⇔-2&lt;-m&lt;2\\)，", "故 \\(-2&lt;m&lt;2\\)。", "答：\\(-2&lt;m&lt;2\\)"]),
       caption:"方程的實根個數",
       example:{"q": "已知方程 \\({x}^{3}-3x+m=0\\) 有三個不同的實數根，求實數 \\(m\\) 的取值範圍。", "ans": "\\(-2&lt;m&lt;2\\)"}}
    ]
  });
})();
