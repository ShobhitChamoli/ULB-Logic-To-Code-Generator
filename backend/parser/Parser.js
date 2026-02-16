/**
 * Syntax Analyzer (Parser)
 * Builds Abstract Syntax Tree (AST) from tokens
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
                case 'INPUT':
                    return this.parseInput()
                case 'PRINT':
                    return this.parsePrint()
                case 'SET':
                    return this.parseAssignment()
                case 'IF':
                    return this.parseIf()
                case 'WHILE':
                    return this.parseWhile()
                case 'FOR':
                    return this.parseFor()
                default:
                    throw new Error(`Unexpected keyword: ${token.value}`)
            }
        }

        throw new Error(`Unexpected token: ${token.value}`)
    }

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
        this.consume('OPERATOR', 'Expected = after variable name', '=')
        const expr = this.parseExpression()

        return {
            type: 'AssignmentStatement',
            variable: identifier.value,
            expression: expr,
            line: identifier.line
        }
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
            return { type: 'Identifier', name: this.previous().value }
        }

        if (this.matchOperator(['('])) {
            const expr = this.parseExpression()
            this.consume('OPERATOR', 'Expected ) after expression', ')')
            return expr
        }

        throw new Error(`Unexpected token: ${this.peek()?.value || 'EOF'}`)
    }

    // Helper methods
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
                ['INPUT', 'PRINT', 'SET', 'IF', 'WHILE', 'FOR', 'END'].includes(token.value)) {
                return
            }
            this.advance()
        }
    }

    getCurrentLine() {
        return this.peek()?.line || this.previous()?.line || 0
    }
}
