const crypto = require('crypto');

function analyzeString(value) {
    // Do not strip whitespace unless spec says so — use exact characters
    const length = value.length;
    const normalized = value.toLowerCase();
    // palindrome check — ignore spaces and punctuation? Spec says case-insensitive only.
    const filtered = normalized.replace(/\s+/g, ''); // remove whitespace for palindrome check (common approach)
    const is_palindrome = filtered === filtered.split('').reverse().join('');
    const unique_characters = new Set(normalized).size;
    const word_count = value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;
    const sha256_hash = crypto.createHash('sha256').update(value).digest('hex');

    const character_frequency_map = {};
    for (const ch of normalized) {
        character_frequency_map[ch] = (character_frequency_map[ch] || 0) + 1;
    }

    return {
        length,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map
    };
}

module.exports = { analyzeString };
