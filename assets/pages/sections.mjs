import {escape} from '../shared/dom.mjs';

// Keep each tool in its own route, mounting it only when selected.
export function mountSections(root, {id, title, description, sections}) {
  root.innerHTML = `<p class="section-breadcrumb" hidden><a href="#${id}">${escape(title)}</a><span aria-hidden="true"> / </span><span class="section-current"></span></p>
    <h1 tabindex="-1">${escape(title)}</h1><p class="intro section-description">${escape(description)}</p>
    <nav class="section-nav" aria-label="${escape(title)} sections"><a href="#${id}">Overview</a>${sections.map(section => `<a href="#${id}/${section.id}">${escape(section.title)}</a>`).join('')}</nav>
    <div class="cards section-overview">${sections.map(section => `<a class="path-card" href="#${id}/${section.id}"><h2>${escape(section.title)}</h2><p>${escape(section.description)}</p><span>Open ${escape(section.title)} <span aria-hidden="true">→</span></span></a>`).join('')}</div>
    <div class="section-host"></div>`;
  const tools = new Map();
  const host = root.querySelector('.section-host');
  let active;
  return {
    enter(sectionId) {
      const section = sections.find(item => item.id === sectionId);
      if (active !== section?.id) tools.get(active)?.control?.deactivate?.();
      active = section?.id;
      root.querySelector('h1').textContent = section?.title || title;
      root.querySelector('.section-description').textContent = section?.description || description;
      root.querySelector('.section-breadcrumb').hidden = !section;
      root.querySelector('.section-current').textContent = section?.title || '';
      root.querySelector('.section-overview').hidden = Boolean(section);
      root.querySelectorAll('.section-nav a').forEach(link => {
        if (link.hash === `#${id}${section ? `/${section.id}` : ''}`) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      host.replaceChildren();
      if (section) {
        if (!tools.has(section.id)) {
          const container = document.createElement('div');
          container.className = 'visualizer-content';
          host.append(container);
          tools.set(section.id, {container, control: section.mount(container)});
        } else host.append(tools.get(section.id).container);
      }
      document.title = `${section ? `${section.title} — ${title}` : title} — Data structures and algorithms`;
      window.scrollTo(0, 0);
    },
    leave() { tools.get(active)?.control?.deactivate?.(); }
  };
}
