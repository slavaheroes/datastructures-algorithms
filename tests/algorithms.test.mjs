import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTree, addTreeNode, buildGraph, numberArray, sortingSteps} from '../assets/algorithms.mjs';

test('compact level-order tree preserves sparse descendants and repeated values', () => {
  const tree=buildTree([1,null,2,3,3]);
  assert.equal(tree[0].left,null); assert.equal(tree[1].left,2); assert.equal(tree[1].right,3);
  assert.deepEqual(tree.map(n=>n.value),[1,2,3,3]);
  assert.deepEqual(buildTree([]),[]); assert.deepEqual(buildTree([null]),[]);
});
test('tree input rejects orphans, invalid values, and excess size', () => {
  for(const value of [[null,2],[1,null,null,4],['1'],[1.2],Array(17).fill(1),{}]) assert.throws(()=>buildTree(value));
});
test('manual tree insertion uses IDs and never overwrites a child', () => {
  const initial=buildTree([2,2]);
  const next=addTreeNode(initial,1,'right',7);
  assert.equal(next[1].right,2); assert.equal(initial[1].right,null);
  assert.throws(()=>addTreeNode(initial,0,'left',3));
  assert.throws(()=>addTreeNode(initial,9,'right',3));
  assert.equal(addTreeNode([],0,'left',5)[0].value,5);
});
test('graphs deduplicate undirected edges and preserve directed reversals', () => {
  assert.deepEqual(buildGraph([[2,1],[1,2],[2,2]],'edges',false).edges,[[2,1],[2,2]]);
  assert.equal(buildGraph([[2,1],[1,2]],'edges',true).edges.length,2);
  assert.deepEqual(buildGraph([[0,0],[0,0]],'matrix',false),{nodes:[0,1],edges:[]});
  assert.deepEqual(buildGraph([[0,1],[0,0]],'matrix',true).edges,[[0,1]]);
});
test('graphs validate dimensions, symmetry, limits, and integer endpoints', () => {
  assert.throws(()=>buildGraph([[0,1],[0,0]],'matrix',false));
  for(const value of [[[0,1]],[[0,2],[2,0]],Array(17).fill([])]) assert.throws(()=>buildGraph(value,'matrix',false));
  for(const value of [[[1]],[[1,'2']],[[1,2,3]],Array.from({length:17},(_,i)=>[i,i])]) assert.throws(()=>buildGraph(value,'edges',false));
});
test('number arrays reject non-integers and oversized inputs', () => {
  assert.deepEqual(numberArray('[-2,0,2]'),[-2,0,2]);
  for(const value of ['{}','[null]','[1.1]','[9007199254740992]']) assert.throws(()=>numberArray(value));
  assert.throws(()=>numberArray('[1,2]',1));
});
for(const algorithm of ['bubble','merge','quick']) {
  test(`${algorithm} sorts edge cases and deterministic generated arrays`, () => {
    let seed=42;
    const samples=[[],[1],[1,1,1],[5,4,3,2,1],[-5,0,-2,3],[1,2,3,4]];
    for(let i=0;i<40;i++) samples.push(Array.from({length:i%25},()=>{seed=(seed*1664525+1013904223)>>>0;return seed%51-25;}));
    for(const input of samples) {
      const copy=[...input],frames=sortingSteps(input,algorithm);
      assert.deepEqual(frames.at(-1).values,[...input].sort((a,b)=>a-b));
      assert.deepEqual(input,copy);
      for(let i=1;i<frames.length;i++) {
        assert.ok(frames[i].comparisons>=frames[i-1].comparisons);
        assert.ok(frames[i].writes>=frames[i-1].writes);
        assert.ok(frames[i].active.every(index=>index>=0&&index<input.length));
      }
    }
  });
}
test('bubble early exit and operation counts', () => {
  assert.equal(sortingSteps([1,2,3],'bubble').at(-1).comparisons,2);
  const end=sortingSteps([2,1],'bubble').at(-1);
  assert.equal(end.comparisons,1);assert.equal(end.writes,2);
});
