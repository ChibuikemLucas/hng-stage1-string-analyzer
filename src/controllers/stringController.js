const { analyzeString } = require('../utils/analyzeString');
const { parseNaturalLanguageQuery } = require('../utils/parseNaturalLanguageQuery');
const store = require('../data/store');

// Create string
const createString = (req, res) => {
    try {
        const { value } = req.body;
        if (typeof value !== 'string') return res.status(422).json({ error: "'value' must be a string" });

        const props = analyzeString(value);
        // Check by hash
        if (store.hasByHash(props.sha256_hash)) {
            return res.status(409).json({ error: 'String already exists in the system' });
        }

        const entry = {
            id: props.sha256_hash,
            value,
            properties: props,
            created_at: new Date().toISOString()
        };

        store.save(entry);
        return res.status(201).json(entry);
    } catch (err) {
        console.error('createString error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get specific
const getString = (req, res) => {
    try {
        const raw = req.params.string_value || '';
        const decoded = decodeURIComponent(raw);
        const found = store.getByValue(decoded);
        if (!found) return res.status(404).json({ error: 'String does not exist in the system' });
        return res.json(found);
    } catch (err) {
        console.error('getString error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all + filters
const getAllStrings = (req, res) => {
    try {
        let items = store.getAll();
        const filtersApplied = {};

        // is_palindrome filter (exact boolean)
        if (req.query.is_palindrome !== undefined) {
            const val = req.query.is_palindrome === 'true';
            items = items.filter(it => it.properties.is_palindrome === val);
            filtersApplied.is_palindrome = val;
        }

        if (req.query.min_length !== undefined) {
            const min = Number(req.query.min_length);
            if (Number.isNaN(min)) return res.status(400).json({ error: 'min_length must be integer' });
            items = items.filter(it => it.properties.length >= min);
            filtersApplied.min_length = min;
        }

        if (req.query.max_length !== undefined) {
            const max = Number(req.query.max_length);
            if (Number.isNaN(max)) return res.status(400).json({ error: 'max_length must be integer' });
            items = items.filter(it => it.properties.length <= max);
            filtersApplied.max_length = max;
        }

        if (req.query.word_count !== undefined) {
            const wc = Number(req.query.word_count);
            if (Number.isNaN(wc)) return res.status(400).json({ error: 'word_count must be integer' });
            items = items.filter(it => it.properties.word_count === wc);
            filtersApplied.word_count = wc;
        }

        if (req.query.contains_character !== undefined) {
            const ch = req.query.contains_character;
            if (typeof ch !== 'string' || ch.length !== 1) return res.status(400).json({ error: 'contains_character must be a single character string' });
            items = items.filter(it => it.value.includes(ch));
            filtersApplied.contains_character = ch;
        }

        return res.json({ data: items, count: items.length, filters_applied: filtersApplied });
    } catch (err) {
        console.error('getAllStrings error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Natural language filter
const filterByNaturalLanguage = (req, res) => {
    try {
        const q = req.query.query || '';
        const parsed = parseNaturalLanguageQuery(q);
        if (!parsed) return res.status(400).json({ error: 'Unable to parse natural language query' });

        // apply parsed filters
        req.query = { ...req.query, ...parsed };
        return getAllStrings(req, res);
    } catch (err) {
        console.error('filterByNaturalLanguage error', err);
        return res.status(422).json({ error: 'Query parsed but resulted in conflicting filters' });
    }
};

// Delete string
const deleteString = (req, res) => {
    try {
        const raw = req.params.string_value || '';
        const decoded = decodeURIComponent(raw);
        const found = store.getByValue(decoded);
        if (!found) return res.status(404).json({ error: 'String does not exist in the system' });
        store.deleteByValue(decoded);
        return res.status(204).send();
    } catch (err) {
        console.error('deleteString error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createString,
    getString,
    getAllStrings,
    filterByNaturalLanguage,
    deleteString
};
