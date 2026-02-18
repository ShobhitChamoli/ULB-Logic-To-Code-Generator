/**
 * Lexical Analyzer (Tokenizer)
 * Converts source code into a stream of tokens
 * Supports all data structure keywords and operations
 */

const KEYWORDS = [
    // Program structure
    'START', 'END',
    // I/O
    'INPUT', 'PRINT', 'SET',
    // Control flow
    'IF', 'THEN', 'ELSE', 'END IF',
    'WHILE', 'DO', 'END WHILE',
    'FOR', 'TO', 'END FOR',
    // Array
    'ARRAY',
    // Stack
    'STACK', 'PUSH', 'POP', 'TOP',
    // Queue
    'QUEUE', 'ENQUEUE', 'DEQUEUE', 'FRONT',
    // Map / Dictionary
    'MAP', 'MAP_INSERT', 'MAP_GET', 'MAP_REMOVE',
    // Set
    'SET_DS', 'SET_ADD', 'SET_REMOVE', 'CONTAINS',
    // Vector
    'VECTOR', 'VECTOR_PUSH', 'VECTOR_POP',
    // Linked List
    'LINKED_LIST', 'LL_PUSH_FRONT', 'LL_PUSH_BACK', 'LL_POP_FRONT', 'LL_POP_BACK',
    // Tree (BST)
    'TREE', 'TREE_INSERT',
    // Graph
    'GRAPH', 'GRAPH_ADD_EDGE',
    // Common operations
    'SIZE', 'EMPTY',
    // Pair
    'PAIR', 'PAIR_FIRST', 'PAIR_SECOND',
    // Priority Queue
    'PRIORITY_QUEUE',
    // Deque
    'DEQUE', 'DEQUE_PUSH_FRONT', 'DEQUE_PUSH_BACK', 'DEQUE_POP_FRONT', 'DEQUE_POP_BACK',
    // Struct
    'STRUCT'
]

// Sort keywords by length (longest first) to match multi-word keywords before shorter ones
const SORTED_KEYWORDS = [...KEYWORDS].sort((a, b) => b.length - a.length)

const OPERATORS = [
    '+', '-', '*', '/', '%',
    '==', '!=', '<', '>', '<=', '>=',
    '=', '(', ')', ',', '[', ']'
]

export default class Lexer {
    constructor(code) {
        this.code = code
        this.tokens = []
        this.currentLine = 1
        this.position = 0
    }

    tokenize() {
        const lines = this.code.split('\n')

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum].trim()
            this.currentLine = lineNum + 1

            if (line === '' || line.startsWith('//')) continue

            this.tokenizeLine(line)
        }

        return this.tokens
    }

    tokenizeLine(line) {
        let i = 0

        while (i < line.length) {
            // Skip whitespace
            if (/\s/.test(line[i])) {
                i++
                continue
            }

            // Check for multi-word keywords (sorted longest first)
            let matched = false
            for (const keyword of SORTED_KEYWORDS) {
                if (line.substring(i).startsWith(keyword)) {
                    const nextChar = line[i + keyword.length]
                    if (!nextChar || /[\s\[\](,]/.test(nextChar)) {
                        this.addToken('KEYWORD', keyword, this.currentLine)
                        i += keyword.length
                        matched = true
                        break
                    }
                }
            }

            if (matched) continue

            // Check for operators (check two-char operators first)
            if (i < line.length - 1) {
                const twoChar = line.substring(i, i + 2)
                if (['==', '!=', '<=', '>='].includes(twoChar)) {
                    this.addToken('OPERATOR', twoChar, this.currentLine)
                    i += 2
                    continue
                }
            }

            if (OPERATORS.includes(line[i])) {
                this.addToken('OPERATOR', line[i], this.currentLine)
                i++
                continue
            }

            // Check for numbers
            if (/\d/.test(line[i])) {
                let num = ''
                while (i < line.length && /[\d.]/.test(line[i])) {
                    num += line[i]
                    i++
                }
                this.addToken('NUMBER', num, this.currentLine)
                continue
            }

            // Check for strings
            if (line[i] === '"' || line[i] === "'") {
                const quote = line[i]
                let str = ''
                i++
                while (i < line.length && line[i] !== quote) {
                    str += line[i]
                    i++
                }
                i++ // Skip closing quote
                this.addToken('STRING', str, this.currentLine)
                continue
            }

            // Check for identifiers
            if (/[a-zA-Z_]/.test(line[i])) {
                let identifier = ''
                while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
                    identifier += line[i]
                    i++
                }
                this.addToken('IDENTIFIER', identifier, this.currentLine)
                continue
            }

            // Unknown character - skip
            i++
        }
    }

    addToken(type, value, line) {
        this.tokens.push({ type, value, line })
    }

    getTokens() {
        return this.tokens
    }
}
