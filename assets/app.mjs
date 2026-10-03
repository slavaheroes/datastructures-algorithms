import {NODE_LIMIT, buildTrees, addTreeNode, buildGraph, numberArray, sortingSteps} from './algorithms.mjs';

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function guarded(id, action) {
  $(id).textContent = '';
  try { action(); } catch (error) { $(id).textContent = error.message; }
}
function integer(id) {
  const raw = $(id).value.trim(), value = Number(raw);
  if (!raw || !Number.isSafeInteger(value)) throw Error('Enter a safe integer in each numeric field.');
  return value;
}
let mode = 'tree', trees = buildTrees([8,3,10,1,6,9,14]), selectedTree = 0;
let graph = buildGraph([[0,1],[0,2],[1,3],[2,3],[3,4]], 'edges', false);
let graphDirected = false;
const svgNode = (x,y,value) => `<g class="node"><circle cx="${x}" cy="${y}" r="23"/><text x="${x}" y="${y}">${value}</text><title>Node ${value}</title></g>`;
function renderStructure() {
  const isTree = mode === 'tree';
  $('tree-controls').hidden = !isTree; $('graph-controls').hidden = isTree;
  $('tree-gallery').hidden = !isTree; $('graph-canvas').hidden = isTree;
  for (const name of ['tree','graph']) { $(`${name}-tab`).classList.toggle('active', mode === name); $(`${name}-tab`).setAttribute('aria-pressed', String(mode === name)); }
  $('structure-title').textContent = isTree ? 'BINARY TREE' : `${graphDirected ? 'DIRECTED' : 'UNDIRECTED'} GRAPH`;
  let lines = '', nodes = '', width = 800, height = 460;
  if (isTree) {
    $('tree-picker').innerHTML = trees.map((tree, index) => `<option value="${index}">Tree ${index + 1} (${tree.length}/${NODE_LIMIT} nodes)</option>`).join('');
    $('tree-picker').value = String(selectedTree);
    const tree = trees[selectedTree];
    const selected = $('tree-parent').value;
    $('tree-parent').innerHTML = tree.map(n => `<option value="${n.id}">${n.value} (node ${n.id})</option>`).join('') || '<option value="">New root</option>';
    if (tree.some(n => String(n.id) === selected)) $('tree-parent').value = selected;
    $('tree-gallery').innerHTML = trees.map((tree, index) => {
      const points = new Map(); let rank = 0, maxDepth = 0;
      function layout(id, depth) {
        if (id === null) return;
        const node = tree[id]; layout(node.left, depth + 1);
        points.set(id, {x: rank++, depth}); maxDepth = Math.max(depth, maxDepth);
        layout(node.right, depth + 1);
      }
      if (tree.length) layout(0, 0);
      const w = Math.max(420, tree.length * 65), h = Math.max(280, 130 + maxDepth * 90);
      for (const p of points.values()) { p.x = (p.x + 1) * w / (tree.length + 1); p.y = 65 + p.depth * 90; }
      let edges = '', vertices = '';
      tree.forEach(node => {
        const p = points.get(node.id);
        for (const side of ['left','right']) if (node[side] !== null) {
          const q = points.get(node[side]); edges += `<path class="edge" d="M${p.x} ${p.y} L${q.x} ${q.y}"/>`;
        }
        vertices += svgNode(p.x, p.y, node.value);
      });
      const caption = tree.length ? `Root: ${tree[0].value} · Height: ${maxDepth} edges` : 'Empty tree. Select this tree and add a node to create its root.';
      return `<section class="canvas-panel"><div class="canvas-heading"><span>Tree ${index + 1}</span><span>${tree.length}/${NODE_LIMIT} nodes</span></div><div class="svg-scroll"><svg class="tree-svg" viewBox="0 0 ${w} ${h}" style="min-width:${w}px" role="img" aria-label="Tree ${index + 1}, ${tree.length} nodes">${edges + vertices || `<text x="${w/2}" y="140" text-anchor="middle" fill="#58636b">Empty tree</text>`}</svg></div><div class="canvas-caption">${caption}</div></section>`;
    }).join('');
    $('structure-explanation').textContent = 'Each array creates a separate binary tree. Use null for missing children; only existing parents consume the next pair of values. Each tree allows up to 16 actual nodes. Select a tree before adding a node manually.';
    $('structure-text').textContent = trees.map((tree, index) => `Tree ${index + 1}:\n` + (tree.map(n => `Node ${n.id}: value ${n.value}; left ${n.left === null ? 'none' : `node ${n.left}`}; right ${n.right === null ? 'none' : `node ${n.right}`}`).join('\n') || 'Empty tree')).join('\n\n');
  } else {
    const positions = new Map();
    graph.nodes.forEach((id, i) => { const angle = i * 2 * Math.PI / graph.nodes.length - Math.PI / 2; positions.set(id,{x:400 + (graph.nodes.length === 1 ? 0 : 290 * Math.cos(angle)),y:230 + (graph.nodes.length === 1 ? 0 : 160 * Math.sin(angle))}); });
    lines = '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#849b77"/></marker></defs>';
    graph.edges.forEach(([a,b]) => {
      const p = positions.get(a), q = positions.get(b), marker = graphDirected ? ' marker-end="url(#arrow)"' : '';
      let d;
      if (a === b) d = `M${p.x-15} ${p.y-18} C${p.x-60} ${p.y-83},${p.x+60} ${p.y-83},${p.x+17} ${p.y-18}`;
      else {
        const dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
        const reverse = graphDirected && graph.edges.some(([c,e])=> c===b && e===a);
        const bend = reverse ? 32 : 0;
        d = `M${p.x+ux*25} ${p.y+uy*25} Q${(p.x+q.x)/2-uy*bend} ${(p.y+q.y)/2+ux*bend} ${q.x-ux*29} ${q.y-uy*29}`;
      }
      lines += `<path class="edge" d="${d}"${marker}/>`;
    });
    graph.nodes.forEach(id => { const p = positions.get(id); nodes += svgNode(p.x,p.y,id); });
    $('structure-count').textContent = `${graph.nodes.length} nodes · ${graph.edges.length} edges`;
    $('structure-caption').textContent = graph.nodes.length ? 'Circular layout · Node positions are for readability, not distance or weight.' : 'Empty graph. Build from data or add an isolated node.';
    $('structure-explanation').textContent = 'Graphs describe connections between nodes. Directed edges point from one node to another; undirected edges connect both ways. A 1 in matrix row i, column j means an edge from i to j. Matrix rows can preserve isolated nodes.';
    $('structure-text').textContent = graph.nodes.map(id => `${id} → [${graph.edges.flatMap(([a,b])=>a===id?[b]:!graphDirected&&b===id?[a]:[]).join(', ')}]`).join('\n') || 'Empty graph';
  }
  $('structure-svg').setAttribute('viewBox', `0 0 ${width} ${height}`);
  $('structure-svg').style.minWidth = `${width > 800 ? width : 0}px`;
  $('structure-svg').innerHTML = lines + nodes || '<text x="400" y="230" text-anchor="middle" fill="#64756e">No nodes.</text>';
}
for (const name of ['tree','graph']) $(`${name}-tab`).onclick = () => { mode=name; $('structure-error').textContent=''; renderStructure(); };
$('build-tree').onclick = () => guarded('structure-error', () => { trees=buildTrees(JSON.parse($('tree-array').value)); selectedTree=0; renderStructure(); });
$('add-tree').onclick = () => guarded('structure-error', () => { trees[selectedTree]=addTreeNode(trees[selectedTree],Number($('tree-parent').value),$('tree-side').value,integer('tree-value')); renderStructure(); });
$('tree-picker').onchange = () => { selectedTree=Number($('tree-picker').value); $('structure-error').textContent=''; renderStructure(); };
$('new-tree').onclick = () => { trees.push([]); selectedTree=trees.length-1; $('structure-error').textContent=''; renderStructure(); };
$('clear-tree').onclick = () => { trees[selectedTree]=[]; $('structure-error').textContent=''; renderStructure(); };
$('clear-trees').onclick = () => { trees=[[]]; selectedTree=0; $('tree-array').value='[]'; $('structure-error').textContent=''; renderStructure(); };
$('graph-format').onchange = () => { $('graph-input').value = $('graph-format').value === 'matrix' ? '[[0,1,1],[1,0,0],[1,0,0]]' : '[[0,1],[0,2],[1,3],[2,3],[3,4]]'; };
$('build-graph').onclick = () => guarded('structure-error', () => { const next=buildGraph(JSON.parse($('graph-input').value),$('graph-format').value,$('directed').checked); graph=next; graphDirected=$('directed').checked; renderStructure(); });
$('directed').onchange = () => { graphDirected=$('directed').checked; const next=buildGraph(graph.edges,'edges',graphDirected); graph={nodes:graph.nodes, edges:next.edges}; renderStructure(); };
$('add-graph-node').onclick = () => guarded('structure-error', () => { const id=integer('graph-node'); if(graph.nodes.includes(id)) throw Error('That node ID already exists.'); if(graph.nodes.length>=NODE_LIMIT) throw Error('Keep graphs at 16 nodes or fewer.'); graph.nodes.push(id); renderStructure(); });
$('add-edge').onclick = () => guarded('structure-error', () => { const next=buildGraph([...graph.edges,[integer('edge-from'),integer('edge-to')]],'edges',graphDirected); next.nodes=[...new Set([...graph.nodes,...next.nodes])]; if(next.nodes.length>NODE_LIMIT) throw Error('Keep graphs at 16 nodes or fewer.'); graph=next; renderStructure(); });
$('clear-graph').onclick = () => { graph={nodes:[],edges:[]}; $('graph-input').value='[]'; $('structure-error').textContent=''; renderStructure(); };

const sortInfo = {
  bubble: 'Compare adjacent values and swap out-of-order pairs. Each pass moves the largest remaining value to the end. Best O(n) with early exit; average/worst O(n²) time; O(1) auxiliary space. Stable.',
  merge: 'Split into halves, sort each half, then merge by repeatedly taking the smaller front value. All cases O(n log n) time; O(n) auxiliary space. Stable because ties come from the left half first.',
  quick: 'Choose the last value as pivot, partition smaller values to its left, then sort both sides. Average O(n log n), worst O(n²) time (including sorted or equal inputs here). Recursive space: average O(log n), worst O(n). Not stable.'
};
let frames=[], position=0, timer=null;
function pause(){ if(timer!==null) clearTimeout(timer); timer=null; $('sort-play').textContent='Play'; }
function renderSort(){
  const frame=frames[position], values=frame.values;
  const low=Math.min(0,...values), high=Math.max(1,...values), span=high-low;
  $('sort-bars').innerHTML=values.map((v,i)=>`<div class="bar ${frame.active.includes(i)?'active':''}" style="height:${18+(v-low)/span*80}%"><span>${v}</span></div>`).join('');
  $('sort-bars').setAttribute('aria-label',`Array at step ${position}: ${values.join(', ') || 'empty'}`);
  $('sort-message').textContent=frame.message;
  $('sort-progress').textContent=`${position} / ${frames.length-1} steps`;
  $('sort-stats').textContent=`${frame.comparisons} comparisons · ${frame.writes} writes`;
  $('sort-step').disabled=position===frames.length-1;
  $('sort-play').disabled=position===frames.length-1;
}
function loadSort(){
  const values=numberArray($('sort-input').value,32);
  if(values.some(v=>Math.abs(v)>999)) throw Error('Keep each value between −999 and 999.');
  pause(); frames=sortingSteps(values,$('sort-algorithm').value); position=0;
  $('sort-name').textContent=$('sort-algorithm').selectedOptions[0].text.toUpperCase();
  $('sort-explanation').textContent=sortInfo[$('sort-algorithm').value]; renderSort();
}
function advance(){ if(position<frames.length-1) position++; renderSort(); if(position===frames.length-1) pause(); }
function tick(){ advance(); if(position<frames.length-1) timer=setTimeout(tick,1100-Number($('sort-speed').value)*100); }
$('sort-play').onclick=()=>{ if(timer!==null){pause();return;} $('sort-play').textContent='Pause'; timer=setTimeout(tick,1100-Number($('sort-speed').value)*100); };
$('sort-step').onclick=()=>{pause();advance();};
$('sort-reset').onclick=()=>{pause();position=0;renderSort();};
$('load-sort').onclick=()=>guarded('sort-error',loadSort);
$('sort-algorithm').onchange=()=>{pause();guarded('sort-error',loadSort);};
$('random-sort').onclick=()=>{ $('sort-input').value=JSON.stringify(Array.from({length:10},()=>Math.floor(Math.random()*90)+10)); guarded('sort-error',loadSort); };
document.addEventListener('visibilitychange',()=>{if(document.hidden) pause();});

let lessons=[];
function renderLesson(slug){
  if(!lessons.length) return;
  const lesson=lessons.find(l=>l.slug===slug)||lessons[0];
  $('lesson-list').innerHTML=lessons.map((l,i)=>`<a href="#practice/${l.slug}" aria-current="${l===lesson}">${String(i+1).padStart(2,'0')} &nbsp; ${escape(l.title)}</a>`).join('');
  $('lesson').innerHTML=`<div class="lesson-meta"><span class="pill">${escape(lesson.difficulty)}</span><span class="eyebrow">${escape(lesson.pattern)}</span></div><h2>${escape(lesson.title)}</h2><p>${escape(lesson.problem)}</p><h3>Example</h3><pre class="example">${escape(lesson.example)}</pre><h3>Approach</h3><p>${escape(lesson.insight)}</p><h3>Steps</h3><ol>${lesson.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><h3>Python solution</h3><pre><code>${escape(lesson.code)}</code></pre><div class="complexity"><h3>Time &amp; space</h3><p>${escape(lesson.complexity)}</p></div><h3>Notes</h3><p>${escape(lesson.pitfall)}</p><a class="text-link" href="${escape(lesson.source)}" download>Download Python solution ↓</a>`;
}
function route(){
  const [raw,slug]=location.hash.slice(1).split('/');
  const name=['home','structures','sorting','practice'].includes(raw)?raw:'home';
  document.querySelectorAll('.page').forEach(page=>{page.hidden=page.id!==name;});
  document.querySelectorAll('header nav a').forEach(a=>{ if(a.hash===`#${name}`) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  if(name!=='sorting') pause();
  if(name==='practice') renderLesson(slug);
  document.title=`${{home:'Home',structures:'Trees and graphs',sorting:'Sorting',practice:'Arrays & Hashing'}[name]} — Data structures and algorithms`;
}
window.addEventListener('hashchange',route);
renderStructure();loadSort();route();
async function loadLessons(){
  try {
    const response=await fetch('assets/problems.json');
    if(!response.ok) throw Error('Could not load lesson index.');
    const metadata=await response.json();
    lessons=await Promise.all(metadata.map(async lesson=>{const res=await fetch(lesson.source);if(!res.ok) throw Error('Could not load Python solutions.');return {...lesson,code:await res.text()};}));
    route();
  } catch(error){$('lesson').innerHTML='<h2>Solutions could not load</h2><p>Serve the site over HTTP, then retry. For local setup, see the README.</p><button id="retry-lessons">Retry</button>'; $('retry-lessons').onclick=loadLessons;}
}
loadLessons();
