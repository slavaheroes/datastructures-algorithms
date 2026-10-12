(() => {
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('study-theme'); } catch { /* The theme also works without storage. */ }
  const chosen = saved === 'night' || saved === 'day' ? saved : null;
  let manual = chosen !== null;
  function apply(night) {
    document.documentElement.dataset.theme = night ? 'night' : 'day';
    const button = document.getElementById('theme-toggle');
    if (button) {
      const label = night ? 'Switch to light theme' : 'Switch to night theme';
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  }
  apply(chosen ? chosen === 'night' : preference.matches);
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    apply(document.documentElement.dataset.theme === 'night');
    button.addEventListener('click', () => {
      const night = document.documentElement.dataset.theme !== 'night';
      manual = true;
      apply(night);
      try { localStorage.setItem('study-theme', night ? 'night' : 'day'); } catch { /* Keep the current choice for this visit. */ }
    });
  });
  preference.addEventListener('change', event => { if (!manual) apply(event.matches); });
})();
