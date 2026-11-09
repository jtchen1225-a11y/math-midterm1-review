/* 第 6 章 工作紙六　定積分的應用：面積與黎曼和。節次：6-1 重點回顧、6-2 選擇題、6-3 填空題、6-4 解答題
   範圍以「第一段考後複習工作紙（六）」為限；本檔由 build/build_site.py 產生，公式 TeX 皆由 OMML 轉出，請勿手改。 */
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
    ch: 6,
    title: "工作紙六　定積分的應用：面積與黎曼和",
    color: "#0891b2",
    sections: ["6-1 重點回顧", "6-2 選擇題", "6-3 填空題", "6-4 解答題"],
    slides: [
      {sec:"6-1",
       secName:"重點回顧",
       title:"黎曼和的極限就是定積分",
       points:["n 越大，矩形和越接近面積"],
       formula:{"label": "黎曼和（n→∞）", "tex": "\\frac{1}{n}\\sum_{k=1}^{n} f(\\frac{k}{n})\\to \\int_{0}^{1} f(x)\\,dx"},
       visual:(h)=>{K.slide(h,{min:2,max:40,step:1,val:6,
         text:v=>`n＝<span class="ival">${v}</span>　和＝${K.n((v+1)*(2*v+1)/(6*v*v),4)}`,
         fig:v=>{let sh=[];for(let k=1;k<=v;k++){const hk=(k/v)*(k/v);sh.push({f:()=>hk,a:(k-1)/v,b:k/v,c:k%2?'rgba(8,145,178,.35)':'rgba(8,145,178,.2)'});}
           return K.plot({x:[-0.1,1.15],y:[-0.12,1.12],xt:[1],yt:[1],shade:sh,fs:[{f:x=>x*x,a:0,b:1.05}]});}})},
       caption:"\\(f(x)={x}^{2}\\)，取右端點：矩形和 \\(\\to \\int_{0}^{1} {x}^{2}\\,dx=\\frac{1}{3}\\)"},
      {sec:"6-1",
       secName:"重點回顧",
       title:"面積＝∫（上 − 下）dx",
       points:["先求交點定上下限", "在 x 軸下方的部分要變號"],
       formula:{"label": "面積", "tex": "S=\\int_{a}^{b} (\\text{上}-\\text{下})\\,dx"},
       visual:(h)=>{h.innerHTML=K.plot({x:[-0.5,2.6],y:[-0.6,5],xt:[2],yt:[4],shade:[{f:x=>2*x,g:x=>x*x,a:0,b:2}],fs:[{f:x=>2*x,c:'#e11d48',w:3},{f:x=>x*x}],pts:[{x:2,y:4,t:'(2, 4)',dx:-46,dy:-4}]})},
       caption:"\\(y=2x\\)（紅）在上、\\(y={x}^{2}\\)（藍）在下，面積 \\(\\int_{0}^{2} (2x-{x}^{2})\\,dx\\)"},
      {sec:"6-2",
       secName:"選擇題",
       title:"第 1 題｜曲線與 x 軸的面積",
       points:[],
       caption:"提示：圖形在 x 軸下方，要變號",
       visual:(h)=>K.opts(h,[["A", "\\(\\frac{16}{3}\\)"], ["B", "\\(8\\)"], ["C", "\\(16\\)"], ["D", "\\(\\frac{32}{3}\\)"]],2),
       example:{"q": "曲線 \\(y={x}^{2}-4\\) 與 \\(x\\) 軸所圍成的封閉圖形面積為（　　）", "steps": ["交點 \\(x=\\pm 2\\)，面積 \\(=\\int_{-2}^{2} (4-{x}^{2})\\,dx=16-\\frac{16}{3}=\\frac{32}{3}\\)。"], "ans": "(D) \\(\\frac{32}{3}\\)"}},
      {sec:"6-2",
       secName:"選擇題",
       title:"第 2 題｜兩曲線之間的面積",
       points:[],
       caption:"提示：交點 x＝0、2，直線在上",
       visual:(h)=>K.opts(h,[["A", "\\(\\frac{4}{3}\\)"], ["B", "\\(\\frac{2}{3}\\)"], ["C", "\\(\\frac{8}{3}\\)"], ["D", "\\(4\\)"]],2),
       example:{"q": "拋物線 \\(y={x}^{2}\\) 與直線 \\(y=2x\\) 所圍成的封閉圖形面積為（　　）", "steps": ["交點 \\(x=0,2\\)，面積 \\(=\\int_{0}^{2} (2x-{x}^{2})\\,dx=4-\\frac{8}{3}=\\frac{4}{3}\\)。"], "ans": "(A) \\(\\frac{4}{3}\\)"}},
      {sec:"6-2",
       secName:"選擇題",
       title:"第 3 題｜正弦曲線的面積",
       points:[],
       caption:"提示：分段，避免正負抵消",
       visual:(h)=>K.opts(h,[["A", "\\(0\\)"], ["B", "\\(2\\)"], ["C", "\\(4\\)"], ["D", "\\(2\\pi\\)"]],2),
       example:{"q": "曲線 \\(y=\\sin x\\)（\\(0\\le x\\le 2\\pi\\)）與 \\(x\\) 軸所圍成圖形的總面積為（　　）", "steps": ["\\(\\int_{0}^{\\pi } \\sin x\\,dx=2\\)，\\(\\int_{\\pi }^{2\\pi } \\sin x\\,dx=-2\\)，總面積 \\(=2+2=4\\)。"], "ans": "(C) \\(4\\)"}},
      {sec:"6-2",
       secName:"選擇題",
       title:"第 4 題｜分段求面積",
       points:[],
       caption:"提示：x＜0 的部分在軸下方",
       visual:(h)=>K.opts(h,[["A", "\\(\\frac{15}{4}\\)"], ["B", "\\(\\frac{17}{4}\\)"], ["C", "\\(4\\)"], ["D", "\\(\\frac{9}{2}\\)"]],2),
       example:{"q": "曲線 \\(y={x}^{3}\\)、直線 \\(x=-1\\)、\\(x=2\\) 與 \\(x\\) 軸所圍成圖形的面積為（　　）", "steps": ["\\(\\int_{-1}^{0} (-{x}^{3})\\,dx+\\int_{0}^{2} {x}^{3}\\,dx=\\frac{1}{4}+4=\\frac{17}{4}\\)。"], "ans": "(B) \\(\\frac{17}{4}\\)"}},
      {sec:"6-2",
       secName:"選擇題",
       title:"第 5 題｜黎曼和",
       points:[],
       caption:"提示：化成 \\(\\frac{1}{n}\\sum (\\frac{k}{n}{)}^{3}\\)",
       visual:(h)=>K.opts(h,[["A", "\\(\\frac{1}{2}\\)"], ["B", "\\(\\frac{1}{3}\\)"], ["C", "\\(1\\)"], ["D", "\\(\\frac{1}{4}\\)"]],2),
       example:{"q": "\\(\\mathop{\\lim}\\limits_{n\\to \\infty }\\frac{{1}^{3}+{2}^{3}+{3}^{3}+\\cdots +{n}^{3}}{{n}^{4}}=\\)（　　）", "steps": ["原式 \\(=\\mathop{\\lim}\\limits_{n\\to \\infty }\\frac{1}{n}\\sum_{k=1}^{n} {\\left( \\frac{k}{n} \\right)}^{3}=\\int_{0}^{1} {x}^{3}\\,dx=\\frac{1}{4}\\)。"], "ans": "(D) \\(\\frac{1}{4}\\)"}},
      {sec:"6-3",
       secName:"填空題",
       title:"第 6 題｜兩拋物線間的面積",
       points:[],
       caption:"提示：先求交點",
       visual:(h)=>{h.innerHTML=K.plot({x:[-1.8,1.8],y:[-0.5,2.5],xt:[-1,1],yt:[2],shade:[{f:x=>2-x*x,g:x=>x*x,a:-1,b:1}],fs:[{f:x=>x*x},{f:x=>2-x*x,c:'#e11d48',w:3}]})},
       example:{"q": "曲線 \\(y={x}^{2}\\) 與 \\(y=2-{x}^{2}\\) 所圍成的封閉圖形面積為＿＿＿＿＿＿。", "steps": ["交點 \\(x=\\pm 1\\)，面積 \\(=\\int_{-1}^{1} (2-2{x}^{2})\\,dx=4-\\frac{4}{3}=\\frac{8}{3}\\)。"], "ans": "\\(\\frac{8}{3}\\)"}},
      {sec:"6-3",
       secName:"填空題",
       title:"第 7 題｜曲線下的面積",
       points:[],
       caption:"提示：\\({e}^{x}&gt;0\\)，直接積分",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "定積分", "tex": "\\int_{a}^{b} f(x)\\,dx=F(b)-F(a)", "color": "#0891b2", "fill": "#f7f9fd", "border": "#0891b2", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "曲線 \\(y={e}^{x}\\)、直線 \\(x=0\\)、\\(x=1\\) 與 \\(x\\) 軸所圍成的面積為＿＿＿＿＿＿。", "steps": ["面積 \\(=\\int_{0}^{1} {e}^{x}\\,dx=e-1\\)。"], "ans": "\\(e-1\\)"}},
      {sec:"6-3",
       secName:"填空題",
       title:"第 8 題｜根號與直線的面積",
       points:[],
       caption:"提示：在 (0,1) 內誰在上方？",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "面積", "tex": "S=\\int_{a}^{b} (\\text{上}-\\text{下})\\,dx", "color": "#0891b2", "fill": "#f7f9fd", "border": "#0891b2", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "曲線 \\(y=\\sqrt{x}\\) 與直線 \\(y=x\\) 所圍成的封閉圖形面積為＿＿＿＿＿＿。", "steps": ["交點 \\(x=0,1\\)，在 \\((0,1)\\) 內 \\(\\sqrt{x}&gt;x\\)，面積 \\(=\\int_{0}^{1} (\\sqrt{x}-x)\\,dx=\\frac{2}{3}-\\frac{1}{2}=\\frac{1}{6}\\)。"], "ans": "\\(\\frac{1}{6}\\)"}},
      {sec:"6-3",
       secName:"填空題",
       title:"第 9 題｜1/x 下的面積",
       points:[],
       caption:"提示：\\(\\int \\frac{1}{x}\\,dx=\\ln \\,x\\)",
       visual:(h)=>{h.innerHTML=SV.fbox([{"label": "冪函數", "tex": "({x}^{n})'=n{x}^{n-1}", "color": "#0891b2", "fill": "#f7f9fd", "border": "#0891b2", "w": "100%", "pad": "8px 4px"}])},
       example:{"q": "曲線 \\(y=\\frac{1}{x}\\)、直線 \\(x=1\\)、\\(x=2\\) 與 \\(x\\) 軸所圍成的面積為＿＿＿＿＿＿。", "steps": ["面積 \\(=\\int_{1}^{2} \\frac{1}{x}\\,dx=\\ln 2\\)。"], "ans": "\\(\\ln 2\\)"}},
      {sec:"6-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（1）",
       visual:(h)=>K.steps(h,["💡 先因式分解找交點。先自己算，再拖動滑桿看步驟。", "（1）\\({x}^{3}-{x}^{2}-2x=x(x+1)(x-2)\\)，交點 \\(x=-1,0,2\\)", "\\(\\int_{-1}^{0} ({x}^{3}-{x}^{2}-2x)\\,dx=\\frac{5}{12}\\)，\\(\\int_{0}^{2} ({x}^{3}-{x}^{2}-2x)\\,dx=-\\frac{8}{3}\\)，", "總面積 \\(=\\frac{5}{12}+\\frac{8}{3}=\\frac{37}{12}\\)。", "答：\\(\\frac{37}{12}\\)"]),
       caption:"分段面積與切線面積",
       example:{"q": "（1）求曲線 \\(y={x}^{3}-{x}^{2}-2x\\) 與 \\(x\\) 軸所圍成圖形的總面積。", "ans": "\\(\\frac{37}{12}\\)"}},
      {sec:"6-4",
       secName:"解答題",
       points:[],
       title:"第 10 題（2）",
       visual:(h)=>K.steps(h,["💡 先因式分解找交點。先自己算，再拖動滑桿看步驟。", "（2）切線 \\(y=2x-1\\)，與 \\(x\\) 軸交於 \\(\\left( \\frac{1}{2},0 \\right)\\)", "面積 \\(=\\int_{0}^{1} {x}^{2}\\,dx-\\frac{1}{2}\\times \\frac{1}{2}\\times 1=\\frac{1}{3}-\\frac{1}{4}=\\frac{1}{12}\\)。", "答：\\(\\frac{1}{12}\\)"]),
       caption:"分段面積與切線面積",
       example:{"q": "（2）求曲線 \\(y={x}^{2}\\)、它在點 \\((1,1)\\) 處的切線及 \\(x\\) 軸所圍成圖形的面積。", "ans": "\\(\\frac{1}{12}\\)"}},
      {sec:"6-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（1）",
       visual:(h)=>K.steps(h,["題目（1）\\(\\mathop{\\lim}\\limits_{n\\to \\infty }\\frac{1}{n}\\left[ {\\left( 1+\\frac{1}{n} \\right)}^{2}+{\\left( 1+\\frac{2}{n} \\right)}^{2}+\\cdots +{\\left( 1+\\frac{n}{n} \\right)}^{2} \\right]\\)<br>💡 找出 f，使式子成為 \\(\\frac{1}{n}\\sum f(\\frac{k}{n})\\)。先自己算，再拖動滑桿看步驟。", "（1）取 \\(f(x)=(1+x{)}^{2}\\)，原式 \\(=\\int_{0}^{1} (1+x{)}^{2}\\,dx={\\left[ \\frac{(1+x{)}^{3}}{3} \\right]}_{0}^{1}=\\frac{7}{3}\\)。", "答：\\(\\frac{7}{3}\\)"]),
       caption:"題幹：已知 \\(\\mathop{\\lim}\\limits_{n\\to \\infty }\\frac{1}{n}\\sum_{k=1}^{n} f\\left( \\frac{k}{n} \\right)=\\int_{0}^{1} f(x)\\,dx\\)。利用此結果求下列極限：",
       example:{"q": "（1）題目見右方，先自己算。", "ans": "\\(\\frac{7}{3}\\)"}},
      {sec:"6-4",
       secName:"解答題",
       points:[],
       title:"第 11 題（2）",
       visual:(h)=>K.steps(h,["題目（2）\\(\\mathop{\\lim}\\limits_{n\\to \\infty }\\frac{\\sqrt{1}+\\sqrt{2}+\\cdots +\\sqrt{n}}{n\\sqrt{n}}\\)<br>💡 找出 f，使式子成為 \\(\\frac{1}{n}\\sum f(\\frac{k}{n})\\)。先自己算，再拖動滑桿看步驟。", "（2）原式 \\(=\\mathop{\\lim}\\limits_{n\\to \\infty }\\frac{1}{n}\\sum_{k=1}^{n} \\sqrt{\\frac{k}{n}}=\\int_{0}^{1} \\sqrt{x}\\,dx=\\frac{2}{3}\\)。", "答：\\(\\frac{2}{3}\\)"]),
       caption:"題幹：已知 \\(\\mathop{\\lim}\\limits_{n\\to \\infty }\\frac{1}{n}\\sum_{k=1}^{n} f\\left( \\frac{k}{n} \\right)=\\int_{0}^{1} f(x)\\,dx\\)。利用此結果求下列極限：",
       example:{"q": "（2）題目見右方，先自己算。", "ans": "\\(\\frac{2}{3}\\)"}}
    ]
  });
})();
