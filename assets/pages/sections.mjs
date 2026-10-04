import {escape} from '../shared/dom.mjs';

// Sections own their controls and can pause playback when the page is hidden.
export function mountSections(root, {id, title, description, sections}) {
  root.innerHTML = `<h1>${escape(title)}</h1><p class="intro">${escape(description)}</p><nav class="section-nav" aria-label="${escape(title)} sections">${sections.map(section => `<a href="#${id}/${section.id}">${escape(section.title)}</a>`).join('')}</nav>`;
  const controls = [], containers = new Map();
  for (const section of sections) {
    const container = document.createElement('section');
    container.id = `${id}-${section.id}`;
    container.className = 'visualizer-section';
    container.innerHTML = `<h2>${escape(section.title)}</h2><p class="intro">${escape(section.description)}</p><div class="visualizer-content"></div>`;
    root.append(container);
    containers.set(section.id, container);
    controls.push(section.mount(container.querySelector('.visualizer-content')));
  }
  return {
    enter(sectionId) {
      root.querySelectorAll('.section-nav a').forEach(link => {
        if (link.hash === `#${id}/${sectionId}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      if (containers.has(sectionId)) containers.get(sectionId).scrollIntoView({block: 'start'});
      else window.scrollTo(0, 0);
    },
    leave() { controls.forEach(control => control?.deactivate?.()); }
  };
}
