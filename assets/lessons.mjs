const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const article = document.getElementById('lesson');
const list = document.getElementById('lesson-list');
let lessons = [], indexPromise, request = 0, dispose;
const modules = new Map();
const categoryOpen = new Map();

function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch('assets/problems.json').then(async response => {
      if (!response.ok) throw Error('Could not load lesson index.');
      lessons = await response.json();
    }).catch(error => { indexPromise = null; throw error; });
  }
  return indexPromise;
}

function navigation(selected) {
  list.querySelectorAll('.lesson-category').forEach(section => categoryOpen.set(section.dataset.category, section.open));
  const categories = [...new Set(lessons.map(lesson => lesson.category))];
  list.innerHTML = categories.map(category => `<details class="lesson-category" data-category="${escape(category)}" ${categoryOpen.get(category) !== false ? 'open' : ''}><summary>${escape(category)}</summary><div class="lesson-category-links">${lessons.filter(lesson => lesson.category === category).map((lesson, i) => `<a href="#practice/${lesson.slug}" ${lesson.slug === selected ? 'aria-current="page"' : ''}><span class="lesson-number">${String(i + 1).padStart(2, '0')}</span>${escape(lesson.title)}</a>`).join('')}</div></details>`).join('');
}

export function hideLesson() {
  request++;
  dispose?.();
  dispose = undefined;
}

export async function showLesson(slug) {
  hideLesson();
  const current = request;
  article.setAttribute('aria-busy', 'true');
  article.innerHTML = '<p>Loading lesson…</p>';
  try {
    await loadIndex();
    if (current !== request) return;
    const entry = lessons.find(lesson => lesson.slug === slug) || lessons[0];
    navigation(entry.slug);
    if (!modules.has(entry.module)) {
      modules.set(entry.module, import(new URL(entry.module, document.baseURI).href).catch(error => { modules.delete(entry.module); throw error; }));
    }
    const module = await modules.get(entry.module);
    if (current !== request) return;
    const lesson = {...module.default, ...entry};
    document.title = `${lesson.title} — NeetCode 150`;
    article.innerHTML = `<p class="lesson-category-label">NeetCode 150 / ${escape(lesson.category)}</p><div class="lesson-meta"><span class="pill">${escape(lesson.difficulty)}</span><span class="eyebrow">${escape(lesson.pattern)}</span></div><h2>${escape(lesson.title)}</h2><p>${escape(lesson.problem)}</p><h3>Example</h3><pre class="example">${escape(lesson.example)}</pre>
      <details class="lesson-section" open><summary>Approach</summary><p>${escape(lesson.insight)}</p></details>
      <details class="lesson-section"><summary>Steps</summary><ol>${lesson.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol></details>
      ${module.mountVisualization ? '<details class="lesson-section" id="lesson-visualization"><summary>Visualization</summary><div id="lesson-visualization-content"></div></details>' : ''}
      <details class="lesson-section" id="python-section"><summary>Python solution</summary><div id="python-content"><p>Loading Python source…</p></div><a class="text-link" href="${escape(lesson.source)}" download>Download Python solution ↓</a></details>
      <div class="complexity"><h3>Time &amp; space</h3><p>${escape(lesson.complexity)}</p></div><details class="lesson-section"><summary>Notes</summary><p>${escape(lesson.pitfall)}</p></details>`;
    const pythonSection = article.querySelector('#python-section');
    const pythonContent = article.querySelector('#python-content');
    let codeLoaded = false, loading = false;
    async function loadPython() {
      if (codeLoaded || loading) return;
      loading = true;
      pythonContent.innerHTML = '<p>Loading Python source…</p>';
      try {
        const response = await fetch(new URL(lesson.source, document.baseURI));
        if (!response.ok) throw Error('Could not load Python source.');
        const code = await response.text();
        if (current !== request) return;
        pythonContent.innerHTML = `<pre><code>${escape(code)}</code></pre>`;
        codeLoaded = true;
      } catch (error) {
        if (current !== request) return;
        pythonContent.innerHTML = '<p class="error">Python source could not load.</p><button type="button">Retry</button>';
        pythonContent.querySelector('button').onclick = loadPython;
      } finally { loading = false; }
    }
    pythonSection.addEventListener('toggle', () => { if (pythonSection.open) loadPython(); });
    if (module.mountVisualization) {
      dispose = module.mountVisualization(article.querySelector('#lesson-visualization-content'));
    }
  } catch (error) {
    if (current !== request) return;
    article.innerHTML = '<h2>Lesson could not load</h2><p>Serve the site over HTTP, then retry. For local setup, see the README.</p><button type="button">Retry</button>';
    article.querySelector('button').onclick = () => showLesson(slug);
  } finally {
    if (current === request) article.removeAttribute('aria-busy');
  }
}
