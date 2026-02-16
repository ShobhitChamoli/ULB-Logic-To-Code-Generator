/**
 * Semantic Analyzer
 * Performs semantic checks and maintains symbol table
 */

export default class SemanticAnalyzer {
    constructor(ast) {
        this.ast = ast
        this.symbolTable = {}
        this.errors = []
    }

    analyze() {
        if (!this.ast) {
            return { symbolTable: {}, errors: [{ line: 0, message: 'No AST to analyze' }] }
        }

        try {
            this.analyzeNode(this.ast)
        } catch (error) {
            this.errors.push({ line: 0, message: error.message })
        }

        return {
            symbolTable: this.symbolTable,
            errors: this.errors
        }
    }

    analyzeNode(node) {
        if (!node) return

        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => this.analyzeNode(stmt))
                break

            case 'InputStatement':
                this.declareVariable(node.variable, node.line)
                break

            case 'AssignmentStatement':
                this.declareVariable(node.variable, node.line)
                this.analyzeExpression(node.expression)
                break

            case 'PrintStatement':
                this.analyzeExpression(node.expression)
                break

            case 'IfStatement':
                this.analyzeExpression(node.condition)
                node.thenBranch.forEach(stmt => this.analyzeNode(stmt))
                if (node.elseBranch) {
                    node.elseBranch.forEach(stmt => this.analyzeNode(stmt))
                }
                break

            case 'WhileStatement':
                this.analyzeExpression(node.condition)
                node.body.forEach(stmt => this.analyzeNode(stmt))
                break

            case 'ForStatement':
                this.declareVariable(node.variable, node.line)
                this.analyzeExpression(node.start)
                this.analyzeExpression(node.end)
                node.body.forEach(stmt => this.analyzeNode(stmt))
                break
        }
    }

    analyzeExpression(expr) {
        if (!expr) return

        switch (expr.type) {
            case 'Identifier':
                if (!this.symbolTable[expr.name]) {
                    this.errors.push({
                        line: 0,
                        message: `Variable '${expr.name}' used before declaration`
                    })
                }
                break

            case 'BinaryExpression':
                this.analyzeExpression(expr.left)
                this.analyzeExpression(expr.right)
                break

            case 'UnaryExpression':
                this.analyzeExpression(expr.expression)
                break

            case 'Literal':
                // Literals are always valid
                break
        }
    }

    declareVariable(name, line) {
        if (!this.symbolTable[name]) {
            this.symbolTable[name] = {
                type: 'any',
                line: line,
                initialized: true
            }
        }
    }
}
