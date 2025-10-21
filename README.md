# HNG Stage 1 - String Analyzer Service

**Author:** Lucas-Emerenini Chibuikem Kennedy  
**Email:** chibuikemlucas@gmail.com  
**Repo:** hng-stage1-string-analyzer

## Overview
A RESTful API that analyzes strings and stores their computed properties. Built with Node.js and Express. This service supports creation, retrieval, listing with filters, natural-language filtering (simple heuristics), and deletion of analyzed strings.

## Endpoints

### POST /strings
- Request body:
```json
{ "value": "string to analyze" }

Success: 201 Created with entry:

{
  "id": "<sha256>",
  "value": "string to analyze",
  "properties": { ... },
  "created_at": "ISO timestamp"
}`

Errors: 400, 409, 422

GET /strings/:string_value

Returns analyzed entry or 404 if not found.

GET /strings

Query filters:

is_palindrome=true|false

min_length, max_length (integers)

word_count (integer)

contains_character (single character)

Returns { data: [...], count, filters_applied }

GET /strings/filter-by-natural-language?query=...

Accepts simple English queries (e.g. all single word palindromic strings)

Returns parsed filters + data

DELETE /strings/:string_value

Deletes entry, returns 204 No Content or 404.

## Run locally

```Clone repo

git clone https://github.com/<your-username>/hng-stage1-string-analyzer.git
cd hng-stage1-string-analyzer`


Install

```npm install`


Start (dev)

npm run dev
# or
npm start


Test

curl -X POST http://localhost:8080/strings -H "Content-Type: application/json" -d '{"value":"racecar"}'
curl http://localhost:8080/strings/racecar
curl "http://localhost:8080/strings?is_palindrome=true&min_length=3"
curl "http://localhost:8080/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

