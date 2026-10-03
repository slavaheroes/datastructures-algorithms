def encode(words: list[str]) -> str:
    return ''.join(f'{len(word)}#{word}' for word in words)


def decode(data: str) -> list[str]:
    words = []
    i = 0
    while i < len(data):
        separator = data.index('#', i)
        length = int(data[i:separator])
        start = separator + 1
        words.append(data[start:start + length])
        i = start + length
    return words
