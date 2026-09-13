class Twitter:

    def __init__(self):
        self.time = 0
        self.user2followees = defaultdict(set) # space: N_user * m_followee 
        self.user2tweets = defaultdict(deque) # space: N_user * m_tweets

    def postTweet(self, userId: int, tweetId: int) -> None:
        # O(1) time
        self.user2tweets[userId].appendleft(
            (self.time, tweetId)
        )

        if len(self.user2tweets[userId]) > 10:
            self.user2tweets[userId].pop()

        self.user2followees[userId].add(userId)

        self.time += 1
        

    def getNewsFeed(self, userId: int) -> List[int]:
        # Space: news = n_followees * 10, followees = n_followees
        # Time: n_followees * log(n_followees)

        news = []
        heapq.heapify_max(news)
        followees = [f for f in self.user2followees[userId]]
        
        for f_i, f in enumerate(followees):
            if len(self.user2tweets[f])>0:
                time, tweet = self.user2tweets[f][0]
                heapq.heappush_max(news, (time, 0, f_i, tweet))

        res = []
        while news and len(res)<10:
            _, index, f_i, tweet = heapq.heappop_max(news)
            res.append(tweet)

            if index + 1 < len(self.user2tweets[followees[f_i]]):
                time, tweet = self.user2tweets[followees[f_i]][index+1]
                heapq.heappush_max(news, (time, index+1, f_i, tweet))

        return res


        

    def follow(self, followerId: int, followeeId: int) -> None:
        # O(1) time
        self.user2followees[followerId].add(followeeId)
        self.time += 1
        

    def unfollow(self, followerId: int, followeeId: int) -> None:
        # O(1) time
        self.user2followees[followerId].discard(followeeId)
        self.time += 1        
