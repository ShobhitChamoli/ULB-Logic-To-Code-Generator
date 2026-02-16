/**
 * Python Code Generator
 * Converts AST to Python code
 */

export default class PythonGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
    }

    generate() {
        if (!this.ast) return ''

        this.generateNode(this.ast)
        return this.code.join('\n')
    }

    generateNode(node) {
        if (!node) return

        switch (node.type) {
            case 'Program':
                this.code.push('# Generated Python Code')
                this.code.push('')
                node.body.forEach(stmt => this.generateNode(stmt))
                break

            case 'InputStatement':
                this.addLine(`${node.variable} = int(input("Enter ${node.variable}: "))`)
                break

            case 'AssignmentStatement':
                const expr = this.generateExpression(node.expression)
                this.addLine(`${node.variable} = ${expr}`)
                break

            case 'PrintStatement':
                const printExpr = this.generateExpression(node.expression)
                this.addLine(`print(${printExpr})`)
                break

            case 'IfStatement':
                const condition = this.generateExpression(node.condition)
                this.addLine(`if ${condition}:`)
                this.indentLevel++
                node.thenBranch.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--

                if (node.elseBranch && node.elseBranch.length > 0) {
                    this.addLine('else:')
                    this.indentLevel++
                    node.elseBranch.forEach(stmt => this.generateNode(stmt))
                    this.indentLevel--
                }
                break

            case 'WhileStatement':
                const whileCondition = this.generateExpression(node.condition)
                this.addLine(`while ${whileCondition}:`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                break

            case 'ForStatement':
                const start = this.generateExpression(node.start)
                const end = this.generateExpression(node.end)
                this.addLine(`for ${node.variable} in range(${start}, ${end} + 1):`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
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
