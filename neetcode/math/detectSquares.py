class CountSquares:

    def __init__(self):
        # O(n) space

        self.points = defaultdict(int)
        

    def add(self, point: List[int]) -> None:
        # O(1) time

        self.points[tuple(point)] += 1
        

    def count(self, point: List[int]) -> int:
        # O(n) time

        res = 0
        for pp, count in self.points.items():
            dx = pp[0]-point[0]
            dy = pp[1]-point[1]

            if abs(dx)!=abs(dy) or dx==0 or dy==0:
                continue

            if (dx+point[0], point[1]) in self.points and (point[0], dy+point[1]) in self.points:
                res += (
                    count
                    * self.points[(pp[0], point[1])]
                    * self.points[(point[0], pp[1])]
                )

        return res
        