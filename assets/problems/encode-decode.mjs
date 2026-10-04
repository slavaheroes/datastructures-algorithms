export default {
  "pattern": "Length prefixes",
  "problem": "Encode a list of strings into one string and decode it without losing empty strings, delimiters, or other characters.",
  "example": "Input: ['hi', '', 'a#b']\nEncoded: '2#hi0#3#a#b'\nDecoded: ['hi', '', 'a#b']",
  "insight": "A separator alone is ambiguous. Prefix each word with its character length and # so the decoder knows exactly how much to read.",
  "steps": [
    "Encode hi as 2#hi, the empty string as 0#, and a#b as 3#a#b.",
    "Read digits up to the next # to get a length.",
    "Slice exactly that many characters, append the word, then move to the next prefix."
  ],
  "complexity": "O(L + n) time and space for n strings with L payload characters under the usual unit-cost length arithmetic model. Encoded output also includes decimal length prefixes.",
  "pitfall": "decode assumes valid data produced by encode; it is not an untrusted-input parser. Lengths count Python characters, not UTF-8 bytes. [] and [''] encode differently."
};
