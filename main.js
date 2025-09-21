
```javascript
const root = document.getElementById('root');

const state = {
  reels: [],
  trendingProjects: [],
  used: new Set(),
  isLoading: false,
  error: null,
  observer: null,
};

const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'style') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
};

const header = el('div', { class: 'header' }, [
  el('h1', {}, 'Infinite AI Reels'),
  el('p', {}, 'AI-generated short previews of trending Websim projects. Scroll for more.'),
]);
const container = el('div', { class: 'reel-container' });
const loader = el('div', { class: 'loader-container', style: { display: 'none' } }, [
  el('div', { class: 'spinner' }),
  el('p', { class: 'loading-text' }, 'Generating next reel...'),
]);
const errorEl = el('p', { style: { color: 'red', display: 'none' } });

root.appendChild(header);
root.appendChild(container);
root.appendChild(loader);
root.appendChild(errorEl);

const setLoading = (v) => {
  state.isLoading = v;
  loader.style.display = v ? 'flex' : 'none';
};
const setError = (msg) => {
  state.error = msg;
  errorEl.textContent = msg ? `Error: ${msg}` : '';
  errorEl.style.display = msg ? 'block' : 'none';
};

const fetchTrendingProjects = async () => {
  try {
    const res = await fetch('/api/v1/projects/trending');
    if (!res.ok) return null;
    const data = await res.json();
    return data.sites?.data || null;
  } catch {
    return null;
  }
};

const fetchFallbackProject = async () => {
  try {
    const project = await websim.getCurrentProject();
    const creator = await websim.getCreator();
    return project && creator ? [{ ...project, user: creator }] : [];
  } catch {
    return [];
  }
};

const generateReelConcept = async (project) => {
  const completion = await websim.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You create short, punchy reel concepts. Respond with JSON only:
{
  "title": "Max 3 words",
  "script": ["2-3 short lines, max 8 words each"],
  "callToAction": "Short CTA",
  "visualStyle": {
    "backgroundColor": "#000000",
    "textColor": "#FFFFFF",
    "fontFamily": "Noto Sans"
  },
  "projectInfo": {
    "title": "${project.title}",
    "creator": "${project.user.username}",
    "imageUrl": "https://images.websim.com/v1/site/${project.id}/600",
    "creatorAvatarUrl": "https://images.websim.com/avatar/${project.user.username}"
  }
}`
      },
      {
        role: "user",
        content: `Project Title: ${project.title}\\nProject Description: ${project.description}\\nCreator: @${project.user.username}`
      }
    ],
    json: true,
  });
  const parsed = JSON.parse(completion.content);
  return { ...parsed, key: project.id + Math.random() };
};

const createReelElement = (reel) => {
  const wrapper = el('div', { class: 'reel-item' });
  const bg = el('div', { style: {
    position: 'absolute', inset: '0', background: reel.visualStyle?.backgroundColor || '#000'
  }});

  const stage = el('div', { style: {
    position: 'absolute', inset: '0',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '20px',
    textAlign: 'center'
  }});

  const title = el('div', { style: {
    fontFamily: reel.visualStyle?.fontFamily || 'Noto Sans',
    color: reel.visualStyle?.textColor || '#fff',
    fontSize: '42px', fontWeight: '800', opacity: '0', transform: 'translateY(10px)',
    transition: 'opacity .4s ease, transform .4s ease'
  }}, reel.title);

  const scriptContainer = el('div', { });
  (reel.script || []).forEach((line, i) => {
    const p = el('div', { style: {
      fontFamily: reel.visualStyle?.fontFamily || 'Noto Sans',
      color: reel.visualStyle?.textColor || '#fff',
      fontSize: '28px', opacity: '0', transform: 'translateY(10px)',
      transition: 'opacity .4s ease, transform .4s ease', marginTop: '6px'
    }}, line);
    scriptContainer.appendChild(p);
    setTimeout(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; }, 600 + i * 400);
  });

  const showcase = el('div', { style: {
    marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', opacity: '0',
    transition: 'opacity .5s ease'
  }}, [
    el('img', { src: reel.projectInfo.imageUrl, alt: reel.projectInfo.title, style: {
      width: '80%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,.4)'
    }}),
    el('div', { style: {
      fontSize: '20px', fontWeight: '700', color: '#fff', background: 'rgba(0,0,0,.5)', padding: '6px 12px', borderRadius: '10px', maxWidth: '90%'
    }}, reel.projectInfo.title),
  ]);

  const cta = el('div', { style: {
    position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
    fontFamily: reel.visualStyle?.fontFamily || 'Noto Sans',
    color: reel.visualStyle?.textColor || '#fff',
    fontSize: '22px', fontWeight: '800', background: 'rgba(0,0,0,.5)', padding: '8px 14px', borderRadius: '999px',
    opacity: '0', transition: 'opacity .4s ease'
  }}, reel.callToAction || 'Discover more');

  const creatorBar = el('div', { style: {
    position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,.5)',
    padding: '8px 12px', borderRadius: '999px'
  }}, [
    el('img', { src: reel.projectInfo.creatorAvatarUrl, alt: reel.projectInfo.creator, style: { width: '32px', height: '32px', borderRadius: '50%' }}),
    el('span', { style: { fontSize: '16px', fontWeight: '700', color: '#fff' } }, `@${reel.projectInfo.creator}`)
  ]);

  const audio = el('audio', { src: '/uplifting_music.mp3', loop: true });
  audio.volume = 0.5;
  // Autoplay with sound may be blocked; start muted and allow tap to unmute.
  audio.muted = true;
  audio.play().catch(() => { /* ignore autoplay rejection */ });

  const unmute = el('button', { style: {
    position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,.6)', color: '#fff',
    border: '1px solid #444', borderRadius: '16px', padding: '6px 10px', fontSize: '12px'
  }, onclick: async () => {
    audio.muted = false;
    try { await audio.play(); } catch {}
  }}, 'Unmute');

  stage.appendChild(title);
  stage.appendChild(scriptContainer);
  stage.appendChild(showcase);
  stage.appendChild(cta);
  wrapper.appendChild(bg);
  wrapper.appendChild(stage);
  wrapper.appendChild(creatorBar);
  wrapper.appendChild(audio);
  wrapper.appendChild(unmute);

  // Staggered reveals
  requestAnimationFrame(() => {
    title.style.opacity = '1';
    title.style.transform = 'translateY(0)';
    setTimeout(() => { showcase.style.opacity = '1'; }, 1400);
    setTimeout(() => { cta.style.opacity = '1'; }, 2200);
  });

  // Click-through to the project (open in new tab)
  wrapper.addEventListener('click', (e) => {
    if (e.target === unmute) return;
    const url = `/site/${encodeURIComponent(reel.projectInfo.title)}`; // Fallback; platform may map differently
    window.open(url, '_blank');
  });

  return wrapper;
};

const addNewReel = async () => {
  if (state.isLoading || state.trendingProjects.length === 0) return;
  setLoading(true);
  setError(null);
  try {
    let available = state.trendingProjects.filter(p => !state.used.has(p.id));
    if (available.length === 0) {
      available = state.trendingProjects;
      state.used.clear();
    }
    const project = available[Math.floor(Math.random() * available.length)];
    const concept = await generateReelConcept(project);
    state.reels.push(concept);
    state.used.add(project.id);
    const node = createReelElement(concept);
    container.appendChild(node);
    observeLast();
  } catch (e) {
    setError(e.message || 'Failed to generate reel.');
  } finally {
    setLoading(false);
  }
};

const observeLast = () => {
  if (state.observer) state.observer.disconnect();
  const last = container.lastElementChild;
  if (!last) return;
  state.observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) addNewReel();
  }, { rootMargin: '400px 0px' });
  state.observer.observe(last);
};

(async function init() {
  setLoading(true);
  try {
    let projects = await fetchTrendingProjects();
    if (!projects || projects.length === 0) projects = await fetchFallbackProject();
    if (!projects || projects.length === 0) {
      setError('No projects found to generate reels.');
      return;
    }
    state.trendingProjects = projects;
    await addNewReel();
    await addNewReel();
  } catch (e) {
    setError(e.message || 'Initialization failed.');
  } finally {
    setLoading(false);
  }
})();