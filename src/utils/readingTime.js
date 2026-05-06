const WORDS_PER_MINUTE = 200;

/**
 * Rounds up to nearest minute, minimum 1.
 */
function calculateReadingTime(wordCount) {
  if (!wordCount || wordCount < 1) return 1;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

module.exports = { calculateReadingTime, WORDS_PER_MINUTE };
