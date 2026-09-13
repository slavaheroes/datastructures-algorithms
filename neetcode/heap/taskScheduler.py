class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        # O(len(tasks))
        # O(1) space, because only A-Z letters

        time = 0

        letters = {}
        for t in tasks:
            # O(len(tasks))
            letters[t] = letters.get(t, 0) + 1
        letters = [(v, k) for k,v in letters.items()]
        heapq.heapify_max(letters) # O(26) -> O(1)

        cooldowns = deque()

        while letters or cooldowns:
            # O(26) -> O(1)
            if not letters:
                time_start, freq, task = cooldowns.popleft()
                heapq.heappush_max(letters, (freq, task)) # O(log26) -> O(1)
                time += n - (time-time_start)+1
            else:
                freq, task = heapq.heappop_max(letters) # O(log26) -> O(1)
                freq -= 1
                if freq>0:
                    cooldowns.append(
                        (time, freq, task)
                    )

                # check cooldowns
                if cooldowns and (time - cooldowns[0][0]) - n >= 0:
                    time_start, freq, task = cooldowns.popleft()
                    heapq.heappush_max(letters, (freq, task))
                        

                time += 1


        return time