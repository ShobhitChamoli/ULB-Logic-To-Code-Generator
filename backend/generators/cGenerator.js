/**
 * C Code Generator
 * Converts AST to C code
 */

export default class CGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
        this.variables = new Set()
    }

    generate() {
        if (!this.ast) return ''

        // Collect all variables
        this.collectVariables(this.ast)

        // Generate code
        this.code.push('// Generated C Code')
        this.code.push('#include <stdio.h>')
        this.code.push('')
        this.code.push('int main() {')
        this.indentLevel++

        // Declare variables
        if (this.variables.size > 0) {
            this.addLine(`int ${Array.from(this.variables).join(', ')};`)
            this.code.push('')
        }

        this.generateNode(this.ast)

        this.addLine('return 0;')
        this.indentLevel--
        this.code.push('}')

        return this.code.join('\n')
    }

    collectVariables(node) {
        if (!node) return

        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => this.collectVariables(stmt))
                break
            case 'InputStatement':
            case 'AssignmentStatement':
                this.variables.add(node.variable)
                break
            case 'ForStatement':
                this.variables.add(node.variable)
                node.body.forEach(stmt => this.collectVariables(stmt))
                break
            case 'IfStatement':
                node.thenBranch.forEach(stmt => this.collectVariables(stmt))
                if (node.elseBranch) node.elseBranch.forEach(stmt => this.collectVariables(stmt))
                break
            case 'WhileStatement':
                node.body.forEach(stmt => this.collectVariables(stmt))
                break
        }
    }

    generateNode(node) {
        if (!node) return

        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => this.generateNode(stmt))
                break

            case 'InputStatement':
                this.addLine(`printf("Enter ${node.variable}: ");`)
                this.addLine(`scanf("%d", &${node.variable});`)
                break

            case 'AssignmentStatement':
                const expr = this.generateExpression(node.expression)
                this.addLine(`${node.variable} = ${expr};`)
                break

            case 'PrintStatement':
                const printExpr = this.generateExpression(node.expression)
                this.addLine(`printf("%d\\n", ${printExpr});`)
                break

            case 'IfStatement':
                const condition = this.generateExpression(node.condition)
                this.addLine(`if (${condition}) {`)
                this.indentLevel++
                node.thenBranch.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--

                if (node.elseBranch && node.elseBranch.length > 0) {
                    this.addLine('} else {')
                    this.indentLevel++
                    node.elseBranch.forEach(stmt => this.generateNode(stmt))
                    this.indentLevel--
                }
                this.addLine('}')
                break

            case 'WhileStatement':
                const whileCondition = this.generateExpression(node.condition)
                this.addLine(`while (${whileCondition}) {`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                this.addLine('}')
                break

            case 'ForStatement':
                const start = this.generateExpression(node.start)
                const end = this.generateExpression(node.end)
                this.addLine(`for (${node.variable} = ${start}; ${node.variable} <= ${end}; ${node.variable}++) {`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                this.addLine('}')
                break
        }
    }

    generateExpression(expr) {
        if (!expr) return ''

        switch (expr.type) {
            case 'Literal':
                return typeof expr.value === 'string' ? `"${expr.value}"` : expr.value.toString()

            case 'Identifier':
                return expr.name

            case 'BinaryExpression':
                const left = this.generateExpression(expr.left)
                const right = this.generateExpression(expr.right)
                return `(${left} ${expr.operator} ${right})`

            case 'UnaryExpression':
                const operand = this.generateExpression(expr.expression)
                return `${expr.operator}${operand}`

            default:
                return ''
        }
    }

    addLine(line) {
        const indent = '    '.repeat(this.indentLevel)
        this.code.push(indent + line)
    }
}
