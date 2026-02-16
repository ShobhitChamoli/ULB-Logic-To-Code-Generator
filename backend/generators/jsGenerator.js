/**
 * JavaScript Code Generator
 * Converts AST to JavaScript code
 */

export default class JSGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
    }

    generate() {
        if (!this.ast) return ''

        this.code.push('// Generated JavaScript Code')
        this.code.push('const readline = require("readline");')
        this.code.push('const rl = readline.createInterface({')
        this.code.push('    input: process.stdin,')
        this.code.push('    output: process.stdout')
        this.code.push('});')
        this.code.push('')
        this.code.push('async function main() {')
        this.indentLevel++

        this.generateNode(this.ast)

        this.addLine('rl.close();')
        this.indentLevel--
        this.code.push('}')
        this.code.push('')
        this.code.push('main();')

        return this.code.join('\n')
    }

    generateNode(node) {
        if (!node) return

        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => this.generateNode(stmt))
                break

            case 'InputStatement':
                this.addLine(`let ${node.variable} = await new Promise(resolve => {`)
                this.indentLevel++
                this.addLine(`rl.question("Enter ${node.variable}: ", answer => resolve(parseInt(answer)));`)
                this.indentLevel--
                this.addLine('});')
                break

            case 'AssignmentStatement':
                const expr = this.generateExpression(node.expression)
                this.addLine(`let ${node.variable} = ${expr};`)
                break

            case 'PrintStatement':
                const printExpr = this.generateExpression(node.expression)
                this.addLine(`console.log(${printExpr});`)
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
                this.addLine(`for (let ${node.variable} = ${start}; ${node.variable} <= ${end}; ${node.variable}++) {`)
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
                // Convert == to === for JavaScript
                const operator = expr.operator === '==' ? '===' : expr.operator === '!=' ? '!==' : expr.operator
                return `(${left} ${operator} ${right})`

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
