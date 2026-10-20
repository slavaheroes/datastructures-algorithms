export default {
  pattern: 'Directed cycle detection: DFS or Kahn BFS',
  problem: 'Given numCourses courses labeled 0 through numCourses − 1 and pairs [course, prerequisite], determine whether every course can be completed.',
  example: 'numCourses = 2, prerequisites = [[1,0]] → True\nnumCourses = 2, prerequisites = [[1,0],[0,1]] → False',
  insight: 'A directed cycle requires a course to depend on itself through other courses. DFS detects a return to the active path. Kahn’s algorithm repeatedly removes nodes with no incoming edges; a cycle leaves some nodes unprocessed.',
  steps: ['DFS version: build prerequisite → dependent adjacency sets. Check the active path before checking the global visited set.', 'A course already in path closes a cycle and returns False. A previously visited course outside the current path can return True.', 'For a new course, add it to path and visited, search its dependents, then discard it from path after successful exploration. Start DFS for every course.', 'Reference version: build adjacency lists and indegrees, enqueue all zero-indegree nodes, and repeatedly pop a node and decrement each neighbor’s indegree.', 'Count popped nodes and return whether the count equals numCourses.'],
  complexity: 'Both versions take O(V + E) time and O(V + E) auxiliary space, including adjacency storage; DFS can use O(V) recursion depth.',
  pitfall: 'The reference interprets each input pair as src → dst, reversing the usual prerequisite direction used by the DFS version. Reversing every edge preserves whether a cycle exists, so this still answers feasibility; it would reverse a returned course order. The file stores both Solution classes; a plain Python import keeps the final class.'
};
