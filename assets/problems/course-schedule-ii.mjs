import {mountCourseSchedule} from '../visualizations/graph-lessons.mjs';
export const mountVisualization = mountCourseSchedule;
export default {
  pattern: 'Kahn BFS with prerequisite sets',
  problem: 'Return a valid order for courses 0 through numCourses − 1 given pairs [course, prerequisite]. Return [] if a cycle makes completion impossible.',
  example: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]\nOne output: [0,1,2,3]',
  insight: 'A course is available exactly when its remaining prerequisite set is empty. Finishing a course removes it from the sets of its dependents; newly empty sets become ready for the queue.',
  steps: ['Build preqs[course] as a set of prerequisites and graph[prerequisite] as a set of dependent courses.', 'Enqueue all courses with empty prerequisite sets, in numeric order.', 'Pop a ready course and append it to res.', 'For every dependent v, discard the completed course from preqs[v]. Enqueue v when its set becomes empty.', 'Return res if its length equals numCourses; otherwise return [].'],
  complexity: 'O(V + E) time and O(V + E) auxiliary space. Duplicate input pairs collapse into sets.',
  pitfall: 'The dependent collections are sets, so the saved Python solution can return a different valid ordering from this playback’s stable input-order traversal. An empty initial queue indicates a cycle only when some courses remain; cycles can also become apparent after an acyclic prefix is processed.'
};
