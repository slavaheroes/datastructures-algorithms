const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const article = document.getElementById('lesson');
const list = document.getElementById('lesson-list');
const layout = document.querySelector('.practice-layout');
const topicBrowser = document.getElementById('topic-browser');
const topicToggle = document.getElementById('topics-toggle');
let lessons = [], indexPromise, request = 0, dispose;
let topicsHidden = false;
const modules = new Map();
const categoryOpen = new Map();
const assetVersion = new URL(import.meta.url).searchParams.get('v');

function resourceURL(path) {
  const url = new URL(path, document.baseURI);
  if (assetVersion) url.searchParams.set('v', assetVersion);
  return url;
}

function topicVisibility(hasLesson) {
  const visible = !hasLesson || !topicsHidden;
  topicBrowser.hidden = !visible;
  topicToggle.hidden = !hasLesson;
  topicToggle.textContent = visible ? 'Hide topics' : 'Show topics';
  topicToggle.setAttribute('aria-expanded', String(visible));
  layout.classList.toggle('topics-hidden', !visible);
}
topicToggle.onclick = () => { topicsHidden = !topicsHidden; topicVisibility(true); };

function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(resourceURL('assets/problems.json'), {cache: 'no-cache'}).then(async response => {
      if (!response.ok) throw Error('Could not load lesson index.');
      lessons = await response.json();
    }).catch(error => { indexPromise = null; throw error; });
  }
  return indexPromise;
}

function navigation(selected) {
  list.querySelectorAll('.lesson-category').forEach(section => categoryOpen.set(section.dataset.category, section.open));
  if (!selected) categoryOpen.clear();
  const categories = [...new Set(lessons.map(lesson => lesson.category))];
  list.innerHTML = categories.map(category => {
    const problems = lessons.filter(lesson => lesson.category === category);
    const isSelected = problems.some(lesson => lesson.slug === selected);
    return `<details class="lesson-category" data-category="${escape(category)}" ${isSelected || categoryOpen.get(category) === true ? 'open' : ''}>
      <summary><span class="topic-heading"><span>${escape(category)}</span><span class="topic-count">${problems.length} problems</span></span></summary>
      <div class="lesson-category-links">${problems.map((lesson, i) => `<a href="#practice/${lesson.slug}" ${lesson.slug === selected ? 'aria-current="page"' : ''}>
        <span class="lesson-number">${String(i + 1).padStart(2, '0')}</span><span class="problem-title">${escape(lesson.title)}</span><span class="difficulty difficulty-${escape(lesson.difficulty.toLowerCase())}">${escape(lesson.difficulty)}</span>
      </a>`).join('')}</div></details>`;
  }).join('');
}

export function hideLesson() {
  request++;
  dispose?.();
  dispose = undefined;
}

export async function showLesson(slug) {
  hideLesson();
  const current = request;
  article.hidden = !slug;
  layout.classList.toggle('has-lesson', Boolean(slug));
  topicVisibility(Boolean(slug));
  article.innerHTML = slug ? '<p>Loading lesson…</p>' : '';
  if (slug) article.setAttribute('aria-busy', 'true');
  else article.removeAttribute('aria-busy');
  try {
    await loadIndex();
    if (current !== request) return;
    const entry = lessons.find(lesson => lesson.slug === slug);
    navigation(entry?.slug);
    if (!slug) {
      window.scrollTo(0, 0);
      return;
    }
    if (!entry) {
      article.innerHTML = '<h2>Problem not found</h2><p>Choose a problem from the list or <a href="#practice">browse all topics</a>.</p>';
      return;
    }
    if (!modules.has(entry.module)) {
      modules.set(entry.module, import(resourceURL(entry.module).href).catch(error => { modules.delete(entry.module); throw error; }));
    }
    const module = await modules.get(entry.module);
    if (current !== request) return;
    const lesson = {...module.default, ...entry};
    document.title = `${lesson.title} — NeetCode 150`;
    article.innerHTML = `<a class="back-to-topics" href="#practice">← All topics</a><p class="lesson-category-label">${escape(lesson.category)}</p><div class="lesson-meta"><span class="difficulty difficulty-${escape(lesson.difficulty.toLowerCase())}">${escape(lesson.difficulty)}</span><span class="eyebrow">${escape(lesson.pattern)}</span></div><h2 tabindex="-1">${escape(lesson.title)}</h2><p>${escape(lesson.problem)}</p><h3>Example</h3><pre class="example">${escape(lesson.example)}</pre>
      <details class="lesson-section" open><summary>Approach</summary><p>${escape(lesson.insight)}</p></details>
      <details class="lesson-section"><summary>Steps</summary><ol>${lesson.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol></details>
      ${lesson.proof ? `<details class="lesson-section" open><summary>${escape(lesson.proof.title)}</summary>${lesson.proof.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</details>` : ''}
      ${module.mountVisualization ? '<details class="lesson-section" id="lesson-visualization"><summary>Visualization</summary><div id="lesson-visualization-content"></div></details>' : ''}
      ${lesson.treeVisualizer ? '<p class="tree-visualizer-link"><a href="#data-structures/trees">Open the Trees visualizer</a> to build the example tree and inspect its structure. Use a level-order array with null for missing children.</p>' : ''}
      <details class="lesson-section" id="python-section"><summary>Python solution</summary><div id="python-content"><p>Loading Python source…</p></div><a class="text-link" href="${escape(resourceURL(lesson.source).href)}" download>Download Python solution ↓</a></details>
      <div class="complexity"><h3>Time &amp; space</h3><p>${escape(lesson.complexity)}</p></div><details class="lesson-section"><summary>Notes</summary><p>${escape(lesson.pitfall)}</p></details>`;
    const pythonSection = article.querySelector('#python-section');
    const pythonContent = article.querySelector('#python-content');
    let codeLoaded = false, loading = false;
    async function loadPython() {
      if (codeLoaded || loading) return;
      loading = true;
      pythonContent.innerHTML = '<p>Loading Python source…</p>';
      try {
        const response = await fetch(resourceURL(lesson.source));
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
    article.querySelector('h2').focus({preventScroll: true});
    article.scrollIntoView({block: 'start'});
  } catch (error) {
    if (current !== request) return;
    const target = slug ? article : list;
    target.innerHTML = `<p class="error">${slug ? 'Lesson' : 'Topics'} could not load. Serve the site over HTTP, then retry.</p><button type="button">Retry</button>`;
    target.querySelector('button').onclick = () => showLesson(slug);
  } finally {
    if (current === request) article.removeAttribute('aria-busy');
  }
}
