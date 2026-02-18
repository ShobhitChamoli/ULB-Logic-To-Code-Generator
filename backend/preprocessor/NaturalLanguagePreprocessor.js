/**
 * Natural Language Preprocessor
 * Converts natural language phrases and case-insensitive input
 * into normalized uppercase keywords before lexing.
 * 
 * This is the first phase of the compilation pipeline:
 * NaturalLanguagePreprocessor → Lexer → Parser → SemanticAnalyzer → CodeGenerator
 */

export default class NaturalLanguagePreprocessor {
    constructor(code) {
        this.code = code
        this.lines = []
    }

    process() {
        this.lines = this.code.split('\n')
        const processed = this.lines.map(line => this.processLine(line))
        return processed.join('\n')
    }

    processLine(line) {
        // Preserve empty lines and comments
        const trimmed = line.trim()
        if (trimmed === '' || trimmed.startsWith('//')) return line

        // Extract strings to protect them from transformation
        const { cleaned, strings } = this.extractStrings(trimmed)

        // Lowercase everything (case-insensitive) 
        let normalized = cleaned.toLowerCase()

        // Apply natural language transformations (order matters — longest first)
        normalized = this.applyDataStructureTransformations(normalized)
        normalized = this.applyControlFlowTransformations(normalized)
        normalized = this.applyIOTransformations(normalized)
        normalized = this.applyComparisonTransformations(normalized)
        normalized = this.applyMathTransformations(normalized)

        // Uppercase all known keywords
        normalized = this.uppercaseKeywords(normalized)

        // Restore strings
        normalized = this.restoreStrings(normalized, strings)

        return normalized
    }

    // ─── String Protection ──────────────────────────────────────────────────────

    extractStrings(line) {
        const strings = []
        let cleaned = ''
        let inString = false
        let quote = ''
        let current = ''

        for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (!inString && (ch === '"' || ch === "'")) {
                inString = true
                quote = ch
                current = ''
            } else if (inString && ch === quote) {
                inString = false
                strings.push(current)
                cleaned += `__STR${strings.length - 1}__`
            } else if (inString) {
                current += ch
            } else {
                cleaned += ch
            }
        }

        return { cleaned, strings }
    }

    restoreStrings(line, strings) {
        return line.replace(/__STR(\d+)__/gi, (match, index) => {
            return `"${strings[parseInt(index)]}"`
        })
    }

    // ─── Data Structure Transformations ─────────────────────────────────────────

    applyDataStructureTransformations(line) {
        // === STRUCT ===
        line = line.replace(/^create struct (\w+) with fields (.+)$/i, (_, name, fields) => {
            return `STRUCT ${name} ${fields.split(/[,\s]+/).filter(Boolean).join(' ')}`
        })
        line = line.replace(/^make struct (\w+) with fields (.+)$/i, (_, name, fields) => {
            return `STRUCT ${name} ${fields.split(/[,\s]+/).filter(Boolean).join(' ')}`
        })

        // === PRIORITY QUEUE ===
        line = line.replace(/^create priority queue (\w+)$/i, 'PRIORITY_QUEUE $1')
        line = line.replace(/^make priority queue (\w+)$/i, 'PRIORITY_QUEUE $1')

        // === DEQUE ===
        line = line.replace(/^create deque (\w+)$/i, 'DEQUE $1')
        line = line.replace(/^make deque (\w+)$/i, 'DEQUE $1')
        line = line.replace(/^push front (\w+) (.+)$/i, 'DEQUE_PUSH_FRONT $1 $2')
        line = line.replace(/^push back (\w+) (.+)$/i, 'DEQUE_PUSH_BACK $1 $2')
        line = line.replace(/^pop front from (\w+)$/i, 'DEQUE_POP_FRONT $1')
        line = line.replace(/^pop back from (\w+)$/i, 'DEQUE_POP_BACK $1')

        // === PAIR ===
        line = line.replace(/^create pair (\w+) with (.+) and (.+)$/i, 'PAIR $1 $2 $3')
        line = line.replace(/^make pair (\w+) with (.+) and (.+)$/i, 'PAIR $1 $2 $3')
        line = line.replace(/^first of (\w+)$/i, 'PAIR_FIRST $1')
        line = line.replace(/^second of (\w+)$/i, 'PAIR_SECOND $1')

        // === GRAPH ===
        line = line.replace(/^create graph (\w+) with (\w+) nodes$/i, 'GRAPH $1 $2')
        line = line.replace(/^make graph (\w+) with (\w+) nodes$/i, 'GRAPH $1 $2')
        line = line.replace(/^add edge from (\w+) to (\w+) in (\w+)$/i, 'GRAPH_ADD_EDGE $3 $1 $2')
        line = line.replace(/^add edge (\w+) (\w+) in (\w+)$/i, 'GRAPH_ADD_EDGE $3 $1 $2')

        // === TREE (BST) ===
        line = line.replace(/^create tree (\w+)$/i, 'TREE $1')
        line = line.replace(/^make tree (\w+)$/i, 'TREE $1')
        line = line.replace(/^insert (.+) into tree (\w+)$/i, 'TREE_INSERT $2 $1')
        line = line.replace(/^add (.+) to tree (\w+)$/i, 'TREE_INSERT $2 $1')

        // === LINKED LIST ===
        line = line.replace(/^create linked list (\w+)$/i, 'LINKED_LIST $1')
        line = line.replace(/^make linked list (\w+)$/i, 'LINKED_LIST $1')
        line = line.replace(/^add (.+) to front of (\w+)$/i, 'LL_PUSH_FRONT $2 $1')
        line = line.replace(/^add (.+) to back of (\w+)$/i, 'LL_PUSH_BACK $2 $1')
        line = line.replace(/^remove front from (\w+)$/i, 'LL_POP_FRONT $1')
        line = line.replace(/^remove back from (\w+)$/i, 'LL_POP_BACK $1')

        // === VECTOR ===
        line = line.replace(/^create vector (\w+)$/i, 'VECTOR $1')
        line = line.replace(/^make vector (\w+)$/i, 'VECTOR $1')
        line = line.replace(/^append (.+) to (\w+)$/i, 'VECTOR_PUSH $2 $1')
        line = line.replace(/^push (.+) to vector (\w+)$/i, 'VECTOR_PUSH $2 $1')
        line = line.replace(/^remove last from (\w+)$/i, 'VECTOR_POP $1')

        // === SET ===
        line = line.replace(/^create set (\w+)$/i, 'SET_DS $1')
        line = line.replace(/^make set (\w+)$/i, 'SET_DS $1')
        line = line.replace(/^add (.+) to set (\w+)$/i, 'SET_ADD $2 $1')
        line = line.replace(/^remove (.+) from set (\w+)$/i, 'SET_REMOVE $2 $1')
        line = line.replace(/^(\w+) contains (.+)$/i, 'CONTAINS $1 $2')

        // === MAP / DICTIONARY ===
        line = line.replace(/^create map (\w+)$/i, 'MAP $1')
        line = line.replace(/^make map (\w+)$/i, 'MAP $1')
        line = line.replace(/^create dictionary (\w+)$/i, 'MAP $1')
        line = line.replace(/^make dictionary (\w+)$/i, 'MAP $1')
        line = line.replace(/^put (\w+) (\w+) in (\w+)$/i, 'MAP_INSERT $3 $1 $2')
        line = line.replace(/^insert (\w+) (\w+) into (\w+)$/i, 'MAP_INSERT $3 $1 $2')
        line = line.replace(/^map insert (\w+) (\w+) (\w+)$/i, 'MAP_INSERT $1 $2 $3')
        line = line.replace(/^map get (\w+) (\w+)$/i, 'MAP_GET $1 $2')
        line = line.replace(/^get from (\w+) using (\w+)$/i, 'MAP_GET $1 $2')
        line = line.replace(/^map remove (\w+) (\w+)$/i, 'MAP_REMOVE $1 $2')

        // === QUEUE ===
        line = line.replace(/^create queue (\w+)$/i, 'QUEUE $1')
        line = line.replace(/^make queue (\w+)$/i, 'QUEUE $1')
        line = line.replace(/^enqueue (.+) into (\w+)$/i, 'ENQUEUE $2 $1')
        line = line.replace(/^add (.+) to queue (\w+)$/i, 'ENQUEUE $2 $1')
        line = line.replace(/^dequeue from (\w+)$/i, 'DEQUEUE $1')
        line = line.replace(/^remove from queue (\w+)$/i, 'DEQUEUE $1')
        line = line.replace(/^front of (\w+)$/i, 'FRONT $1')

        // === STACK ===
        line = line.replace(/^create stack (\w+)$/i, 'STACK $1')
        line = line.replace(/^make stack (\w+)$/i, 'STACK $1')
        line = line.replace(/^push (.+) onto (\w+)$/i, 'PUSH $2 $1')
        line = line.replace(/^push (.+) to (\w+)$/i, 'PUSH $2 $1')
        line = line.replace(/^add (.+) to stack (\w+)$/i, 'PUSH $2 $1')
        line = line.replace(/^pop from (\w+)$/i, 'POP $1')
        line = line.replace(/^remove from stack (\w+)$/i, 'POP $1')
        line = line.replace(/^top of (\w+)$/i, 'TOP $1')
        line = line.replace(/^peek (\w+)$/i, 'TOP $1')

        // === COMMON (size, empty) ===
        line = line.replace(/^size of (\w+)$/i, 'SIZE $1')
        line = line.replace(/^(\w+) is empty$/i, 'EMPTY $1')

        // === ARRAY (already partially supported) ===
        line = line.replace(/^create array (\w+) of size (.+)$/i, 'ARRAY $1 $2')
        line = line.replace(/^create list (\w+) with (.+) items$/i, 'ARRAY $1 $2')
        line = line.replace(/^make array (\w+) of size (.+)$/i, 'ARRAY $1 $2')

        return line
    }

    // ─── Control Flow Transformations ───────────────────────────────────────────

    applyControlFlowTransformations(line) {
        // Program boundaries
        line = line.replace(/^begin$/i, 'START')
        line = line.replace(/^start$/i, 'START')
        line = line.replace(/^finish$/i, 'END')
        line = line.replace(/^end$/i, 'END')

        // End blocks (must come before single-word replacements)
        line = line.replace(/^end\s+if$/i, 'END IF')
        line = line.replace(/^endif$/i, 'END IF')
        line = line.replace(/^end\s+while$/i, 'END WHILE')
        line = line.replace(/^endwhile$/i, 'END WHILE')
        line = line.replace(/^end\s+for$/i, 'END FOR')
        line = line.replace(/^endfor$/i, 'END FOR')
        line = line.replace(/^end\s+repeat$/i, 'END FOR')

        // If/Else
        line = line.replace(/^if\s+(.+)\s+then$/i, 'IF $1 THEN')
        line = line.replace(/^otherwise$/i, 'ELSE')
        line = line.replace(/^else$/i, 'ELSE')

        // For loop — "for X from A to B"
        line = line.replace(/^for\s+(\w+)\s+from\s+(.+)\s+to\s+(.+)$/i, 'FOR $1 = $2 TO $3')
        line = line.replace(/^for each\s+(\w+)\s+from\s+(.+)\s+to\s+(.+)$/i, 'FOR $1 = $2 TO $3')

        // Repeat N times
        line = line.replace(/^repeat\s+(.+)\s+times\s+with\s+(\w+)$/i, 'FOR $2 = 0 TO $1 - 1')
        line = line.replace(/^repeat\s+(.+)\s+times$/i, 'FOR i = 0 TO $1 - 1')

        // While
        line = line.replace(/^keep doing while\s+(.+)$/i, 'WHILE $1 DO')
        line = line.replace(/^while\s+(.+)\s+do$/i, 'WHILE $1 DO')

        // For loop standard
        line = line.replace(/^for\s+(\w+)\s*=\s*(.+)\s+to\s+(.+)$/i, 'FOR $1 = $2 TO $3')

        return line
    }

    // ─── I/O Transformations ────────────────────────────────────────────────────

    applyIOTransformations(line) {
        // Input
        line = line.replace(/^ask for\s+(.+)$/i, 'INPUT $1')
        line = line.replace(/^get\s+(\w+)$/i, 'INPUT $1')
        line = line.replace(/^read\s+(\w+)$/i, 'INPUT $1')
        line = line.replace(/^input\s+(.+)$/i, 'INPUT $1')

        // Output
        line = line.replace(/^show\s+(.+)$/i, 'PRINT $1')
        line = line.replace(/^display\s+(.+)$/i, 'PRINT $1')
        line = line.replace(/^output\s+(.+)$/i, 'PRINT $1')
        line = line.replace(/^print\s+(.+)$/i, 'PRINT $1')

        // Assignment — "set X to Y" / "make X equal to Y" / "let X = Y"
        line = line.replace(/^set\s+(\w+)\s+to\s+(.+)$/i, 'SET $1 = $2')
        line = line.replace(/^make\s+(\w+)\s+equal\s+to\s+(.+)$/i, 'SET $1 = $2')
        line = line.replace(/^let\s+(\w+)\s*=\s*(.+)$/i, 'SET $1 = $2')
        line = line.replace(/^set\s+(.+)$/i, 'SET $1')

        return line
    }

    // ─── Comparison Transformations ─────────────────────────────────────────────

    applyComparisonTransformations(line) {
        line = line.replace(/\bis greater than\b/gi, '>')
        line = line.replace(/\bis less than\b/gi, '<')
        line = line.replace(/\bis greater than or equal to\b/gi, '>=')
        line = line.replace(/\bis less than or equal to\b/gi, '<=')
        line = line.replace(/\bis at least\b/gi, '>=')
        line = line.replace(/\bis at most\b/gi, '<=')
        line = line.replace(/\bis not equal to\b/gi, '!=')
        line = line.replace(/\bis equal to\b/gi, '==')
        line = line.replace(/\bequals\b/gi, '==')
        line = line.replace(/\bnot equals\b/gi, '!=')
        return line
    }

    // ─── Math Transformations ───────────────────────────────────────────────────

    applyMathTransformations(line) {
        line = line.replace(/\bplus\b/gi, '+')
        line = line.replace(/\bminus\b/gi, '-')
        line = line.replace(/\btimes\b/gi, '*')
        line = line.replace(/\bdivided by\b/gi, '/')
        line = line.replace(/\bmodulo\b/gi, '%')
        line = line.replace(/\bmod\b/gi, '%')
        return line
    }

    // ─── Keyword Uppercasing ────────────────────────────────────────────────────

    uppercaseKeywords(line) {
        const keywords = [
            'START', 'END', 'INPUT', 'PRINT', 'SET', 'ARRAY',
            'IF', 'THEN', 'ELSE', 'END IF',
            'WHILE', 'DO', 'END WHILE',
            'FOR', 'TO', 'END FOR',
            // Data structures
            'STACK', 'PUSH', 'POP', 'TOP',
            'QUEUE', 'ENQUEUE', 'DEQUEUE', 'FRONT',
            'MAP', 'MAP_INSERT', 'MAP_GET', 'MAP_REMOVE',
            'SET_DS', 'SET_ADD', 'SET_REMOVE', 'CONTAINS',
            'VECTOR', 'VECTOR_PUSH', 'VECTOR_POP',
            'LINKED_LIST', 'LL_PUSH_FRONT', 'LL_PUSH_BACK', 'LL_POP_FRONT', 'LL_POP_BACK',
            'TREE', 'TREE_INSERT',
            'GRAPH', 'GRAPH_ADD_EDGE',
            'SIZE', 'EMPTY',
            'PAIR', 'PAIR_FIRST', 'PAIR_SECOND',
            'PRIORITY_QUEUE',
            'DEQUE', 'DEQUE_PUSH_FRONT', 'DEQUE_PUSH_BACK', 'DEQUE_POP_FRONT', 'DEQUE_POP_BACK',
            'STRUCT'
        ]

        // Replace lowercase versions of keywords with uppercase at word boundaries
        // Only replace if the word appears standalone (not inside an identifier)
        for (const kw of keywords) {
            const lowerKw = kw.toLowerCase()
            // Use word boundary regex to replace standalone keyword occurrences
            const regex = new RegExp(`\\b${this.escapeRegex(lowerKw)}\\b`, 'gi')
            line = line.replace(regex, kw)
        }

        return line
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
}
