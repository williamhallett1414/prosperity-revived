/**
 * verseRef.js — parse human-written scripture references into a shape the
 * in-app Bible reader can navigate to.
 *
 * Why this exists: challenges, coaching programs, post cards, and other
 * surfaces all reference scripture as free-form strings ("Matthew 4:1-2",
 * "1 Corinthians 13", "Psalm 91"). The in-app Bible reader at /Bible accepts
 * `?book=Matthew&chapter=4` URLs with exact-match book names. We need a
 * single, reliable converter so every surface in the app stays internal
 * (no more redirecting to bible.com — Apple flags external app redirects
 * on paid features, and it tanks the user experience either way).
 *
 * Centralized here so when someone adds a new challenge with "Songs 4:7"
 * (instead of "Song of Solomon 4:7") the fix happens once.
 */

// Canonical book names as the in-app Bible reader expects them, plus common
// alternate spellings users write in challenge/coaching content. The list
// includes both Protestant ordering and the few books with multiple common
// names. Keys are lowercase for case-insensitive matching.
const BOOK_ALIASES = {
  // Old Testament
  'genesis': 'Genesis', 'gen': 'Genesis',
  'exodus': 'Exodus', 'exo': 'Exodus', 'ex': 'Exodus',
  'leviticus': 'Leviticus', 'lev': 'Leviticus',
  'numbers': 'Numbers', 'num': 'Numbers',
  'deuteronomy': 'Deuteronomy', 'deut': 'Deuteronomy', 'dt': 'Deuteronomy',
  'joshua': 'Joshua', 'josh': 'Joshua',
  'judges': 'Judges', 'judg': 'Judges',
  'ruth': 'Ruth',
  '1 samuel': '1 Samuel', '1sam': '1 Samuel', '1 sam': '1 Samuel', 'i samuel': '1 Samuel',
  '2 samuel': '2 Samuel', '2sam': '2 Samuel', '2 sam': '2 Samuel', 'ii samuel': '2 Samuel',
  '1 kings': '1 Kings', '1 kgs': '1 Kings', 'i kings': '1 Kings',
  '2 kings': '2 Kings', '2 kgs': '2 Kings', 'ii kings': '2 Kings',
  '1 chronicles': '1 Chronicles', '1 chr': '1 Chronicles', 'i chronicles': '1 Chronicles',
  '2 chronicles': '2 Chronicles', '2 chr': '2 Chronicles', 'ii chronicles': '2 Chronicles',
  'ezra': 'Ezra',
  'nehemiah': 'Nehemiah', 'neh': 'Nehemiah',
  'esther': 'Esther', 'est': 'Esther',
  'job': 'Job',
  'psalm': 'Psalms', 'psalms': 'Psalms', 'ps': 'Psalms', // singular alias normalizes to plural
  'proverbs': 'Proverbs', 'prov': 'Proverbs', 'pr': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes', 'eccl': 'Ecclesiastes', 'ecc': 'Ecclesiastes',
  'song of solomon': 'Song of Solomon', 'song of songs': 'Song of Solomon', 'song': 'Song of Solomon', 'songs': 'Song of Solomon', 'sos': 'Song of Solomon',
  'isaiah': 'Isaiah', 'isa': 'Isaiah', 'is': 'Isaiah',
  'jeremiah': 'Jeremiah', 'jer': 'Jeremiah',
  'lamentations': 'Lamentations', 'lam': 'Lamentations',
  'ezekiel': 'Ezekiel', 'ezek': 'Ezekiel', 'eze': 'Ezekiel',
  'daniel': 'Daniel', 'dan': 'Daniel',
  'hosea': 'Hosea', 'hos': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obadiah': 'Obadiah', 'obad': 'Obadiah',
  'jonah': 'Jonah', 'jon': 'Jonah',
  'micah': 'Micah', 'mic': 'Micah',
  'nahum': 'Nahum', 'nah': 'Nahum',
  'habakkuk': 'Habakkuk', 'hab': 'Habakkuk',
  'zephaniah': 'Zephaniah', 'zeph': 'Zephaniah',
  'haggai': 'Haggai', 'hag': 'Haggai',
  'zechariah': 'Zechariah', 'zech': 'Zechariah',
  'malachi': 'Malachi', 'mal': 'Malachi',

  // New Testament
  'matthew': 'Matthew', 'matt': 'Matthew', 'mt': 'Matthew',
  'mark': 'Mark', 'mk': 'Mark',
  'luke': 'Luke', 'lk': 'Luke',
  'john': 'John', 'jn': 'John',
  'acts': 'Acts',
  'romans': 'Romans', 'rom': 'Romans',
  '1 corinthians': '1 Corinthians', '1 cor': '1 Corinthians', 'i corinthians': '1 Corinthians',
  '2 corinthians': '2 Corinthians', '2 cor': '2 Corinthians', 'ii corinthians': '2 Corinthians',
  'galatians': 'Galatians', 'gal': 'Galatians',
  'ephesians': 'Ephesians', 'eph': 'Ephesians',
  'philippians': 'Philippians', 'phil': 'Philippians', 'php': 'Philippians',
  'colossians': 'Colossians', 'col': 'Colossians',
  '1 thessalonians': '1 Thessalonians', '1 thess': '1 Thessalonians', 'i thessalonians': '1 Thessalonians',
  '2 thessalonians': '2 Thessalonians', '2 thess': '2 Thessalonians', 'ii thessalonians': '2 Thessalonians',
  '1 timothy': '1 Timothy', '1 tim': '1 Timothy', 'i timothy': '1 Timothy',
  '2 timothy': '2 Timothy', '2 tim': '2 Timothy', 'ii timothy': '2 Timothy',
  'titus': 'Titus',
  'philemon': 'Philemon', 'phlm': 'Philemon',
  'hebrews': 'Hebrews', 'heb': 'Hebrews',
  'james': 'James', 'jas': 'James',
  '1 peter': '1 Peter', '1 pet': '1 Peter', 'i peter': '1 Peter',
  '2 peter': '2 Peter', '2 pet': '2 Peter', 'ii peter': '2 Peter',
  '1 john': '1 John', '1 jn': '1 John', 'i john': '1 John',
  '2 john': '2 John', '2 jn': '2 John', 'ii john': '2 John',
  '3 john': '3 John', '3 jn': '3 John', 'iii john': '3 John',
  'jude': 'Jude',
  'revelation': 'Revelation', 'rev': 'Revelation', 'revelations': 'Revelation', // common typo
};

/**
 * Parse a free-form scripture reference string into book/chapter parts.
 *
 * Handles:
 *   "Matthew 4:1-2"     → { book: 'Matthew', chapter: 4 }
 *   "1 Corinthians 13"  → { book: '1 Corinthians', chapter: 13 }
 *   "Psalm 91"          → { book: 'Psalms', chapter: 91 }  (singular → plural)
 *   "1 John 3:1"        → { book: '1 John', chapter: 3 }
 *   "Hebrews 12:1"      → { book: 'Hebrews', chapter: 12 }
 *   "Songs of Solomon 4:7" → { book: 'Song of Solomon', chapter: 4 }
 *
 * Verse ranges (the :1-2 part) are intentionally dropped — the in-app Bible
 * reader is chapter-scoped, not verse-scoped, so we navigate to the chapter
 * and the user can scroll to the verse they want. This matches how the
 * reading-plan pattern works (PlanDetail.jsx routes via book+chapter only).
 *
 * Returns null if the string can't be parsed (don't crash the page; the
 * caller should render the reference as plain text and skip the link).
 */
export function parseVerseReference(verseString) {
  if (!verseString || typeof verseString !== 'string') return null;

  // Strip surrounding whitespace and any trailing translation tag like "(NIV)"
  // or "(NIV)" that occasionally appears in user-written content.
  const trimmed = verseString.replace(/\s*\([A-Z]{2,5}\)\s*$/i, '').trim();
  if (!trimmed) return null;

  // The pattern is: <book name (1-3 words, may start with digit)> <chapter>[:verseRange]
  // Match greedily on the book name, then a chapter number, then optional ":..." we ignore.
  // Handles "1 Corinthians 13", "Song of Solomon 4:7", "Psalm 91" all in one shot.
  const match = trimmed.match(/^(.+?)\s+(\d+)(?:[:.]\d.*)?$/);
  if (!match) return null;

  const rawBook = match[1].trim().toLowerCase();
  const chapter = parseInt(match[2], 10);
  if (!chapter || chapter < 1) return null;

  const book = BOOK_ALIASES[rawBook];
  if (!book) return null;

  return { book, chapter };
}

/**
 * Convenience: build the in-app navigation path for a verse string.
 * Returns null if the verse can't be parsed.
 *
 *   buildBibleUrl("Matthew 4:1-2") → "Bible?book=Matthew&chapter=4"
 *
 * Caller wraps with createPageUrl() before passing to navigate/Link.
 */
export function buildBibleUrl(verseString, extraParams = {}) {
  const parsed = parseVerseReference(verseString);
  if (!parsed) return null;
  const params = new URLSearchParams({
    book: parsed.book,
    chapter: String(parsed.chapter),
    ...extraParams,
  });
  return `Bible?${params.toString()}`;
}
