from collections import Counter


def valid_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)
