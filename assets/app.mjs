import {showLesson, hideLesson} from './lessons.mjs';

const pages = {
  home: {title: 'Home'},
  'data-structures': {title: 'Data Structures Visualizer', load: () => import('./pages/data-structures.mjs')},
  algorithms: {title: 'Algorithms', load: () => import('./pages/algorithms.mjs')},
  practice: {title: 'NeetCode 150', enter: showLesson, leave: hideLesson}
};
const aliases = {structures: 'data-structures/trees', sorting: 'algorithms/sorting'};
const mounted = new Map(), loading = new Map();
let active, request = 0;

async function route() {
  const current = ++request;
  let path = location.hash.slice(1);
  const [oldPage] = path.split('/');
  if (Object.hasOwn(aliases, oldPage)) {
    path = aliases[oldPage];
    history.replaceState(null, '', `#${path}`);
  }
  const [raw, section] = path.split('/');
  const name = Object.hasOwn(pages, raw) ? raw : 'home';
  const page = pages[name], root = document.getElementById(name);
  if (active !== name) {
    pages[active]?.leave?.();
    mounted.get(active)?.leave?.();
  }
  const changedPage = active !== name;
  active = name;
  document.querySelectorAll('main > .page').forEach(element => { element.hidden = element.id !== name; });
  document.querySelectorAll('header nav a').forEach(link => {
    if (link.hash === `#${name}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `${page.title} — Data structures and algorithms`;
  try {
    if (page.load && !mounted.has(name)) {
      if (!loading.has(name)) {
        root.innerHTML = '<p>Loading visualizers…</p>';
        loading.set(name, page.load().then(module => {
          const control = module.mount(root);
          mounted.set(name, control);
          return control;
        }).catch(error => { loading.delete(name); throw error; }));
      }
      await loading.get(name);
    }
    if (current !== request) return;
    mounted.get(name)?.enter?.(section);
    page.enter?.(section);
    if (changedPage && !page.load) window.scrollTo(0, 0);
  } catch (error) {
    if (current !== request) return;
    root.innerHTML = '<h1>Page could not load</h1><p>Serve the site over HTTP, then retry.</p><button type="button">Retry</button>';
    root.querySelector('button').onclick = route;
  }
}

window.addEventListener('hashchange', route);
route();
