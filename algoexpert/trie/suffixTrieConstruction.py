# Do not edit the class below except for the
# populateSuffixTrieFrom and contains methods.
# Feel free to add new properties and methods
# to the class.
class SuffixTrie:
    def __init__(self, string):
        self.root = {}
        self.endSymbol = "*"
        self.populateSuffixTrieFrom(string)

    def populateSuffixTrieFrom(self, string):
        # Write your code here.
        # O(len(string)^2)
        for i in range(len(string)):
            if not string[i] in self.root:
                self.root[string[i]] = {}
            curr = self.root[string[i]]                
                
            for j in range(i+1, len(string)):
                if not string[j] in curr:
                    curr[string[j]] = {}
                curr = curr[string[j]]
            curr[self.endSymbol] = True

    def contains(self, string):
        # Write your code here.
        # O(len(string))
        curr = self.root
        for i in range(len(string)):
            if string[i] in curr:
                curr = curr[string[i]]
            else:
                return False

        if self.endSymbol in curr:
            return True
            
        return False