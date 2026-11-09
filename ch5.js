/* 第 5 章 工作紙五　不定積分與定積分的計算。節次：5-1 重點回顧、5-2 選擇題、5-3 填空題、5-4 解答題
   範圍以「第一段考後複習工作紙（五）」為限；本檔由 build/build_site.py 產生，公式 TeX 皆由 OMML 轉出，請勿手改。 */
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
    ch: 5,
    title: "工作紙五　不定積分與定積分的計算",
    color: "#e11d48",
    sections: ["5-1 重點回顧", "5-2 選擇題", "5-3 填空題", "5-4 解答題"],
    slides: [
      {sec:"5-1",
       secName:"重點回顧",
       title:"變上限積分：對上限求導",
       points:["\\(F(x)\\) 是帶正負號的面積", "\\(F'(x)=f(x)\\)，可用來求極值"],
       formula:{"label": "基本定理", "tex": "\\frac{d}{dx}\\int_{a}^{x} f(t)\\,dt=f(x)"},
       visual:(h)=>{const f=t=>t*t-2*t-3,F=x=>x*x*x/3-x*x-3*x;K.slide(h,{min:-2,max:4,step:0.25,val:2,
         text:v=>`x ＝ <span class="ival">${K.n(v,2)}</span>　F(x) ＝ ${K.n(F(v),2)}`,
         fig:v=>K.plot({x:[-2.4,4.4],y:[-5,6],xt:[-1,3],yt:[5],shade:[{f,a:0,b:v,c:'rgba(225,29,72,.25)'}],fs:[{f}],vl:[{x:v,c:'#7c3aed'}]})})},
       caption:"\\(f(t)={t}^{2}-2t-3\\)：軸上方面積為正、下方為負，合起來就是 F(x)"},
      {sec:"5-1",
       secName:"重點回顧",
       title:"基本積分公式：冪與倒數",
       points:["積分後求導驗算最可靠", "\\(n\\ne -1\\) 才能用冪公式"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "\\int {x}^{n}\\,dx=\\frac{{x}^{n+1}}{n+1}+C", "color": "#e11d48", "fill": "#f7f9fd", "border": "#e11d48", "w": "100%", "pad": "8px 4px"}, {"label": "倒數", "tex": "\\int \\frac{1}{x}\\,dx=\\ln \\,|x|+C", "color": "#e11d48", "fill": "#f7f9fd", "border": "#e11d48", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"5-1",
       secName:"重點回顧",
       title:"基本積分公式：指數與三角",
       points:["內層是 ax 時，結果要除以 a"],
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "指數", "tex": "\\int {e}^{ax}\\,dx=\\frac{1}{a}{e}^{ax}+C", "color": "#e11d48", "fill": "#f7f9fd", "border": "#e11d48", "w": "100%", "pad": "8px 4px"}, {"label": "三角", "tex": "\\int \\cos \\,ax\\,dx=\\frac{1}{a}\\sin \\,ax+C", "color": "#e11d48", "fill": "#f7f9fd", "border": "#e11d48", "w": "100%", "pad": "8px 4px"}])}},
      {sec:"5-2",
       secName:"選擇題",
       title:"第 1 題｜冪函數積分",
       points:[],
       caption:"提示：逐項積分，別忘了 C",
       visual:(h)=>K.opts(h,[["A", "\\(6x+4+C\\)"], ["B", "\\({x}^{3}+4{x}^{2}-x+C\\)"], ["C", "\\({x}^{3}+2{x}^{2}-x+C\\)"], ["D", "\\(3{x}^{3}+2{x}^{2}-x+C\\)"]],1),
       example:{"q": "不定積分 \\(\\int (3{x}^{2}+4x-1)\\,dx\\) 等於（　　）", "steps": ["\\(\\int (3{x}^{2}+4x-1)\\,dx={x}^{3}+2{x}^{2}-x+C\\)。"], "ans": "(C) \\({x}^{3}+2{x}^{2}-x+C\\)"}},
      {sec:"5-2",
       secName:"選擇題",
       title:"第 2 題｜三角函數積分",
       points:[],
       caption:"提示：結果要除以 3",
       visual:(h)=>K.opts(h,[["A", "\\(3\\sin 3x+C\\)"], ["B", "\\(\\frac{1}{3}\\sin 3x+C\\)"], ["C", "\\(-\\frac{1}{3}\\sin 3x+C\\)"], ["D", "\\(\\sin 3x+C\\)"]],1),
       example:{"q": "不定積分 \\(\\int \\cos 3x\\,dx\\) 等於（　　）", "steps": ["\\({\\left( \\frac{1}{3}\\sin 3x \\right)}'=\\cos 3x\\)，故選 (B)。"], "ans": "(B) \\(\\frac{1}{3}\\sin 3x+C\\)"}},
      {sec:"5-2",
       secName:"選擇題",
       title:"第 3 題｜牛頓－萊布尼茲公式",
       points:[],
       caption:"提示：先求原函數，再上減下",
       visual:(h)=>K.opts(h,[["A", "\\(6\\)"], ["B", "\\(4\\)"], ["C", "\\(8\\)"], ["D", "\\(10\\)"]],2),
       example:{"q": "定積分 \\(\\int_{1}^{3} (2x-1)\\,dx\\) 的值為（　　）", "steps": ["\\({\\left[ {x}^{2}-x \\right]}_{1}^{3}=(9-3)-(1-1)=6\\)。"], "ans": "(A) \\(6\\)"}},
      {sec:"5-2",
       secName:"選擇題",
       title:"第 4 題｜1/x 的定積分",
       points:[],
       caption:"提示：\\(\\ln \\,{e}^{2}=2\\)",
       visual:(h)=>K.opts(h,[["A", "\\(1\\)"], ["B", "\\(2\\)"], ["C", "\\(e\\)"], ["D", "\\({e}^{2}\\)"]],2),
       example:{"q": "定積分 \\(\\int_{1}^{{e}^{2}} \\frac{1}{x}\\,dx\\) 的值為（　　）", "steps": ["\\({\\left[ \\ln x \\right]}_{1}^{{e}^{2}}=2-0=2\\)。"], "ans": "(B) \\(2\\)"}},
      {sec:"5-2",
       secName:"選擇題",
       title:"第 5 題｜變上限積分求導",
       points:[],
       caption:"提示：直接把上限代入被積函數",
       visual:(h)=>K.opts(h,[["A", "\\(0\\)"], ["B", "\\(2\\)"], ["C", "\\(4\\)"], ["D", "\\(6\\)"]],2),
       example:{"q": "設 \\(g(x)=\\int_{0}^{x} ({t}^{3}-t)\\,dt\\)，則 \\({g}'(2)=\\)（　　）", "steps": ["\\({g}'(x)={x}^{3}-x\\)，\\({g}'(2)=8-2=6\\)。"], "ans": "(D) \\(6\\)"}},
      {sec:"5-3",
       secName:"填空題",
       title:"第 6 題｜代換積分",
       points:[],
       caption:"提示：令 \\(u={x}^{2}+1\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數積分", "tex": "\\int {x}^{n}\\,dx=\\frac{{x}^{n+1}}{n+1}+C", "color": "#e11d48", "fill": "#f7f9fd", "border": "#e11d48", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "\\(\\int x({x}^{2}+1{)}^{4}\\,dx=\\)＿＿＿＿＿＿。", "steps": ["令 \\(u={x}^{2}+1\\)，\\(du=2x\\,dx\\)，原式 \\(=\\frac{1}{2}\\int {u}^{4}\\,du=\\frac{{u}^{5}}{10}+C\\)。"], "ans": "\\(\\frac{({x}^{2}+1{)}^{5}}{10}+C\\)"}},
      {sec:"5-3",
       secName:"填空題",
       title:"第 7 題｜定積分代換",
       points:[],
       caption:"提示：令 \\(u={x}^{2}\\)，上下限一起換",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#e11d48", "fill": "#f7f9fd", "border": "#e11d48", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "\\(\\int_{0}^{1} x{e}^{{x}^{2}}\\,dx=\\)＿＿＿＿＿＿。", "steps": ["令 \\(u={x}^{2}\\)，\\(du=2x\\,dx\\)，原式 \\(=\\frac{1}{2}\\int_{0}^{1} {e}^{u}\\,du=\\frac{e-1}{2}\\)。"], "ans": "\\(\\frac{e-1}{2}\\)"}},
      {sec:"5-3",
       secName:"填空題",
       title:"第 8 題｜絕對值積分",
       points:[],
       caption:"提示：以 x＝1 為界分段",
       visual:(h)=>{const f=x=>Math.abs(x-1);h.innerHTML=K.plot({x:[-0.3,2.4],y:[-0.3,1.4],xt:[1,2],yt:[1],shade:[{f,a:0,b:2}],fs:[{f}]})},
       example:{"q": "\\(\\int_{0}^{2} |x-1|\\,dx=\\)＿＿＿＿＿＿。", "steps": ["\\(\\int_{0}^{1} (1-x)\\,dx+\\int_{1}^{2} (x-1)\\,dx=\\frac{1}{2}+\\frac{1}{2}=1\\)。"], "ans": "\\(1\\)"}},
      {sec:"5-3",
       secName:"填空題",
       title:"第 9 題｜奇函數的積分",
       points:[],
       caption:"提示：\\({x}^{3}\\) 在對稱區間積分為 0",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#e11d48", "fill": "#f7f9fd", "border": "#e11d48", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "\\(\\int_{-1}^{1} ({x}^{3}+2)\\,dx=\\)＿＿＿＿＿＿。", "steps": ["\\({x}^{3}\\) 為奇函數，\\(\\int_{-1}^{1} {x}^{3}\\,dx=0\\)；原式 \\(=\\int_{-1}^{1} 2\\,dx=4\\)。"], "ans": "\\(4\\)"}},
      {sec:"5-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（1）",
       visual:(h)=>K.steps(h,["💡 化簡 → 代換 → 套公式。先自己算，再拖動滑桿看步驟。", "（1）原式 \\(=2\\ln x+3{e}^{x}+\\cos x+C\\)。", "答：\\(2\\ln x+3{e}^{x}+\\cos x+C\\)"]),
       caption:"題幹：計算下列積分。",
       example:{"q": "（1）\\(\\int \\left( \\frac{2}{x}+3{e}^{x}-\\sin x \\right)dx\\)，其中 \\(x&gt;0\\)", "ans": "\\(2\\ln x+3{e}^{x}+\\cos x+C\\)"}},
      {sec:"5-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（2）",
       visual:(h)=>K.steps(h,["💡 化簡 → 代換 → 套公式。先自己算，再拖動滑桿看步驟。", "（2）令 \\(u={x}^{2}+1\\)，\\(du=2x\\,dx\\)，原式 \\(=\\frac{1}{2}\\int_{1}^{2} \\frac{1}{u}\\,du=\\frac{1}{2}\\ln 2\\)。", "答：\\(\\frac{1}{2}\\ln 2\\)"]),
       caption:"題幹：計算下列積分。",
       example:{"q": "（2）\\(\\int_{0}^{1} \\frac{x}{{x}^{2}+1}\\,dx\\)", "ans": "\\(\\frac{1}{2}\\ln 2\\)"}},
      {sec:"5-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（3）",
       visual:(h)=>K.steps(h,["題目（3）\\(\\int_{1}^{2} \\frac{(x+1{)}^{2}}{x}\\,dx\\)<br>💡 化簡 → 代換 → 套公式。先自己算，再拖動滑桿看步驟。", "（3）\\(\\frac{(x+1{)}^{2}}{x}=x+2+\\frac{1}{x}\\)，原式 \\(={\\left[ \\frac{{x}^{2}}{2}+2x+\\ln x \\right]}_{1}^{2}=(6+\\ln 2)-\\frac{5}{2}=\\frac{7}{2}+\\ln 2\\)。", "答：\\(\\frac{7}{2}+\\ln 2\\)"]),
       caption:"題幹：計算下列積分。",
       example:{"q": "（3）題目見右方，先自己算。", "ans": "\\(\\frac{7}{2}+\\ln 2\\)"}},
      {sec:"5-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（1）",
       visual:(h)=>K.steps(h,["💡 定積分是一個常數，先設為 c。先自己算，再拖動滑桿看步驟。", "（1）設 \\(c=\\int_{0}^{1} f(t)\\,dt\\)，\\(f(x)=3{x}^{2}-2cx+2\\)；兩邊在 \\([0,1]\\) 積分：", "\\(c={\\left[ {x}^{3}-c{x}^{2}+2x \\right]}_{0}^{1}=3-c\\)，\\(c=\\frac{3}{2}\\)，\\(f(x)=3{x}^{2}-3x+2\\)。", "答：\\(\\frac{3}{2}\\)，\\(f(x)=3{x}^{2}-3x+2\\)"]),
       caption:"積分方程與變上限積分",
       example:{"q": "（1）已知 \\(f(x)=3{x}^{2}-2x\\int_{0}^{1} f(t)\\,dt+2\\)，求 \\(\\int_{0}^{1} f(t)\\,dt\\) 的值及 \\(f(x)\\)。", "ans": "\\(\\frac{3}{2}\\)，\\(f(x)=3{x}^{2}-3x+2\\)"}},
      {sec:"5-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（2）",
       visual:(h)=>K.steps(h,["💡 定積分是一個常數，先設為 c。先自己算，再拖動滑桿看步驟。", "（2）\\({F}'(x)={x}^{2}-2x-3=(x+1)(x-3)\\)；\\(x=-1\\) 為極大值點，\\(x=3\\) 為極小值點。", "\\(F(x)=\\frac{{x}^{3}}{3}-{x}^{2}-3x\\)，極大值 \\(F(-1)=\\frac{5}{3}\\)，極小值 \\(F(3)=-9\\)。", "答：極大值 \\(\\frac{5}{3}\\)，極小值 \\(-9\\)"]),
       caption:"積分方程與變上限積分",
       example:{"q": "（2）設 \\(F(x)=\\int_{0}^{x} ({t}^{2}-2t-3)\\,dt\\)，求 \\(F(x)\\) 的極大值和極小值。", "ans": "極大值 \\(\\frac{5}{3}\\)，極小值 \\(-9\\)"}}
    ]
  });
})();
