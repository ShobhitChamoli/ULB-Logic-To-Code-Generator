/**
 * C Code Generator
 * Converts AST to C code with data structure support via arrays and structs
 */

export default class CGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
        this.variables = new Set()
        this.dsTypes = {}
        this.includes = new Set(['<stdio.h>'])
        this.structs = []
        this.dsDeclarations = []
    }

    generate() {
        if (!this.ast) return ''

        this.collectVariables(this.ast)

        this.code.push('// Generated C Code')
        for (const inc of this.includes) {
            this.code.push(`#include ${inc}`)
        }
        this.code.push('')

        // Stack/Queue/Deque struct helpers
        if (Object.values(this.dsTypes).some(t => ['stack', 'queue', 'deque', 'priority_queue'].includes(t))) {
            this.code.push('#define MAX_SIZE 1000')
            this.code.push('')
        }

        // User-defined structs
        for (const s of this.structs) {
            this.code.push(`typedef struct {`)
            for (const field of s.fields) {
                this.code.push(`    int ${field};`)
            }
            this.code.push(`} ${s.name};`)
            this.code.push('')
        }

        this.code.push('int main() {')
        this.indentLevel++

        const simpleVars = Array.from(this.variables).filter(v => !this.dsTypes[v])
        if (simpleVars.length > 0) {
            this.addLine(`int ${simpleVars.join(', ')};`)
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
            case 'ArrayCreate': this.dsTypes[node.name] = 'array'; break
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
            case 'StructCreate':
                this.dsTypes[node.name] = 'struct'
                this.structs.push({ name: node.name, fields: node.fields })
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

            case 'AssignmentStatement': {
                const expr = this.generateExpression(node.expression)
                this.addLine(`${node.variable} = ${expr};`)
                break
            }

            case 'PrintStatement': {
                const printExpr = this.generateExpression(node.expression)
                if (typeof node.expression?.value === 'string') {
                    this.addLine(`printf("%s\\n", ${printExpr});`)
                } else {
                    this.addLine(`printf("%d\\n", ${printExpr});`)
                }
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
                this.addLine(`for (${node.variable} = ${start}; ${node.variable} <= ${end}; ${node.variable}++) {`)
                this.indentLevel++
                node.body.forEach(stmt => this.generateNode(stmt))
                this.indentLevel--
                this.addLine('}')
                break
            }

            // ── Array ──
            case 'ArrayCreate': {
                const size = this.generateExpression(node.size)
                this.addLine(`int ${node.name}[${size}];`)
                break
            }
            case 'ArraySetStatement': {
                const idx = this.generateExpression(node.index)
                const val = this.generateExpression(node.expression)
                this.addLine(`${node.array}[${idx}] = ${val};`)
                break
            }

            // ── Stack (array-based) ──
            case 'StackCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_top = -1;`)
                break
            case 'StackPush':
                this.addLine(`${node.args[0]}[++${node.args[0]}_top] = ${node.args[1]};`)
                break
            case 'StackPop':
                this.addLine(`${node.args[0]}_top--;`)
                break
            case 'StackTop':
                this.addLine(`printf("%d\\n", ${node.args[0]}[${node.args[0]}_top]);`)
                break

            // ── Queue (array-based) ──
            case 'QueueCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_front = 0, ${node.name}_rear = -1;`)
                break
            case 'QueueEnqueue':
                this.addLine(`${node.args[0]}[++${node.args[0]}_rear] = ${node.args[1]};`)
                break
            case 'QueueDequeue':
                this.addLine(`${node.args[0]}_front++;`)
                break
            case 'QueueFront':
                this.addLine(`printf("%d\\n", ${node.args[0]}[${node.args[0]}_front]);`)
                break

            // ── Map (parallel arrays) ──
            case 'MapCreate':
                this.addLine(`int ${node.name}_keys[MAX_SIZE], ${node.name}_values[MAX_SIZE], ${node.name}_size = 0;`)
                break
            case 'MapInsert':
                this.addLine(`${node.args[0]}_keys[${node.args[0]}_size] = ${node.args[1]};`)
                this.addLine(`${node.args[0]}_values[${node.args[0]}_size] = ${node.args[2]};`)
                this.addLine(`${node.args[0]}_size++;`)
                break
            case 'MapGet':
                this.addLine(`// Map get: search for key ${node.args[1]} in ${node.args[0]}`)
                this.addLine(`for (int _i = 0; _i < ${node.args[0]}_size; _i++) {`)
                this.addLine(`    if (${node.args[0]}_keys[_i] == ${node.args[1]}) { printf("%d\\n", ${node.args[0]}_values[_i]); break; }`)
                this.addLine(`}`)
                break
            case 'MapRemove':
                this.addLine(`// Map remove: key ${node.args[1]} from ${node.args[0]}`)
                break

            // ── Set (array-based) ──
            case 'SetCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_size = 0;`)
                break
            case 'SetAdd':
                this.addLine(`${node.args[0]}[${node.args[0]}_size++] = ${node.args[1]};`)
                break
            case 'SetRemove':
                this.addLine(`// Set remove from ${node.args[0]}`)
                break
            case 'Contains':
                this.addLine(`// Check if ${node.args[0]} contains ${node.args[1]}`)
                break

            // ── Vector (dynamic array simulation) ──
            case 'VectorCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_size = 0;`)
                break
            case 'VectorPush':
                this.addLine(`${node.args[0]}[${node.args[0]}_size++] = ${node.args[1]};`)
                break
            case 'VectorPop':
                this.addLine(`${node.args[0]}_size--;`)
                break

            // ── Linked List (array-based) ──
            case 'LinkedListCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_size = 0;`)
                break
            case 'LLPushFront':
                this.addLine(`for (int _i = ${node.args[0]}_size; _i > 0; _i--) ${node.args[0]}[_i] = ${node.args[0]}[_i-1];`)
                this.addLine(`${node.args[0]}[0] = ${node.args[1]}; ${node.args[0]}_size++;`)
                break
            case 'LLPushBack':
                this.addLine(`${node.args[0]}[${node.args[0]}_size++] = ${node.args[1]};`)
                break
            case 'LLPopFront':
                this.addLine(`for (int _i = 0; _i < ${node.args[0]}_size - 1; _i++) ${node.args[0]}[_i] = ${node.args[0]}[_i+1];`)
                this.addLine(`${node.args[0]}_size--;`)
                break
            case 'LLPopBack':
                this.addLine(`${node.args[0]}_size--;`)
                break

            // ── Tree (array-based sorted insert) ──
            case 'TreeCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_size = 0;  // BST as sorted array`)
                break
            case 'TreeInsert':
                this.addLine(`${node.args[0]}[${node.args[0]}_size++] = ${node.args[1]};  // Insert into tree`)
                break

            // ── Graph (adjacency matrix) ──
            case 'GraphCreate': {
                const n = node.nodeCount || 100
                this.addLine(`int ${node.name}[${n}][${n}];`)
                this.addLine(`for (int _i = 0; _i < ${n}; _i++) for (int _j = 0; _j < ${n}; _j++) ${node.name}[_i][_j] = 0;`)
                break
            }
            case 'GraphAddEdge':
                this.addLine(`${node.args[0]}[${node.args[1]}][${node.args[2]}] = 1;`)
                this.addLine(`${node.args[0]}[${node.args[2]}][${node.args[1]}] = 1;  // undirected`)
                break

            // ── Pair ──
            case 'PairCreate':
                this.addLine(`int ${node.name}[2] = {${node.first || 0}, ${node.second || 0}};  // Pair`)
                break
            case 'PairFirst':
                this.addLine(`printf("%d\\n", ${node.args[0]}[0]);`)
                break
            case 'PairSecond':
                this.addLine(`printf("%d\\n", ${node.args[0]}[1]);`)
                break

            // ── Priority Queue (array-based) ──
            case 'PriorityQueueCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_size = 0;  // Priority Queue`)
                break

            // ── Deque (array-based) ──
            case 'DequeCreate':
                this.addLine(`int ${node.name}[MAX_SIZE], ${node.name}_front = MAX_SIZE/2, ${node.name}_rear = MAX_SIZE/2 - 1;`)
                break
            case 'DequePushFront':
                this.addLine(`${node.args[0]}[--${node.args[0]}_front] = ${node.args[1]};`)
                break
            case 'DequePushBack':
                this.addLine(`${node.args[0]}[++${node.args[0]}_rear] = ${node.args[1]};`)
                break
            case 'DequePopFront':
                this.addLine(`${node.args[0]}_front++;`)
                break
            case 'DequePopBack':
                this.addLine(`${node.args[0]}_rear--;`)
                break

            // ── Struct ──
            case 'StructCreate':
                this.addLine(`${node.name} obj_${node.name};`)
                break

            // ── Common ──
            case 'Size':
                this.addLine(`// Size of ${node.args[0]}`)
                break
            case 'Empty':
                this.addLine(`// Check if ${node.args[0]} is empty`)
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
                    case 'TOP': return `${a[0]}[${a[0]}_top]`
                    case 'FRONT': return `${a[0]}[${a[0]}_front]`
                    case 'SIZE': return `${a[0]}_size`
                    case 'EMPTY': return `(${a[0]}_size == 0)`
                    case 'PAIR_FIRST': return `${a[0]}[0]`
                    case 'PAIR_SECOND': return `${a[0]}[1]`
                    case 'MAP_GET': return `0 /* map get ${a[0]}[${a[1]}] */`
                    case 'CONTAINS': return `0 /* contains check */`
                    default: return `0 /* unknown DS query */`
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
