/**
 * Python Code Generator
 * Converts AST to Python code with full data structure support
 */

export default class PythonGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
        this.imports = new Set()
        this.dsTypes = {}
    }

    generate() {
        if (!this.ast) return ''

        // Scan for imports needed
        this.scanImports(this.ast)

        this.code.push('# Generated Python Code')
        if (this.imports.size > 0) {
            for (const imp of this.imports) {
                this.code.push(imp)
            }
        }
        this.code.push('')

        this.generateNode(this.ast)
        return this.code.join('\n')
    }

    scanImports(node) {
        if (!node) return
        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => this.scanImports(stmt))
                break
            case 'QueueCreate':
            case 'DequeCreate':
            case 'LinkedListCreate':
                this.imports.add('from collections import deque')
                this.dsTypes[node.name] = node.type.replace('Create', '').toLowerCase()
                break
            case 'PriorityQueueCreate':
                this.imports.add('import heapq')
                this.dsTypes[node.name] = 'priority_queue'
                break
            case 'StackCreate':
                this.dsTypes[node.name] = 'stack'
                break
            case 'MapCreate':
                this.dsTypes[node.name] = 'map'
                break
            case 'SetCreate':
                this.dsTypes[node.name] = 'set'
                break
            case 'VectorCreate':
                this.dsTypes[node.name] = 'vector'
                break
            case 'TreeCreate':
                this.dsTypes[node.name] = 'tree'
                break
            case 'GraphCreate':
                this.dsTypes[node.name] = 'graph'
                break
            case 'PairCreate':
                this.dsTypes[node.name] = 'pair'
                break
            case 'StructCreate':
                this.dsTypes[node.name] = 'struct'
                break
            case 'IfStatement':
                node.thenBranch.forEach(stmt => this.scanImports(stmt))
                if (node.elseBranch) node.elseBranch.forEach(stmt => this.scanImports(stmt))
                break
            case 'WhileStatement':
            case 'ForStatement':
                node.body.forEach(stmt => this.scanImports(stmt))
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
                this.addLine(`${node.variable} = int(input("Enter ${node.variable}: "))`)
                break

            case 'AssignmentStatement': {
                const expr = this.generateExpression(node.expression)
                this.addLine(`${node.variable} = ${expr}`)
                break
            }

            case 'PrintStatement': {
                const printExpr = this.generateExpression(node.expression)
                this.addLine(`print(${printExpr})`)
                break
            }

            case 'IfStatement': {
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
            }

            case 'WhileStatement': {
                const whileCondition = this.generateExpression(node.condition)
                this.addLine(`while ${whileCondition}:`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                break
            }

            case 'ForStatement': {
                const start = this.generateExpression(node.start)
                const end = this.generateExpression(node.end)
                this.addLine(`for ${node.variable} in range(${start}, ${end} + 1):`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                break
            }

            // ── Array ──
            case 'ArrayCreate': {
                const size = this.generateExpression(node.size)
                this.addLine(`${node.name} = [0] * ${size}`)
                break
            }
            case 'ArraySetStatement': {
                const idx = this.generateExpression(node.index)
                const val = this.generateExpression(node.expression)
                this.addLine(`${node.array}[${idx}] = ${val}`)
                break
            }

            // ── Stack (Python list) ──
            case 'StackCreate':
                this.addLine(`${node.name} = []  # Stack`)
                break
            case 'StackPush':
                this.addLine(`${node.args[0]}.append(${node.args[1]})`)
                break
            case 'StackPop':
                this.addLine(`${node.args[0]}.pop()`)
                break
            case 'StackTop':
                this.addLine(`print(${node.args[0]}[-1])`)
                break

            // ── Queue (collections.deque) ──
            case 'QueueCreate':
                this.addLine(`${node.name} = deque()  # Queue`)
                break
            case 'QueueEnqueue':
                this.addLine(`${node.args[0]}.append(${node.args[1]})`)
                break
            case 'QueueDequeue':
                this.addLine(`${node.args[0]}.popleft()`)
                break
            case 'QueueFront':
                this.addLine(`print(${node.args[0]}[0])`)
                break

            // ── Map (dict) ──
            case 'MapCreate':
                this.addLine(`${node.name} = {}  # Map/Dictionary`)
                break
            case 'MapInsert':
                this.addLine(`${node.args[0]}[${node.args[1]}] = ${node.args[2]}`)
                break
            case 'MapGet':
                this.addLine(`print(${node.args[0]}[${node.args[1]}])`)
                break
            case 'MapRemove':
                this.addLine(`del ${node.args[0]}[${node.args[1]}]`)
                break

            // ── Set ──
            case 'SetCreate':
                this.addLine(`${node.name} = set()  # Set`)
                break
            case 'SetAdd':
                this.addLine(`${node.args[0]}.add(${node.args[1]})`)
                break
            case 'SetRemove':
                this.addLine(`${node.args[0]}.discard(${node.args[1]})`)
                break
            case 'Contains':
                this.addLine(`print(${node.args[1]} in ${node.args[0]})`)
                break

            // ── Vector (list) ──
            case 'VectorCreate':
                this.addLine(`${node.name} = []  # Vector/Dynamic Array`)
                break
            case 'VectorPush':
                this.addLine(`${node.args[0]}.append(${node.args[1]})`)
                break
            case 'VectorPop':
                this.addLine(`${node.args[0]}.pop()`)
                break

            // ── Linked List (deque) ──
            case 'LinkedListCreate':
                this.addLine(`${node.name} = deque()  # Linked List`)
                break
            case 'LLPushFront':
                this.addLine(`${node.args[0]}.appendleft(${node.args[1]})`)
                break
            case 'LLPushBack':
                this.addLine(`${node.args[0]}.append(${node.args[1]})`)
                break
            case 'LLPopFront':
                this.addLine(`${node.args[0]}.popleft()`)
                break
            case 'LLPopBack':
                this.addLine(`${node.args[0]}.pop()`)
                break

            // ── Tree (BST via sorted list) ──
            case 'TreeCreate':
                this.addLine(`${node.name} = []  # Binary Search Tree (sorted list)`)
                break
            case 'TreeInsert':
                this.addLine(`import bisect`)
                this.addLine(`bisect.insort(${node.args[0]}, ${node.args[1]})`)
                break

            // ── Graph (adjacency list) ──
            case 'GraphCreate':
                this.addLine(`${node.name} = {i: [] for i in range(${node.nodeCount || 100})}  # Graph`)
                break
            case 'GraphAddEdge':
                this.addLine(`${node.args[0]}[${node.args[1]}].append(${node.args[2]})`)
                this.addLine(`${node.args[0]}[${node.args[2]}].append(${node.args[1]})  # undirected`)
                break

            // ── Pair (tuple) ──
            case 'PairCreate':
                this.addLine(`${node.name} = (${node.first || 0}, ${node.second || 0})  # Pair`)
                break
            case 'PairFirst':
                this.addLine(`print(${node.args[0]}[0])`)
                break
            case 'PairSecond':
                this.addLine(`print(${node.args[0]}[1])`)
                break

            // ── Priority Queue (heapq) ──
            case 'PriorityQueueCreate':
                this.addLine(`${node.name} = []  # Priority Queue (min-heap)`)
                break

            // ── Deque ──
            case 'DequeCreate':
                this.addLine(`${node.name} = deque()  # Deque`)
                break
            case 'DequePushFront':
                this.addLine(`${node.args[0]}.appendleft(${node.args[1]})`)
                break
            case 'DequePushBack':
                this.addLine(`${node.args[0]}.append(${node.args[1]})`)
                break
            case 'DequePopFront':
                this.addLine(`${node.args[0]}.popleft()`)
                break
            case 'DequePopBack':
                this.addLine(`${node.args[0]}.pop()`)
                break

            // ── Struct (dict) ──
            case 'StructCreate': {
                const fields = node.fields.map(f => `"${f}": 0`).join(', ')
                this.addLine(`${node.name} = {${fields}}  # Struct`)
                break
            }

            // ── Common ──
            case 'Size':
                this.addLine(`print(len(${node.args[0]}))`)
                break
            case 'Empty':
                this.addLine(`print(len(${node.args[0]}) == 0)`)
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
                return `(${left} ${expr.operator} ${right})`
            }

            case 'UnaryExpression': {
                const operand = this.generateExpression(expr.expression)
                return `${expr.operator}${operand}`
            }

            case 'DSQueryExpression': {
                const a = expr.args
                switch (expr.operation) {
                    case 'TOP': return `${a[0]}[-1]`
                    case 'FRONT': return `${a[0]}[0]`
                    case 'SIZE': return `len(${a[0]})`
                    case 'EMPTY': return `len(${a[0]}) == 0`
                    case 'PAIR_FIRST': return `${a[0]}[0]`
                    case 'PAIR_SECOND': return `${a[0]}[1]`
                    case 'MAP_GET': return `${a[0]}[${a[1]}]`
                    case 'CONTAINS': return `${a[1]} in ${a[0]}`
                    default: return `None  # unknown DS query`
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
