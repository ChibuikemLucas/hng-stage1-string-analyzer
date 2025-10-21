const express = require('express');
const { body, validationResult, query } = require('express-validator');
const router = express.Router();

const controller = require('../controllers/stringController');

// Create / Analyze String
router.post(
    '/strings',
    body('value').exists().withMessage('value is required').bail()
        .isString().withMessage('value must be a string').bail()
        .notEmpty().withMessage('value must not be empty'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        return controller.createString(req, res);
    }
);

// Get specific string (value is URL-encoded)
router.get('/strings/:string_value', controller.getString);

// Get all strings with filters
router.get(
    '/strings',
    // optional query validators
    query('is_palindrome').optional().isBoolean().withMessage('is_palindrome must be boolean'),
    query('min_length').optional().isInt().withMessage('min_length must be integer'),
    query('max_length').optional().isInt().withMessage('max_length must be integer'),
    query('word_count').optional().isInt().withMessage('word_count must be integer'),
    controller.getAllStrings
);

// Natural language filter
router.get('/strings/filter-by-natural-language', async (req, res) => {
    const q = req.query.query;
    if (!q) return res.status(400).json({ error: 'query parameter is required' });
    return controller.filterByNaturalLanguage(req, res);
});

// Delete string
router.delete('/strings/:string_value', controller.deleteString);

module.exports = router;
