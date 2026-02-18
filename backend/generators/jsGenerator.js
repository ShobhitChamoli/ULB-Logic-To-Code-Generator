/**
 * JavaScript Code Generator
 * Converts AST to JavaScript code with full data structure support
 */

export default class JSGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
        this.dsTypes = {}
        this.declaredVars = new Set()
    }

    generate() {
        if (!this.ast) return ''

        this.scanDS(this.ast)

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

    scanDS(node) {
        if (!node) return
        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => this.scanDS(stmt))
                break
            case 'StackCreate': this.dsTypes[node.name] = 'stack'; break
            case 'QueueCreate': this.dsTypes[node.name] = 'queue'; break
            case 'MapCreate': this.dsTypes[node.name] = 'map'; break
            case 'SetCreate': this.dsTypes[node.name] = 'set'; break
            case 'VectorCreate': this.dsTypes[node.name] = 'vector'; break
            case 'LinkedListCreate': this.dsTypes[node.name] = 'linked_list'; break
            case 'TreeCreate': this.dsTypes[node.name] = 'tree'; break
            case 'GraphCreate': this.dsTypes[node.name] = 'graph'; break
            case 'PairCreate': this.dsTypes[node.name] = 'pair'; break
            case 'PriorityQueueCreate': this.dsTypes[node.name] = 'priority_queue'; break
            case 'DequeCreate': this.dsTypes[node.name] = 'deque'; break
            case 'StructCreate': this.dsTypes[node.name] = 'struct'; break
            case 'IfStatement':
                node.thenBranch.forEach(stmt => this.scanDS(stmt))
                if (node.elseBranch) node.elseBranch.forEach(stmt => this.scanDS(stmt))
                break
            case 'WhileStatement':
            case 'ForStatement':
                node.body.forEach(stmt => this.scanDS(stmt))
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
                this.addLine(`let ${node.variable} = await new Promise(resolve => {`)
                this.indentLevel++
                this.addLine(`rl.question("Enter ${node.variable}: ", answer => resolve(parseInt(answer)));`)
                this.indentLevel--
                this.addLine('});')
                this.declaredVars.add(node.variable)
                break

            case 'AssignmentStatement': {
                const expr = this.generateExpression(node.expression)
                const keyword = this.declaredVars.has(node.variable) ? '' : 'let '
                this.addLine(`${keyword}${node.variable} = ${expr};`)
                this.declaredVars.add(node.variable)
                break
            }

            case 'PrintStatement': {
                const printExpr = this.generateExpression(node.expression)
                this.addLine(`console.log(${printExpr});`)
                break
            }

            case 'IfStatement': {
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
            }

            case 'WhileStatement': {
                const whileCondition = this.generateExpression(node.condition)
                this.addLine(`while (${whileCondition}) {`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                this.addLine('}')
                break
            }

            case 'ForStatement': {
                const start = this.generateExpression(node.start)
                const end = this.generateExpression(node.end)
                this.addLine(`for (let ${node.variable} = ${start}; ${node.variable} <= ${end}; ${node.variable}++) {`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                this.addLine('}')
                break
            }

            // ── Array ──
            case 'ArrayCreate': {
                const size = this.generateExpression(node.size)
                this.addLine(`let ${node.name} = new Array(${size}).fill(0);`)
                break
            }
            case 'ArraySetStatement': {
                const idx = this.generateExpression(node.index)
                const val = this.generateExpression(node.expression)
                this.addLine(`${node.array}[${idx}] = ${val};`)
                break
            }

            // ── Stack (array) ──
            case 'StackCreate':
                this.addLine(`let ${node.name} = [];  // Stack`)
                break
            case 'StackPush':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'StackPop':
                this.addLine(`${node.args[0]}.pop();`)
                break
            case 'StackTop':
                this.addLine(`console.log(${node.args[0]}[${node.args[0]}.length - 1]);`)
                break

            // ── Queue (array) ──
            case 'QueueCreate':
                this.addLine(`let ${node.name} = [];  // Queue`)
                break
            case 'QueueEnqueue':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'QueueDequeue':
                this.addLine(`${node.args[0]}.shift();`)
                break
            case 'QueueFront':
                this.addLine(`console.log(${node.args[0]}[0]);`)
                break

            // ── Map ──
            case 'MapCreate':
                this.addLine(`let ${node.name} = new Map();  // Map/Dictionary`)
                break
            case 'MapInsert':
                this.addLine(`${node.args[0]}.set(${node.args[1]}, ${node.args[2]});`)
                break
            case 'MapGet':
                this.addLine(`console.log(${node.args[0]}.get(${node.args[1]}));`)
                break
            case 'MapRemove':
                this.addLine(`${node.args[0]}.delete(${node.args[1]});`)
                break

            // ── Set ──
            case 'SetCreate':
                this.addLine(`let ${node.name} = new Set();  // Set`)
                break
            case 'SetAdd':
                this.addLine(`${node.args[0]}.add(${node.args[1]});`)
                break
            case 'SetRemove':
                this.addLine(`${node.args[0]}.delete(${node.args[1]});`)
                break
            case 'Contains':
                this.addLine(`console.log(${node.args[0]}.has(${node.args[1]}));`)
                break

            // ── Vector (array) ──
            case 'VectorCreate':
                this.addLine(`let ${node.name} = [];  // Vector`)
                break
            case 'VectorPush':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'VectorPop':
                this.addLine(`${node.args[0]}.pop();`)
                break

            // ── Linked List (array) ──
            case 'LinkedListCreate':
                this.addLine(`let ${node.name} = [];  // Linked List`)
                break
            case 'LLPushFront':
                this.addLine(`${node.args[0]}.unshift(${node.args[1]});`)
                break
            case 'LLPushBack':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'LLPopFront':
                this.addLine(`${node.args[0]}.shift();`)
                break
            case 'LLPopBack':
                this.addLine(`${node.args[0]}.pop();`)
                break

            // ── Tree (sorted array) ──
            case 'TreeCreate':
                this.addLine(`let ${node.name} = [];  // BST (sorted array)`)
                break
            case 'TreeInsert':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                this.addLine(`${node.args[0]}.sort((a, b) => a - b);`)
                break

            // ── Graph (adjacency list) ──
            case 'GraphCreate': {
                const n = node.nodeCount || 100
                this.addLine(`let ${node.name} = Array.from({length: ${n}}, () => []);  // Graph`)
                break
            }
            case 'GraphAddEdge':
                this.addLine(`${node.args[0]}[${node.args[1]}].push(${node.args[2]});`)
                this.addLine(`${node.args[0]}[${node.args[2]}].push(${node.args[1]});  // undirected`)
                break

            // ── Pair (array) ──
            case 'PairCreate':
                this.addLine(`let ${node.name} = [${node.first || 0}, ${node.second || 0}];  // Pair`)
                break
            case 'PairFirst':
                this.addLine(`console.log(${node.args[0]}[0]);`)
                break
            case 'PairSecond':
                this.addLine(`console.log(${node.args[0]}[1]);`)
                break

            // ── Priority Queue (sorted array) ──
            case 'PriorityQueueCreate':
                this.addLine(`let ${node.name} = [];  // Priority Queue (min-heap via sorted array)`)
                break

            // ── Deque (array) ──
            case 'DequeCreate':
                this.addLine(`let ${node.name} = [];  // Deque`)
                break
            case 'DequePushFront':
                this.addLine(`${node.args[0]}.unshift(${node.args[1]});`)
                break
            case 'DequePushBack':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'DequePopFront':
                this.addLine(`${node.args[0]}.shift();`)
                break
            case 'DequePopBack':
                this.addLine(`${node.args[0]}.pop();`)
                break

            // ── Struct (object) ──
            case 'StructCreate': {
                const fields = node.fields.map(f => `${f}: 0`).join(', ')
                this.addLine(`let ${node.name} = {${fields}};  // Struct`)
                break
            }

            // ── Common ──
            case 'Size':
                this.addLine(`console.log(${node.args[0]}.length || ${node.args[0]}.size);`)
                break
            case 'Empty':
                this.addLine(`console.log((${node.args[0]}.length || ${node.args[0]}.size) === 0);`)
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
            case 'ArrayAccess':
                return `${expr.name}[${this.generateExpression(expr.index)}]`
            case 'BinaryExpression': {
                const left = this.generateExpression(expr.left)
                const right = this.generateExpression(expr.right)
                const operator = expr.operator === '==' ? '===' : expr.operator === '!=' ? '!==' : expr.operator
                return `(${left} ${operator} ${right})`
            }
            case 'UnaryExpression': {
                const operand = this.generateExpression(expr.expression)
                return `${expr.operator}${operand}`
            }
            case 'DSQueryExpression': {
                const a = expr.args
                switch (expr.operation) {
                    case 'TOP': return `${a[0]}[${a[0]}.length - 1]`
                    case 'FRONT': return `${a[0]}[0]`
                    case 'SIZE': return `(${a[0]}.length || ${a[0]}.size)`
                    case 'EMPTY': return `((${a[0]}.length || ${a[0]}.size) === 0)`
                    case 'PAIR_FIRST': return `${a[0]}[0]`
                    case 'PAIR_SECOND': return `${a[0]}[1]`
                    case 'MAP_GET': return `${a[0]}.get(${a[1]})`
                    case 'CONTAINS': return `${a[0]}.has(${a[1]})`
                    default: return `undefined /* unknown DS query */`
                }
            }

            default:
                return ''
        }
    }

    addLine(line) {
        const indent = '    '.repeat(this.indentLevel)
        this.code.push(indent + line)
    }
}
