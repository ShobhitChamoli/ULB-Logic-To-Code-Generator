/**
 * Lexical Analyzer (Tokenizer)
 * Converts source code into a stream of tokens
 */

const KEYWORDS = [
    'START', 'END', 'INPUT', 'PRINT', 'SET',
    'IF', 'THEN', 'ELSE', 'END IF',
    'WHILE', 'DO', 'END WHILE',
    'FOR', 'TO', 'END FOR'
]

const OPERATORS = [
    '+', '-', '*', '/', '%',
    '==', '!=', '<', '>', '<=', '>=',
    '=', '(', ')', ','
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

            // Check for multi-character keywords
            let matched = false

            // Check for END IF, END WHILE, END FOR
            if (line.substring(i).startsWith('END IF')) {
                this.addToken('KEYWORD', 'END IF', this.currentLine)
                i += 6
                matched = true
            } else if (line.substring(i).startsWith('END WHILE')) {
                this.addToken('KEYWORD', 'END WHILE', this.currentLine)
                i += 9
                matched = true
            } else if (line.substring(i).startsWith('END FOR')) {
                this.addToken('KEYWORD', 'END FOR', this.currentLine)
                i += 7
                matched = true
            } else {
                // Check for single keywords
                for (const keyword of KEYWORDS) {
                    if (line.substring(i).startsWith(keyword)) {
                        const nextChar = line[i + keyword.length]
                        if (!nextChar || /\s/.test(nextChar)) {
                            this.addToken('KEYWORD', keyword, this.currentLine)
                            i += keyword.length
                            matched = true
                            break
                        }
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

            // Unknown character
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
