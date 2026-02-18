/**
 * Java Code Generator
 * Converts AST to Java code with full data structure support
 */

export default class JavaGenerator {
    constructor(ast) {
        this.ast = ast
        this.code = []
        this.indentLevel = 0
        this.variables = new Set()
        this.dsTypes = {}
        this.imports = new Set(['java.util.Scanner'])
        this.structs = []
    }

    generate() {
        if (!this.ast) return ''

        this.collectVariables(this.ast)

        this.code.push('// Generated Java Code')
        for (const imp of this.imports) {
            this.code.push(`import ${imp};`)
        }
        this.code.push('')

        // Struct classes
        for (const s of this.structs) {
            this.code.push(`class ${s.name} {`)
            for (const field of s.fields) {
                this.code.push(`    int ${field};`)
            }
            this.code.push('}')
            this.code.push('')
        }

        this.code.push('public class GeneratedCode {')
        this.indentLevel++
        this.addLine('public static void main(String[] args) {')
        this.indentLevel++
        this.addLine('Scanner scanner = new Scanner(System.in);')

        const simpleVars = Array.from(this.variables).filter(v => !this.dsTypes[v])
        if (simpleVars.length > 0) {
            this.addLine(`int ${simpleVars.join(', ')};`)
            this.code.push('')
        }

        this.generateNode(this.ast)

        this.addLine('scanner.close();')
        this.indentLevel--
        this.addLine('}')
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
            case 'StackCreate':
                this.dsTypes[node.name] = 'stack'
                this.imports.add('java.util.Stack')
                break
            case 'QueueCreate':
                this.dsTypes[node.name] = 'queue'
                this.imports.add('java.util.LinkedList')
                this.imports.add('java.util.Queue')
                break
            case 'MapCreate':
                this.dsTypes[node.name] = 'map'
                this.imports.add('java.util.HashMap')
                this.imports.add('java.util.Map')
                break
            case 'SetCreate':
                this.dsTypes[node.name] = 'set'
                this.imports.add('java.util.HashSet')
                this.imports.add('java.util.Set')
                break
            case 'VectorCreate':
                this.dsTypes[node.name] = 'vector'
                this.imports.add('java.util.ArrayList')
                this.imports.add('java.util.List')
                break
            case 'LinkedListCreate':
                this.dsTypes[node.name] = 'linked_list'
                this.imports.add('java.util.LinkedList')
                break
            case 'TreeCreate':
                this.dsTypes[node.name] = 'tree'
                this.imports.add('java.util.TreeSet')
                break
            case 'GraphCreate':
                this.dsTypes[node.name] = 'graph'
                this.imports.add('java.util.ArrayList')
                this.imports.add('java.util.List')
                break
            case 'PairCreate': this.dsTypes[node.name] = 'pair'; break
            case 'PriorityQueueCreate':
                this.dsTypes[node.name] = 'priority_queue'
                this.imports.add('java.util.PriorityQueue')
                break
            case 'DequeCreate':
                this.dsTypes[node.name] = 'deque'
                this.imports.add('java.util.ArrayDeque')
                this.imports.add('java.util.Deque')
                break
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
                this.addLine(`System.out.print("Enter ${node.variable}: ");`)
                this.addLine(`${node.variable} = scanner.nextInt();`)
                break

            case 'AssignmentStatement': {
                const expr = this.generateExpression(node.expression)
                this.addLine(`${node.variable} = ${expr};`)
                break
            }

            case 'PrintStatement': {
                const printExpr = this.generateExpression(node.expression)
                this.addLine(`System.out.println(${printExpr});`)
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
                this.addLine(`int[] ${node.name} = new int[${size}];`)
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
                this.addLine(`Stack<Integer> ${node.name} = new Stack<>();`)
                break
            case 'StackPush':
                this.addLine(`${node.args[0]}.push(${node.args[1]});`)
                break
            case 'StackPop':
                this.addLine(`${node.args[0]}.pop();`)
                break
            case 'StackTop':
                this.addLine(`System.out.println(${node.args[0]}.peek());`)
                break

            // ── Queue ──
            case 'QueueCreate':
                this.addLine(`Queue<Integer> ${node.name} = new LinkedList<>();`)
                break
            case 'QueueEnqueue':
                this.addLine(`${node.args[0]}.add(${node.args[1]});`)
                break
            case 'QueueDequeue':
                this.addLine(`${node.args[0]}.poll();`)
                break
            case 'QueueFront':
                this.addLine(`System.out.println(${node.args[0]}.peek());`)
                break

            // ── Map ──
            case 'MapCreate':
                this.addLine(`Map<Integer, Integer> ${node.name} = new HashMap<>();`)
                break
            case 'MapInsert':
                this.addLine(`${node.args[0]}.put(${node.args[1]}, ${node.args[2]});`)
                break
            case 'MapGet':
                this.addLine(`System.out.println(${node.args[0]}.get(${node.args[1]}));`)
                break
            case 'MapRemove':
                this.addLine(`${node.args[0]}.remove(${node.args[1]});`)
                break

            // ── Set ──
            case 'SetCreate':
                this.addLine(`Set<Integer> ${node.name} = new HashSet<>();`)
                break
            case 'SetAdd':
                this.addLine(`${node.args[0]}.add(${node.args[1]});`)
                break
            case 'SetRemove':
                this.addLine(`${node.args[0]}.remove(${node.args[1]});`)
                break
            case 'Contains':
                this.addLine(`System.out.println(${node.args[0]}.contains(${node.args[1]}));`)
                break

            // ── Vector (ArrayList) ──
            case 'VectorCreate':
                this.addLine(`List<Integer> ${node.name} = new ArrayList<>();`)
                break
            case 'VectorPush':
                this.addLine(`${node.args[0]}.add(${node.args[1]});`)
                break
            case 'VectorPop':
                this.addLine(`${node.args[0]}.remove(${node.args[0]}.size() - 1);`)
                break

            // ── Linked List ──
            case 'LinkedListCreate':
                this.addLine(`LinkedList<Integer> ${node.name} = new LinkedList<>();`)
                break
            case 'LLPushFront':
                this.addLine(`${node.args[0]}.addFirst(${node.args[1]});`)
                break
            case 'LLPushBack':
                this.addLine(`${node.args[0]}.addLast(${node.args[1]});`)
                break
            case 'LLPopFront':
                this.addLine(`${node.args[0]}.removeFirst();`)
                break
            case 'LLPopBack':
                this.addLine(`${node.args[0]}.removeLast();`)
                break

            // ── Tree (TreeSet) ──
            case 'TreeCreate':
                this.addLine(`TreeSet<Integer> ${node.name} = new TreeSet<>();`)
                break
            case 'TreeInsert':
                this.addLine(`${node.args[0]}.add(${node.args[1]});`)
                break

            // ── Graph (adjacency list) ──
            case 'GraphCreate': {
                const n = node.nodeCount || 100
                this.addLine(`List<List<Integer>> ${node.name} = new ArrayList<>();`)
                this.addLine(`for (int _i = 0; _i < ${n}; _i++) ${node.name}.add(new ArrayList<>());`)
                break
            }
            case 'GraphAddEdge':
                this.addLine(`${node.args[0]}.get(${node.args[1]}).add(${node.args[2]});`)
                this.addLine(`${node.args[0]}.get(${node.args[2]}).add(${node.args[1]}); // undirected`)
                break

            // ── Pair (int array) ──
            case 'PairCreate':
                this.addLine(`int[] ${node.name} = {${node.first || 0}, ${node.second || 0}}; // Pair`)
                break
            case 'PairFirst':
                this.addLine(`System.out.println(${node.args[0]}[0]);`)
                break
            case 'PairSecond':
                this.addLine(`System.out.println(${node.args[0]}[1]);`)
                break

            // ── Priority Queue ──
            case 'PriorityQueueCreate':
                this.addLine(`PriorityQueue<Integer> ${node.name} = new PriorityQueue<>();`)
                break

            // ── Deque ──
            case 'DequeCreate':
                this.addLine(`Deque<Integer> ${node.name} = new ArrayDeque<>();`)
                break
            case 'DequePushFront':
                this.addLine(`${node.args[0]}.addFirst(${node.args[1]});`)
                break
            case 'DequePushBack':
                this.addLine(`${node.args[0]}.addLast(${node.args[1]});`)
                break
            case 'DequePopFront':
                this.addLine(`${node.args[0]}.removeFirst();`)
                break
            case 'DequePopBack':
                this.addLine(`${node.args[0]}.removeLast();`)
                break

            // ── Struct ──
            case 'StructCreate':
                this.addLine(`${node.name} obj_${node.name} = new ${node.name}();`)
                break

            // ── Common ──
            case 'Size':
                this.addLine(`System.out.println(${node.args[0]}.size());`)
                break
            case 'Empty':
                this.addLine(`System.out.println(${node.args[0]}.isEmpty());`)
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
                    case 'TOP': return `${a[0]}.peek()`
                    case 'FRONT': return `${a[0]}.peek()`
                    case 'SIZE': return `${a[0]}.size()`
                    case 'EMPTY': return `${a[0]}.isEmpty()`
                    case 'PAIR_FIRST': return `${a[0]}[0]`
                    case 'PAIR_SECOND': return `${a[0]}[1]`
                    case 'MAP_GET': return `${a[0]}.get(${a[1]})`
                    case 'CONTAINS': return `${a[0]}.contains(${a[1]})`
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
