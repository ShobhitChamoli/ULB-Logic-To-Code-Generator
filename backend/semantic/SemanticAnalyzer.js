/**
 * Semantic Analyzer
 * Performs semantic checks and maintains symbol table
 * Supports data structure type tracking
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
                this.declareVariable(node.variable, node.line, 'number')
                break

            case 'AssignmentStatement':
                this.declareVariable(node.variable, node.line, 'any')
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
                this.declareVariable(node.variable, node.line, 'number')
                this.analyzeExpression(node.start)
                this.analyzeExpression(node.end)
                node.body.forEach(stmt => this.analyzeNode(stmt))
                break

            // ── Array ──
            case 'ArrayCreate':
                this.declareVariable(node.name, node.line, 'array')
                break
            case 'ArraySetStatement':
                // Valid if array is declared
                break

            // ── Data Structure Creates ──
            case 'StackCreate':
                this.declareVariable(node.name, node.line, 'stack')
                break
            case 'QueueCreate':
                this.declareVariable(node.name, node.line, 'queue')
                break
            case 'MapCreate':
                this.declareVariable(node.name, node.line, 'map')
                break
            case 'SetCreate':
                this.declareVariable(node.name, node.line, 'set')
                break
            case 'VectorCreate':
                this.declareVariable(node.name, node.line, 'vector')
                break
            case 'LinkedListCreate':
                this.declareVariable(node.name, node.line, 'linked_list')
                break
            case 'TreeCreate':
                this.declareVariable(node.name, node.line, 'tree')
                break
            case 'GraphCreate':
                this.declareVariable(node.name, node.line, 'graph')
                break
            case 'PairCreate':
                this.declareVariable(node.name, node.line, 'pair')
                break
            case 'PriorityQueueCreate':
                this.declareVariable(node.name, node.line, 'priority_queue')
                break
            case 'DequeCreate':
                this.declareVariable(node.name, node.line, 'deque')
                break
            case 'StructCreate':
                this.declareVariable(node.name, node.line, 'struct')
                break

            // ── DS Operations (all use args[0] as the variable name) ──
            case 'StackPush': case 'StackPop': case 'StackTop':
            case 'QueueEnqueue': case 'QueueDequeue': case 'QueueFront':
            case 'MapInsert': case 'MapGet': case 'MapRemove':
            case 'SetAdd': case 'SetRemove': case 'Contains':
            case 'VectorPush': case 'VectorPop':
            case 'LLPushFront': case 'LLPushBack': case 'LLPopFront': case 'LLPopBack':
            case 'TreeInsert':
            case 'GraphAddEdge':
            case 'Size': case 'Empty':
            case 'PairFirst': case 'PairSecond':
            case 'DequePushFront': case 'DequePushBack':
            case 'DequePopFront': case 'DequePopBack':
                // Operations on existing data structures — no new declarations needed
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

            case 'ArrayAccess':
                if (!this.symbolTable[expr.name]) {
                    this.errors.push({
                        line: 0,
                        message: `Array '${expr.name}' used before declaration`
                    })
                }
                this.analyzeExpression(expr.index)
                break

            case 'Literal':
                // Literals are always valid
                break
        }
    }

    declareVariable(name, line, varType = 'any') {
        if (!this.symbolTable[name]) {
            this.symbolTable[name] = {
                type: varType,
                line: line,
                initialized: true
            }
        }
    }
}
