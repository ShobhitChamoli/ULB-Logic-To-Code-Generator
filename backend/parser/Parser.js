/**
 * Syntax Analyzer (Parser)
 * Builds Abstract Syntax Tree (AST) from tokens
 * Supports all data structures: stack, queue, map, set, vector,
 * linked list, tree, graph, pair, priority queue, deque, struct, array
 */

export default class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.current = 0
        this.ast = null
        this.errors = []
    }

    parse() {
        try {
            this.ast = this.parseProgram()
            return { ast: this.ast, errors: this.errors }
        } catch (error) {
            this.errors.push({ line: this.getCurrentLine(), message: error.message })
            return { ast: null, errors: this.errors }
        }
    }

    parseProgram() {
        const statements = []

        // Expect START
        if (!this.match('KEYWORD', 'START')) {
            throw new Error('Program must start with START keyword')
        }

        // Parse statements until END
        while (!this.check('KEYWORD', 'END') && !this.isAtEnd()) {
            try {
                const stmt = this.parseStatement()
                if (stmt) statements.push(stmt)
            } catch (error) {
                this.errors.push({ line: this.getCurrentLine(), message: error.message })
                this.synchronize()
            }
        }

        // Expect END
        if (!this.match('KEYWORD', 'END')) {
            throw new Error('Program must end with END keyword')
        }

        return {
            type: 'Program',
            body: statements
        }
    }

    parseStatement() {
        const token = this.peek()

        if (!token) return null

        if (token.type === 'KEYWORD') {
            switch (token.value) {
                // ── Core ──
                case 'INPUT': return this.parseInput()
                case 'PRINT': return this.parsePrint()
                case 'SET': return this.parseAssignment()
                case 'IF': return this.parseIf()
                case 'WHILE': return this.parseWhile()
                case 'FOR': return this.parseFor()
                case 'ARRAY': return this.parseArray()

                // ── Stack ──
                case 'STACK': return this.parseCreateDS('StackCreate', 'stack')
                case 'PUSH': return this.parseDSOperation('StackPush', 2)
                case 'POP': return this.parseDSOperation('StackPop', 1)
                case 'TOP': return this.parseDSOperation('StackTop', 1)

                // ── Queue ──
                case 'QUEUE': return this.parseCreateDS('QueueCreate', 'queue')
                case 'ENQUEUE': return this.parseDSOperation('QueueEnqueue', 2)
                case 'DEQUEUE': return this.parseDSOperation('QueueDequeue', 1)
                case 'FRONT': return this.parseDSOperation('QueueFront', 1)

                // ── Map ──
                case 'MAP': return this.parseCreateDS('MapCreate', 'map')
                case 'MAP_INSERT': return this.parseDSOperation('MapInsert', 3)
                case 'MAP_GET': return this.parseDSOperation('MapGet', 2)
                case 'MAP_REMOVE': return this.parseDSOperation('MapRemove', 2)

                // ── Set ──
                case 'SET_DS': return this.parseCreateDS('SetCreate', 'set')
                case 'SET_ADD': return this.parseDSOperation('SetAdd', 2)
                case 'SET_REMOVE': return this.parseDSOperation('SetRemove', 2)
                case 'CONTAINS': return this.parseDSOperation('Contains', 2)

                // ── Vector ──
                case 'VECTOR': return this.parseCreateDS('VectorCreate', 'vector')
                case 'VECTOR_PUSH': return this.parseDSOperation('VectorPush', 2)
                case 'VECTOR_POP': return this.parseDSOperation('VectorPop', 1)

                // ── Linked List ──
                case 'LINKED_LIST': return this.parseCreateDS('LinkedListCreate', 'linked_list')
                case 'LL_PUSH_FRONT': return this.parseDSOperation('LLPushFront', 2)
                case 'LL_PUSH_BACK': return this.parseDSOperation('LLPushBack', 2)
                case 'LL_POP_FRONT': return this.parseDSOperation('LLPopFront', 1)
                case 'LL_POP_BACK': return this.parseDSOperation('LLPopBack', 1)

                // ── Tree ──
                case 'TREE': return this.parseCreateDS('TreeCreate', 'tree')
                case 'TREE_INSERT': return this.parseDSOperation('TreeInsert', 2)

                // ── Graph ──
                case 'GRAPH': return this.parseGraphCreate()
                case 'GRAPH_ADD_EDGE': return this.parseDSOperation('GraphAddEdge', 3)

                // ── Common ──
                case 'SIZE': return this.parseDSOperation('Size', 1)
                case 'EMPTY': return this.parseDSOperation('Empty', 1)

                // ── Pair ──
                case 'PAIR': return this.parsePairCreate()
                case 'PAIR_FIRST': return this.parseDSOperation('PairFirst', 1)
                case 'PAIR_SECOND': return this.parseDSOperation('PairSecond', 1)

                // ── Priority Queue ──
                case 'PRIORITY_QUEUE': return this.parseCreateDS('PriorityQueueCreate', 'priority_queue')

                // ── Deque ──
                case 'DEQUE': return this.parseCreateDS('DequeCreate', 'deque')
                case 'DEQUE_PUSH_FRONT': return this.parseDSOperation('DequePushFront', 2)
                case 'DEQUE_PUSH_BACK': return this.parseDSOperation('DequePushBack', 2)
                case 'DEQUE_POP_FRONT': return this.parseDSOperation('DequePopFront', 1)
                case 'DEQUE_POP_BACK': return this.parseDSOperation('DequePopBack', 1)

                // ── Struct ──
                case 'STRUCT': return this.parseStructCreate()

                default:
                    throw new Error(`Unexpected keyword: ${token.value}`)
            }
        }

        // Handle identifier-based assignment (x = expr)
        if (token.type === 'IDENTIFIER') {
            return this.parseIdentifierStatement()
        }

        throw new Error(`Unexpected token: ${token.value}`)
    }

    // ─── Core Statement Parsers ─────────────────────────────────────────────────

    parseInput() {
        this.advance() // consume INPUT
        const identifier = this.consume('IDENTIFIER', 'Expected variable name after INPUT')

        return {
            type: 'InputStatement',
            variable: identifier.value,
            line: identifier.line
        }
    }

    parsePrint() {
        this.advance() // consume PRINT
        const expr = this.parseExpression()

        return {
            type: 'PrintStatement',
            expression: expr,
            line: this.previous().line
        }
    }

    parseAssignment() {
        this.advance() // consume SET
        const identifier = this.consume('IDENTIFIER', 'Expected variable name after SET')

        // Handle array element assignment: SET arr[i] = value
        if (this.matchOperator(['['])) {
            const index = this.parseExpression()
            this.consume('OPERATOR', 'Expected ]', ']')
            this.consume('OPERATOR', 'Expected = after variable', '=')
            const expr = this.parseExpression()
            return {
                type: 'ArraySetStatement',
                array: identifier.value,
                index: index,
                expression: expr,
                line: identifier.line
            }
        }

        this.consume('OPERATOR', 'Expected = after variable name', '=')
        const expr = this.parseExpression()

        return {
            type: 'AssignmentStatement',
            variable: identifier.value,
            expression: expr,
            line: identifier.line
        }
    }

    parseIdentifierStatement() {
        const identifier = this.advance()
        if (this.matchOperator(['='])) {
            const expr = this.parseExpression()
            return {
                type: 'AssignmentStatement',
                variable: identifier.value,
                expression: expr,
                line: identifier.line
            }
        }
        throw new Error(`Unexpected identifier: ${identifier.value}`)
    }

    parseIf() {
        const line = this.peek().line
        this.advance() // consume IF
        const condition = this.parseExpression()
        this.consume('KEYWORD', 'Expected THEN after condition', 'THEN')

        const thenBranch = []
        while (!this.check('KEYWORD', 'ELSE') && !this.check('KEYWORD', 'END IF') && !this.isAtEnd()) {
            thenBranch.push(this.parseStatement())
        }

        let elseBranch = null
        if (this.match('KEYWORD', 'ELSE')) {
            elseBranch = []
            while (!this.check('KEYWORD', 'END IF') && !this.isAtEnd()) {
                elseBranch.push(this.parseStatement())
            }
        }

        this.consume('KEYWORD', 'Expected END IF', 'END IF')

        return {
            type: 'IfStatement',
            condition,
            thenBranch,
            elseBranch,
            line
        }
    }

    parseWhile() {
        const line = this.peek().line
        this.advance() // consume WHILE
        const condition = this.parseExpression()
        this.consume('KEYWORD', 'Expected DO after condition', 'DO')

        const body = []
        while (!this.check('KEYWORD', 'END WHILE') && !this.isAtEnd()) {
            body.push(this.parseStatement())
        }

        this.consume('KEYWORD', 'Expected END WHILE', 'END WHILE')

        return {
            type: 'WhileStatement',
            condition,
            body,
            line
        }
    }

    parseFor() {
        const line = this.peek().line
        this.advance() // consume FOR
        const variable = this.consume('IDENTIFIER', 'Expected variable name').value
        this.consume('OPERATOR', 'Expected =', '=')
        const start = this.parseExpression()
        this.consume('KEYWORD', 'Expected TO', 'TO')
        const end = this.parseExpression()

        const body = []
        while (!this.check('KEYWORD', 'END FOR') && !this.isAtEnd()) {
            body.push(this.parseStatement())
        }

        this.consume('KEYWORD', 'Expected END FOR', 'END FOR')

        return {
            type: 'ForStatement',
            variable,
            start,
            end,
            body,
            line
        }
    }

    // ─── Array ──────────────────────────────────────────────────────────────────

    parseArray() {
        const line = this.peek().line
        this.advance() // consume ARRAY
        const name = this.consume('IDENTIFIER', 'Expected array name').value

        // Check for [size] syntax
        let size = null
        if (this.matchOperator(['['])) {
            size = this.parseExpression()
            this.consume('OPERATOR', 'Expected ]', ']')
        } else {
            // size might be next token
            size = this.parseExpression()
        }

        return {
            type: 'ArrayCreate',
            name,
            size,
            line
        }
    }

    // ─── Generic Data Structure Parsers ─────────────────────────────────────────

    parseCreateDS(nodeType, dsType) {
        const line = this.peek().line
        this.advance() // consume the keyword
        const name = this.consume('IDENTIFIER', `Expected ${dsType} name`).value

        return {
            type: nodeType,
            name,
            dsType,
            line
        }
    }

    parseDSOperation(nodeType, argCount) {
        const line = this.peek().line
        this.advance() // consume the keyword

        const args = []
        for (let i = 0; i < argCount; i++) {
            if (this.peek()?.type === 'IDENTIFIER' || this.peek()?.type === 'NUMBER' || this.peek()?.type === 'STRING') {
                args.push(this.advance().value)
            } else {
                args.push(this.parseExpression())
            }
        }

        return {
            type: nodeType,
            args,
            line
        }
    }

    // ─── Special Data Structure Parsers ─────────────────────────────────────────

    parseGraphCreate() {
        const line = this.peek().line
        this.advance() // consume GRAPH
        const name = this.consume('IDENTIFIER', 'Expected graph name').value
        let nodeCount = null
        if (!this.isAtEnd() && (this.peek()?.type === 'NUMBER' || this.peek()?.type === 'IDENTIFIER')) {
            nodeCount = this.advance().value
        }

        return {
            type: 'GraphCreate',
            name,
            nodeCount,
            dsType: 'graph',
            line
        }
    }

    parsePairCreate() {
        const line = this.peek().line
        this.advance() // consume PAIR
        const name = this.consume('IDENTIFIER', 'Expected pair name').value

        let first = null, second = null
        if (!this.isAtEnd() && (this.peek()?.type === 'NUMBER' || this.peek()?.type === 'IDENTIFIER')) {
            first = this.advance().value
        }
        if (!this.isAtEnd() && (this.peek()?.type === 'NUMBER' || this.peek()?.type === 'IDENTIFIER')) {
            second = this.advance().value
        }

        return {
            type: 'PairCreate',
            name,
            first,
            second,
            dsType: 'pair',
            line
        }
    }

    parseStructCreate() {
        const line = this.peek().line
        this.advance() // consume STRUCT
        const name = this.consume('IDENTIFIER', 'Expected struct name').value

        const fields = []
        while (!this.isAtEnd() && this.peek()?.type === 'IDENTIFIER') {
            fields.push(this.advance().value)
        }

        return {
            type: 'StructCreate',
            name,
            fields,
            dsType: 'struct',
            line
        }
    }

    // ─── Expression Parsers ─────────────────────────────────────────────────────

    parseExpression() {
        return this.parseComparison()
    }

    parseComparison() {
        let expr = this.parseTerm()

        while (this.matchOperator(['==', '!=', '<', '>', '<=', '>='])) {
            const operator = this.previous().value
            const right = this.parseTerm()
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            }
        }

        return expr
    }

    parseTerm() {
        let expr = this.parseFactor()

        while (this.matchOperator(['+', '-'])) {
            const operator = this.previous().value
            const right = this.parseFactor()
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            }
        }

        return expr
    }

    parseFactor() {
        let expr = this.parseUnary()

        while (this.matchOperator(['*', '/', '%'])) {
            const operator = this.previous().value
            const right = this.parseUnary()
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            }
        }

        return expr
    }

    parseUnary() {
        if (this.matchOperator(['-'])) {
            const operator = this.previous().value
            const expr = this.parseUnary()
            return {
                type: 'UnaryExpression',
                operator,
                expression: expr
            }
        }

        return this.parsePrimary()
    }

    parsePrimary() {
        if (this.match('NUMBER')) {
            return { type: 'Literal', value: parseFloat(this.previous().value) }
        }

        if (this.match('STRING')) {
            return { type: 'Literal', value: this.previous().value }
        }

        if (this.match('IDENTIFIER')) {
            const name = this.previous().value

            // Check for array access: identifier[expr]
            if (this.matchOperator(['['])) {
                const index = this.parseExpression()
                this.consume('OPERATOR', 'Expected ]', ']')
                return { type: 'ArrayAccess', name, index }
            }

            return { type: 'Identifier', name }
        }

        if (this.matchOperator(['('])) {
            const expr = this.parseExpression()
            this.consume('OPERATOR', 'Expected ) after expression', ')')
            return expr
        }

        // DS query keywords used as expressions (e.g., PRINT TOP s, SET x = SIZE myStack)
        const dsQueryKeywords = {
            'TOP': 1, 'FRONT': 1, 'SIZE': 1, 'EMPTY': 1,
            'PAIR_FIRST': 1, 'PAIR_SECOND': 1,
            'MAP_GET': 2, 'CONTAINS': 2
        }

        if (this.check('KEYWORD') && this.peek().value in dsQueryKeywords) {
            const keyword = this.advance().value
            const argCount = dsQueryKeywords[keyword]
            const args = []
            for (let i = 0; i < argCount; i++) {
                if (this.peek()?.type === 'IDENTIFIER' || this.peek()?.type === 'NUMBER' || this.peek()?.type === 'STRING') {
                    args.push(this.advance().value)
                } else {
                    args.push(this.parseExpression())
                }
            }
            return { type: 'DSQueryExpression', operation: keyword, args }
        }

        throw new Error(`Unexpected token: ${this.peek()?.value || 'EOF'}`)
    }

    // ─── Helper Methods ─────────────────────────────────────────────────────────

    match(type, value = null) {
        if (this.check(type, value)) {
            this.advance()
            return true
        }
        return false
    }

    matchOperator(operators) {
        const token = this.peek()
        if (token && token.type === 'OPERATOR' && operators.includes(token.value)) {
            this.advance()
            return true
        }
        return false
    }

    check(type, value = null) {
        if (this.isAtEnd()) return false
        const token = this.peek()
        if (value) {
            return token.type === type && token.value === value
        }
        return token.type === type
    }

    advance() {
        if (!this.isAtEnd()) this.current++
        return this.previous()
    }

    isAtEnd() {
        return this.current >= this.tokens.length
    }

    peek() {
        return this.tokens[this.current]
    }

    previous() {
        return this.tokens[this.current - 1]
    }

    consume(type, message, value = null) {
        if (this.check(type, value)) return this.advance()
        throw new Error(message)
    }

    synchronize() {
        this.advance()
        while (!this.isAtEnd()) {
            const token = this.peek()
            if (token.type === 'KEYWORD' &&
                ['INPUT', 'PRINT', 'SET', 'IF', 'WHILE', 'FOR', 'END',
                    'STACK', 'QUEUE', 'MAP', 'VECTOR', 'LINKED_LIST', 'TREE', 'GRAPH',
                    'PUSH', 'POP', 'ENQUEUE', 'DEQUEUE', 'ARRAY',
                    'SET_DS', 'PAIR', 'PRIORITY_QUEUE', 'DEQUE', 'STRUCT'].includes(token.value)) {
                return
            }
            this.advance()
        }
    }

    getCurrentLine() {
        return this.peek()?.line || this.previous()?.line || 0
    }
}
