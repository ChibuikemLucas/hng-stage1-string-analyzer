// Simple in-memory store with helper functions
// Two maps: byHash and byValue (value lowercased) for quick lookups

const byHash = new Map();
const byValue = new Map();

function save(entry) {
    byHash.set(entry.id, entry);
    byValue.set(entry.value.toLowerCase(), entry);
}

function hasByHash(hash) {
    return byHash.has(hash);
}

function getByValue(value) {
    return byValue.get(value.toLowerCase()) || null;
}

function getAll() {
    return Array.from(byHash.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function deleteByValue(value) {
    const key = value.toLowerCase();
    const entry = byValue.get(key);
    if (!entry) return false;
    byValue.delete(key);
    byHash.delete(entry.id);
    return true;
}

module.exports = {
    save,
    hasByHash,
    getByValue,
    getAll,
    deleteByValue,
    // helper alias for controller uses
    hasByHash: hasByHash,
    save: save,
    getByValue: getByValue,
    getAll: getAll,
    deleteByValue: deleteByValue
};
