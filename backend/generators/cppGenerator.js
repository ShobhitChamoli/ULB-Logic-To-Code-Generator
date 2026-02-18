/**
 * C++ Code Generator
 * Converts AST to C++ code with full data structure support using STL
 */

export default class CppGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
        this.variables = new Set()
        this.dsTypes = {}      // variable name → data structure type
        this.includes = new Set(['<iostream>'])
        this.structs = []
    }

    generate() {
        if (!this.ast) return ''

        // Collect all variables and determine includes
        this.collectVariables(this.ast)

        // Generate code
        this.code.push('// Generated C++ Code')
        for (const inc of this.includes) {
            this.code.push(`#include ${inc}`)
        }
        this.code.push('using namespace std;')
        this.code.push('')

        // Generate struct definitions if any
        for (const s of this.structs) {
            this.code.push(`struct ${s.name} {`)
            for (const field of s.fields) {
                this.code.push(`    int ${field};`)
            }
            this.code.push('};')
            this.code.push('')
        }

        this.code.push('int main() {')
        this.indentLevel++

        // Declare simple variables
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
            case 'ArrayCreate':
                this.dsTypes[node.name] = 'array'
                break
            case 'StackCreate':
                this.dsTypes[node.name] = 'stack'
                this.includes.add('<stack>')
                break
            case 'QueueCreate':
                this.dsTypes[node.name] = 'queue'
                this.includes.add('<queue>')
                break
            case 'MapCreate':
                this.dsTypes[node.name] = 'map'
                this.includes.add('<map>')
                break
            case 'SetCreate':
                this.dsTypes[node.name] = 'set'
                this.includes.add('<set>')
                break
            case 'VectorCreate':
                this.dsTypes[node.name] = 'vector'
                this.includes.add('<vector>')
                break
            case 'LinkedListCreate':
                this.dsTypes[node.name] = 'linked_list'
                this.includes.add('<list>')
                break
            case 'TreeCreate':
                this.dsTypes[node.name] = 'tree'
                this.includes.add('<set>')
                break
            case 'GraphCreate':
                this.dsTypes[node.name] = 'graph'
                this.includes.add('<vector>')
                break
            case 'PairCreate':
                this.dsTypes[node.name] = 'pair'
                this.includes.add('<utility>')
                break
            case 'PriorityQueueCreate':
                this.dsTypes[node.name] = 'priority_queue'
                this.includes.add('<queue>')
                break
            case 'DequeCreate':
                this.dsTypes[node.name] = 'deque'
                this.includes.add('<deque>')
                break
            case 'StructCreate':
                this.dsTypes[node.name] = 'struct'
                this.structs.push({ name: node.name, fields: node.fields })
                break
            case 'ArraySetStatement':
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
                this.addLine(`cout << "Enter ${node.variable}: ";`)
                this.addLine(`cin >> ${node.variable};`)
                break

            case 'AssignmentStatement': {
                const expr = this.generateExpression(node.expression)
                this.addLine(`${node.variable} = ${expr};`)
                break
            }

            case 'PrintStatement': {
                const printExpr = this.generateExpression(node.expression)
                this.addLine(`cout << ${printExpr} << endl;`)
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

            // ── Stack ──
            case 'StackCreate':
                this.addLine(`stack<int> ${node.name};`)
                break
            case 'StackPush':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'StackPop':
                this.addLine(`${node.args[0]}.pop();`)
                break
            case 'StackTop':
                this.addLine(`cout << ${node.args[0]}.top() << endl;`)
                break

            // ── Queue ──
            case 'QueueCreate':
                this.addLine(`queue<int> ${node.name};`)
                break
            case 'QueueEnqueue':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'QueueDequeue':
                this.addLine(`${node.args[0]}.pop();`)
                break
            case 'QueueFront':
                this.addLine(`cout << ${node.args[0]}.front() << endl;`)
                break

            // ── Map ──
            case 'MapCreate':
                this.addLine(`map<int, int> ${node.name};`)
                break
            case 'MapInsert':
                this.addLine(`${node.args[0]}[${node.args[1]}] = ${node.args[2]};`)
                break
            case 'MapGet':
                this.addLine(`cout << ${node.args[0]}[${node.args[1]}] << endl;`)
                break
            case 'MapRemove':
                this.addLine(`${node.args[0]}.erase(${node.args[1]});`)
                break

            // ── Set ──
            case 'SetCreate':
                this.addLine(`set<int> ${node.name};`)
                break
            case 'SetAdd':
                this.addLine(`${node.args[0]}.insert(${node.args[1]});`)
                break
            case 'SetRemove':
                this.addLine(`${node.args[0]}.erase(${node.args[1]});`)
                break
            case 'Contains':
                this.addLine(`cout << (${node.args[0]}.count(${node.args[1]}) ? "true" : "false") << endl;`)
                break

            // ── Vector ──
            case 'VectorCreate':
                this.addLine(`vector<int> ${node.name};`)
                break
            case 'VectorPush':
                this.addLine(`${node.args[0]}.push_back(${node.args[1]});`)
                break
            case 'VectorPop':
                this.addLine(`${node.args[0]}.pop_back();`)
                break

            // ── Linked List ──
            case 'LinkedListCreate':
                this.addLine(`list<int> ${node.name};`)
                break
            case 'LLPushFront':
                this.addLine(`${node.args[0]}.push_front(${node.args[1]});`)
                break
            case 'LLPushBack':
                this.addLine(`${node.args[0]}.push_back(${node.args[1]});`)
                break
            case 'LLPopFront':
                this.addLine(`${node.args[0]}.pop_front();`)
                break
            case 'LLPopBack':
                this.addLine(`${node.args[0]}.pop_back();`)
                break

            // ── Tree (BST via set) ──
            case 'TreeCreate':
                this.addLine(`set<int> ${node.name};  // BST using ordered set`)
                break
            case 'TreeInsert':
                this.addLine(`${node.args[0]}.insert(${node.args[1]});`)
                break

            // ── Graph (adjacency list) ──
            case 'GraphCreate':
                this.addLine(`vector<vector<int>> ${node.name}(${node.nodeCount || 100});`)
                break
            case 'GraphAddEdge':
                this.addLine(`${node.args[0]}[${node.args[1]}].push_back(${node.args[2]});`)
                this.addLine(`${node.args[0]}[${node.args[2]}].push_back(${node.args[1]});  // undirected`)
                break

            // ── Pair ──
            case 'PairCreate':
                this.addLine(`pair<int, int> ${node.name} = make_pair(${node.first || 0}, ${node.second || 0});`)
                break
            case 'PairFirst':
                this.addLine(`cout << ${node.args[0]}.first << endl;`)
                break
            case 'PairSecond':
                this.addLine(`cout << ${node.args[0]}.second << endl;`)
                break

            // ── Priority Queue ──
            case 'PriorityQueueCreate':
                this.addLine(`priority_queue<int> ${node.name};`)
                break

            // ── Deque ──
            case 'DequeCreate':
                this.addLine(`deque<int> ${node.name};`)
                break
            case 'DequePushFront':
                this.addLine(`${node.args[0]}.push_front(${node.args[1]});`)
                break
            case 'DequePushBack':
                this.addLine(`${node.args[0]}.push_back(${node.args[1]});`)
                break
            case 'DequePopFront':
                this.addLine(`${node.args[0]}.pop_front();`)
                break
            case 'DequePopBack':
                this.addLine(`${node.args[0]}.pop_back();`)
                break

            // ── Struct ──
            case 'StructCreate':
                // Already generated at top level
                break

            // ── Common ──
            case 'Size':
                this.addLine(`cout << ${node.args[0]}.size() << endl;`)
                break
            case 'Empty':
                this.addLine(`cout << (${node.args[0]}.empty() ? "true" : "false") << endl;`)
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
                    case 'TOP': return `${a[0]}.top()`
                    case 'FRONT': return `${a[0]}.front()`
                    case 'SIZE': return `(int)${a[0]}.size()`
                    case 'EMPTY': return `${a[0]}.empty()`
                    case 'PAIR_FIRST': return `${a[0]}.first`
                    case 'PAIR_SECOND': return `${a[0]}.second`
                    case 'MAP_GET': return `${a[0]}[${a[1]}]`
                    case 'CONTAINS': return `(${a[0]}.count(${a[1]}) > 0)`
                    default: return `/* unknown DS query */`
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
