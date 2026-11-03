/* Front End Lab - portfolio shell
   Reads QUESTIONS / GROUPS (questions.js) and SOURCES (sources.js).
   One menu entry per question; each question shows Output + its HTML/CSS/JS source. */
(function () {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const app = $('#app');
  const menu = $('#menu');
  const burger = $('#burger');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const byId = new Map(QUESTIONS.map(q => [q.id, q]));
  const groupName = id => GROUPS.find(g => g.id === id).name;
  const ext = f => f.split('.').pop();

  /* ================= menu bar ================= */
  function buildMenu() {
    let html = '<ul class="menubar"><li data-key="home"><a href="#home">Home</a></li>';
    GROUPS.forEach(g => {
      const items = QUESTIONS.filter(q => q.group === g.id)
        .map(q => `<li><a href="#q${q.id}" data-q="${q.id}"><span class="n">Q${q.id}</span><span>${esc(q.title)}</span></a></li>`).join('');
      html += `<li class="group" data-group="${g.id}"><button type="button" aria-haspopup="true" aria-expanded="false">${esc(g.name)}<i class="caret"></i></button><ul class="panel">${items}</ul></li>`;
    });
    menu.innerHTML = html + '</ul>';

    const groups = menu.querySelectorAll('.group');
    const closeAll = except => groups.forEach(li => {
      if (li !== except) { li.classList.remove('open'); li.firstElementChild.setAttribute('aria-expanded', 'false'); }
    });
    groups.forEach(li => {
      const btn = li.firstElementChild;
      let timer;
      btn.addEventListener('click', () => {
        const open = !li.classList.contains('open');
        closeAll(li); li.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
      });
      // desktop: open on hover (mouse only)
      li.addEventListener('pointerenter', e => {
        if (e.pointerType !== 'mouse' || innerWidth <= 1240) return;
        clearTimeout(timer); closeAll(li); li.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('pointerleave', e => {
        if (e.pointerType !== 'mouse' || innerWidth <= 1240) return;
        timer = setTimeout(() => { li.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }, 160);
      });
    });
    document.addEventListener('click', e => { if (!menu.contains(e.target)) closeAll(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); closeBurger(); } });
    menu.addEventListener('click', e => { if (e.target.closest('.panel a, .menubar>li>a')) { closeAll(); closeBurger(); } });
  }
  function closeBurger() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  function markCurrent(qid) {
    menu.querySelectorAll('.current').forEach(n => n.classList.remove('current'));
    menu.querySelectorAll('.panel a.on').forEach(n => n.classList.remove('on'));
    if (qid == null) { menu.querySelector('[data-key=home]').classList.add('current'); return; }
    const a = menu.querySelector(`[data-q="${qid}"]`);
    a.classList.add('on');
    a.closest('.group').classList.add('current');
  }

  /* ================= syntax highlighting ================= */
  const JS_KW = 'const|let|var|function|return|if|else|for|while|of|in|new|this|true|false|null|undefined|typeof|break|continue|switch|case|default|class|document|window|event|Array|Number|Math';
  const RX = {
    js: new RegExp(
      '(?<c>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|(?<s>"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)' +
      '|(?<r>(?<![\\w)\\]])\\/(?![\\/*])(?:\\\\.|\\[(?:\\\\.|[^\\]\\\\\\n])*\\]|[^\\/\\\\\\n\\[])+\\/[gimsuy]*)' +
      '|(?<k>\\b(?:' + JS_KW + ')\\b)|(?<n>\\b\\d+(?:\\.\\d+)?\\b)|(?<f>[A-Za-z_$][\\w$]*(?=\\())', 'g'),
    css: new RegExp(
      '(?<c>\\/\\*[\\s\\S]*?\\*\\/)|(?<s>"[^"\\n]*"|\'[^\'\\n]*\')|(?<sel>[^{};]+(?=\\{))|(?<p>[\\w-]+(?=\\s*:))' +
      '|(?<n>#[0-9a-fA-F]{3,8}\\b|(?<![\\w#-])-?\\d*\\.?\\d+(?:px|em|rem|%|vh|vw|s|deg|fr)?)', 'g'),
    tag: /(?<t><\/?[A-Za-z][\w-]*|\/?>)|(?<a>[\w:@.-]+(?==))|(?<s>"[^"]*"|'[^']*')/g
  };
  const NAMED = { c: 'c', s: 's', r: 'r', k: 'k', n: 'n', f: 'f', sel: 'sel', p: 'p', t: 't', a: 'a' };
  function lex(code, re, out) {
    re.lastIndex = 0; let last = 0, m;
    while ((m = re.exec(code))) {
      if (m.index > last) out.push([null, code.slice(last, m.index)]);
      const g = m.groups; let cls = null;
      for (const k in g) if (g[k] !== undefined) { cls = NAMED[k]; break; }
      out.push([cls, m[0]]); last = re.lastIndex;
      if (m[0] === '') re.lastIndex++;
    }
    if (last < code.length) out.push([null, code.slice(last)]);
  }
  function tokenize(code, lang) {
    const out = [];
    if (lang === 'css') { lex(code, RX.css, out); return out; }
    if (lang === 'js') { lex(code, RX.js, out); return out; }
    // html: comments, tags (with attributes), embedded <style>/<script>
    const re = /(<!--[\s\S]*?-->)|(<(style|script)\b[^>]*>)([\s\S]*?)(<\/\3>)|(<\/?[A-Za-z][^>]*>)/g;
    let last = 0, m;
    while ((m = re.exec(code))) {
      if (m.index > last) out.push([null, code.slice(last, m.index)]);
      if (m[1]) out.push(['c', m[1]]);
      else if (m[2]) { lex(m[2], RX.tag, out); tokenize(m[4], m[3] === 'style' ? 'css' : 'js').forEach(t => out.push(t)); lex(m[5], RX.tag, out); }
      else lex(m[6], RX.tag, out);
      last = re.lastIndex;
    }
    if (last < code.length) out.push([null, code.slice(last)]);
    return out;
  }
  function highlight(code, lang) {
    const lines = [[]];
    tokenize(code, lang).forEach(([cls, text]) => {
      text.split('\n').forEach((part, i) => {
        if (i > 0) lines.push([]);
        if (part) lines[lines.length - 1].push(cls ? `<span class="t-${cls}">${esc(part)}</span>` : esc(part));
      });
    });
    return lines.map(l => `<span class="l">${l.join('')}</span>`).join('');
  }

  /* ================= sources ================= */
  async function getSource(file) {
    if (location.protocol.startsWith('http')) {          // served by a web server: read the live file
      try {
        const r = await fetch('q/' + file, { cache: 'no-store' });
        if (r.ok) return await r.text();
      } catch (e) { /* fall through to embedded copy */ }
    }
    return (window.SOURCES && SOURCES[file]) || '// source not found: ' + file;
  }

  /* ================= views ================= */
  function renderHome() {
    document.title = 'Front End Design - Assignment Portfolio | Nedhra S';
    markCurrent(null);
    const counts = { html: 0, css: 0, js: 0 };
    QUESTIONS.forEach(q => q.files.forEach(f => { const e = ext(f); if (counts[e] !== undefined) counts[e]++; }));
    const chips = ['<button class="chip-btn on" data-g="all">All</button>']
      .concat(GROUPS.map(g => `<button class="chip-btn" data-g="${g.id}">${esc(g.name)}</button>`)).join('');
    app.innerHTML = `
      <section class="hero">
        <div class="hero-main">
          <p class="eyebrow">Front End Design and Testing</p>
          <h1>Assignment Portfolio: every question, live and with source code</h1>
          <p>Pick a topic from the menu bar. Each question opens its working output with the HTML, CSS and JavaScript behind it.</p>
          <a class="cta" href="#q${QUESTIONS[0].id}">Start with Question 1</a>
        </div>
        <aside class="idcard">
          <h2>Submitted by</h2>
          <dl>
            <dt>Name</dt><dd>Nedhra S</dd>
            <dt>Reg. No.</dt><dd>24MIC0107</dd>
            <dt>Course</dt><dd>Front End Design and Testing (CSI3029)</dd>
            <dt>Questions</dt><dd>${QUESTIONS.length} (Q1 to Q43)</dd>
          </dl>
          <div class="stats">
            <div class="stat"><b>${counts.html}</b><span>HTML files</span></div>
            <div class="stat"><b>${counts.css}</b><span>CSS files</span></div>
            <div class="stat"><b>${counts.js}</b><span>JS files</span></div>
          </div>
        </aside>
      </section>
      <div class="tools">
        <div class="chips" role="group" aria-label="Filter by topic">${chips}</div>
        <input class="search" type="search" id="filter" placeholder="Search questions..." aria-label="Search questions">
      </div>
      <div class="grid" id="grid"></div>`;

    const grid = $('#grid');
    let group = 'all';
    const draw = () => {
      const term = $('#filter').value.trim().toLowerCase();
      const list = QUESTIONS.filter(q => (group === 'all' || q.group === group) &&
        (!term || (`q${q.id} ${q.title} ${groupName(q.group)}`).toLowerCase().includes(term)));
      grid.innerHTML = list.length ? list.map(q => `
        <a class="qcard" href="#q${q.id}">
          <span class="num"><small>Q</small>${q.id}</span>
          <h3>${esc(q.title)}</h3>
          <span class="meta">${[...new Set(q.files.map(ext))].map(e => `<span class="badge ${e}">${e}</span>`).join('')}<span class="badge">${esc(groupName(q.group))}</span></span>
        </a>`).join('') : '<p class="empty">No question matches your search.</p>';
    };
    $('.chips').addEventListener('click', e => {
      const b = e.target.closest('.chip-btn'); if (!b) return;
      group = b.dataset.g;
      document.querySelectorAll('.chip-btn').forEach(x => x.classList.toggle('on', x === b));
      draw();
    });
    $('#filter').addEventListener('input', draw);
    draw();
  }

  function renderQuestion(id) {
    const q = byId.get(id);
    if (!q) { location.hash = '#home'; return; }
    document.title = `Q${q.id} ${q.title} | Nedhra S`;
    markCurrent(q.id);
    const idx = QUESTIONS.indexOf(q);
    const prev = QUESTIONS[idx - 1], next = QUESTIONS[idx + 1];
    const [stmt, ...rest] = q.text;
    const tabs = [{ key: 'output', label: 'Output' }].concat(q.files.map(f => ({ key: f, label: f })));

    app.innerHTML = `
      <div class="qhead">
        <span class="qnum">Q${q.id}</span>
        <div class="qtitle"><h1>${esc(q.title)}</h1><span class="chip">${esc(groupName(q.group))}</span></div>
        <div class="pn">
          <button type="button" id="prev" ${prev ? '' : 'disabled'}>&larr; Q${prev ? prev.id : ''}</button>
          <button type="button" id="next" ${next ? '' : 'disabled'}>Q${next ? next.id : ''} &rarr;</button>
        </div>
      </div>
      <details class="qtext" open>
        <summary>Question</summary>
        <div class="body"><p>${esc(stmt || '')}</p>${rest.length ? '<ul>' + rest.map(l => `<li>${esc(l)}</li>`).join('') + '</ul>' : ''}</div>
      </details>
      <div class="tabbar" role="tablist" aria-label="Output and source files">
        ${tabs.map((t, i) => `<button class="tab ${t.key === 'output' ? 'output' : ''}" role="tab" data-key="${esc(t.key)}" aria-selected="${i === 0}">${esc(t.label)}</button>`).join('')}
        <span class="spacer"></span>
        <div class="tools-r" id="tools"></div>
      </div>
      <div id="view"></div>`;

    $('#prev').onclick = () => prev && (location.hash = '#q' + prev.id);
    $('#next').onclick = () => next && (location.hash = '#q' + next.id);

    const view = $('#view'), toolsR = $('#tools');
    const select = key => {
      app.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.key === key));
      key === 'output' ? showOutput(q, view, toolsR) : showCode(key, view, toolsR);
    };
    $('.tabbar').addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) select(t.dataset.key); });
    $('.tabbar').addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const all = [...app.querySelectorAll('.tab')], cur = all.findIndex(t => t.getAttribute('aria-selected') === 'true');
      const n = all[(cur + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
      n.focus(); select(n.dataset.key);
    });
    select('output');
  }

  function showOutput(q, view, toolsR) {
    const url = 'q/' + q.entry;
    toolsR.innerHTML = `
      <div class="seg" role="group" aria-label="Preview width">
        <button type="button" data-w="" class="on">Desktop</button><button type="button" data-w="tablet">Tablet</button><button type="button" data-w="mobile">Mobile</button>
      </div>
      <a class="ghost" href="${url}" target="_blank" rel="noopener">Open in new tab &#8599;</a>`;
    view.innerHTML = `<div class="stage"><iframe class="frame" title="Output of question ${q.id}" src="${url}"></iframe></div>`;
    const frame = $('.frame', view);
    toolsR.querySelector('.seg').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      toolsR.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b));
      frame.className = 'frame ' + b.dataset.w;
    });
  }

  async function showCode(file, view, toolsR) {
    toolsR.innerHTML = '';
    view.innerHTML = '<div class="codewrap"><div class="loading" style="padding:40px;color:#aeb1d6">Loading...</div></div>';
    const src = await getSource(file);
    const lang = ext(file);
    const lines = src.replace(/\n$/, '').split('\n').length;
    view.innerHTML = `
      <div class="codewrap">
        <div class="codebar"><span>q/${esc(file)} &middot; ${lines} lines</span>
          <span class="acts"><button type="button" id="copy">Copy code</button><button type="button" id="dl">Download</button></span>
        </div>
        <pre class="code" tabindex="0"><code>${highlight(src.replace(/\n$/, ''), lang)}</code></pre>
      </div>`;
    $('#copy', view).onclick = async e => {
      try { await navigator.clipboard.writeText(src); e.target.textContent = 'Copied!'; }
      catch (_) {
        const r = document.createRange(); r.selectNodeContents($('pre code', view));
        const s = getSelection(); s.removeAllRanges(); s.addRange(r); e.target.textContent = 'Selected - press Ctrl+C';
      }
      setTimeout(() => (e.target.textContent = 'Copy code'), 1800);
    };
    $('#dl', view).onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([src], { type: 'text/plain' }));
      a.download = file; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
  }

  /* ================= router ================= */
  function route() {
    const m = location.hash.match(/^#q(\d+)$/);
    m ? renderQuestion(+m[1]) : renderHome();
    scrollTo(0, 0);
  }
  buildMenu();
  addEventListener('hashchange', route);
  route();
})();
