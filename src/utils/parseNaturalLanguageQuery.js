/**
 * Very small heuristic-based natural language parser to map simple queries
 * to the supported filters. The parser intentionally keeps logic simple and
 * defensive: it recognizes common patterns like "single word", "palindromic",
 * "longer than", "containing the letter z".
 *
 * Returns an object with filter keys (as strings) e.g. { word_count: 1, is_palindrome: true }
 * or null if unable to parse.
 */


function parseNaturalLanguageQuery(q = '') {
    const original = q;
    const lower = q.toLowerCase();

    const out = {};

    // single word / single-word
    if (/\bsingle[- ]word\b/.test(lower) || /\bone word\b/.test(lower)) {
        out.word_count = 1;
    }

    // palindromic / palindrome
    if (/\bpalindromic\b/.test(lower) || /\bpalindrome\b/.test(lower) || /\bis palindromic\b/.test(lower)) {
        out.is_palindrome = true;
    }

    // "strings longer than 10 characters" -> min_length = 11
    const longerMatch = lower.match(/longer than (\d+) (?:characters|chars|length)/);
    if (longerMatch) {
        const num = Number(longerMatch[1]);
        if (!Number.isNaN(num)) out.min_length = num + 1;
    }

    // "longer than or equal to N" or "at least N"
    const atLeastMatch = lower.match(/\b(at least|minimum of|minimum|>=)\s*(\d+)/);
    if (atLeastMatch) {
        const num = Number(atLeastMatch[2]);
        if (!Number.isNaN(num)) out.min_length = Math.max(out.min_length || 0, num);
    }

    // "containing the letter z" or "contain the letter z" or "contains z"
    const containLetter = lower.match(/contain(?:ing)? (?:the )?letter (\w)/) || lower.match(/\bcontains? (\w)\b/);
    if (containLetter) {
        out.contains_character = containLetter[1];
    }

    // "strings containing the letter z"
    const containsCharMatch = lower.match(/containing the letter (\w)/);
    if (containsCharMatch) out.contains_character = containsCharMatch[1];

    // "strings containing the letter 'a'"
    const containsQuoted = lower.match(/containing the letter ['"]?([a-z])['"]?/);
    if (containsQuoted) out.contains_character = containsQuoted[1];

    // fallback: if we parsed nothing, return null
    if (Object.keys(out).length === 0) return null;

    return out;
}

module.exports = { parseNaturalLanguageQuery };
