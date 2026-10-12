export default {
  pattern: 'Find the latest timestamp at or before a query',
  problem: 'Implement set(key, value, timestamp) and get(key, timestamp). A query returns the value with the greatest stored timestamp no later than the query time, or an empty string if none exists. Set timestamps arrive in increasing order.',
  example: 'set("foo", "bar", 1)\nget("foo", 1) → "bar"\nget("foo", 3) → "bar"\nset("foo", "bar2", 4)\nget("foo", 4) → "bar2"\nget("foo", 5) → "bar2"',
  insight: 'Store an append-only list of (timestamp, value) pairs for each key. During get, a timestamp no later than the query is a valid candidate, but a later valid entry might be better; save the value and continue searching to the right.',
  steps: ['set creates the key’s list when needed, then appends a (timestamp, value) tuple.', 'get returns an empty string immediately for an unknown key. Otherwise initialize ans = "" and binary search that key’s list.', 'When vals[mid][0] <= timestamp, set ans to vals[mid][1] and move l to mid + 1.', 'When the middle timestamp is too late, set r = mid − 1. Return the last saved ans.'],
  complexity: 'set takes O(1) amortized time. get takes O(log k) time and O(1) auxiliary space for k timestamps belonging to the queried key. The store holds O(N) entries over all set calls, excluding the contents of the stored strings.',
  pitfall: 'Appending preserves timestamp order only because of the problem’s increasing-timestamp guarantee. The implementation does not sort or insert out-of-order timestamps. A query before the first timestamp returns an empty string.'
};
