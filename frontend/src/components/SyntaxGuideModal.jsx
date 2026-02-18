import { X, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SyntaxGuideModal({ isOpen, onClose, theme }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-sky-50 to-blue-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    How to Write Logic
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Write naturally — case-insensitive with 13+ data structures!
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                        <div className="space-y-6">
                            {/* Basic Structure */}
                            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-5 border-2 border-blue-200">
                                <h3 className="text-xl font-bold mb-3 text-blue-700">📝 Basic Structure</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700"><code className="bg-white px-2 py-1 rounded text-blue-600 font-semibold">START</code> or <code className="bg-white px-2 py-1 rounded text-blue-600 font-semibold">begin</code> - Begin your logic</p>
                                    <p className="text-gray-700"><code className="bg-white px-2 py-1 rounded text-blue-600 font-semibold">END</code> or <code className="bg-white px-2 py-1 rounded text-blue-600 font-semibold">finish</code> - Finish your logic</p>
                                    <p className="text-xs text-gray-500 mt-2">💡 All keywords are case-insensitive!</p>
                                </div>
                            </div>

                            {/* Input/Output */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                                <h3 className="text-xl font-bold mb-3 text-green-700">💬 Talk to User</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="bg-white p-3 rounded-lg border border-green-200">
                                        <p className="font-semibold text-green-600 mb-1">Ask for input:</p>
                                        <code className="text-xs text-gray-600">INPUT age</code> or
                                        <code className="text-xs text-blue-600 ml-2">ask for age</code> or
                                        <code className="text-xs text-blue-600 ml-2">get age</code>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-green-200">
                                        <p className="font-semibold text-green-600 mb-1">Show output:</p>
                                        <code className="text-xs text-gray-600">PRINT "Hello"</code> or
                                        <code className="text-xs text-blue-600 ml-2">show "Hello"</code> or
                                        <code className="text-xs text-blue-600 ml-2">display "Hello"</code>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-green-200">
                                        <p className="font-semibold text-green-600 mb-1">Save a value:</p>
                                        <code className="text-xs text-gray-600">SET x = 10</code> or
                                        <code className="text-xs text-blue-600 ml-2">set x to 10</code> or
                                        <code className="text-xs text-blue-600 ml-2">make x equal to 10</code>
                                    </div>
                                </div>
                            </div>

                            {/* Decisions */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                                <h3 className="text-xl font-bold mb-3 text-purple-700">🤔 Make Decisions</h3>
                                <div className="bg-white rounded-lg p-4 border border-purple-200 mb-3">
                                    <p className="text-xs font-semibold text-purple-600 mb-2">You can write:</p>
                                    <pre className="text-sm font-mono text-gray-800">{`IF age > 18 THEN
    PRINT "Adult"
ELSE
    PRINT "Minor"
END IF`}</pre>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                                    <p className="text-xs font-semibold text-blue-700 mb-2">Or write naturally:</p>
                                    <pre className="text-sm font-mono text-blue-800">{`if age is greater than 18 then
    show "Adult"
otherwise
    show "Minor"
end if`}</pre>
                                </div>
                            </div>

                            {/* Loops */}
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-200">
                                <h3 className="text-xl font-bold mb-3 text-orange-700">🔁 Repeat Things</h3>
                                <div className="space-y-3">
                                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                                        <p className="text-xs font-semibold text-orange-600 mb-2">Count from 1 to 10:</p>
                                        <pre className="text-sm font-mono text-gray-800 mb-2">{`FOR i = 1 TO 10
    PRINT i
END FOR`}</pre>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                                        <p className="text-xs font-semibold text-orange-600 mb-2">While loop:</p>
                                        <pre className="text-sm font-mono text-gray-800">{`WHILE x < 100 DO
    SET x = x + 1
END WHILE`}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* ── Data Structures Section ── */}
                            <div className="border-t-4 border-indigo-400 pt-4">
                                <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                                    <span className="text-3xl">🏗️</span> Data Structures
                                </h2>
                            </div>

                            {/* Stack */}
                            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-5 border-2 border-red-200">
                                <h3 className="text-xl font-bold mb-3 text-red-700">📚 Stack (LIFO)</h3>
                                <div className="bg-white rounded-lg p-4 border border-red-200">
                                    <pre className="text-sm font-mono text-gray-800">{`STACK s
PUSH s 10
PUSH s 20
PRINT TOP s
POP s`}</pre>
                                    <p className="text-xs text-blue-600 mt-2">Natural: <code>create stack s</code> · <code>push 10 onto s</code> · <code>pop from s</code></p>
                                </div>
                            </div>

                            {/* Queue */}
                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-teal-200">
                                <h3 className="text-xl font-bold mb-3 text-teal-700">🎫 Queue (FIFO)</h3>
                                <div className="bg-white rounded-lg p-4 border border-teal-200">
                                    <pre className="text-sm font-mono text-gray-800">{`QUEUE q
ENQUEUE q 10
ENQUEUE q 20
PRINT FRONT q
DEQUEUE q`}</pre>
                                    <p className="text-xs text-blue-600 mt-2">Natural: <code>create queue q</code> · <code>add 10 to queue q</code> · <code>dequeue from q</code></p>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border-2 border-amber-200">
                                <h3 className="text-xl font-bold mb-3 text-amber-700">🗺️ Map / Dictionary</h3>
                                <div className="bg-white rounded-lg p-4 border border-amber-200">
                                    <pre className="text-sm font-mono text-gray-800">{`MAP scores
MAP_INSERT scores 1 95
MAP_INSERT scores 2 87
MAP_GET scores 1
MAP_REMOVE scores 2`}</pre>
                                    <p className="text-xs text-blue-600 mt-2">Natural: <code>create dictionary scores</code> · <code>put 1 95 in scores</code></p>
                                </div>
                            </div>

                            {/* Set */}
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-200">
                                <h3 className="text-xl font-bold mb-3 text-emerald-700">🔵 Set</h3>
                                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                                    <pre className="text-sm font-mono text-gray-800">{`SET_DS unique
SET_ADD unique 10
SET_ADD unique 20
CONTAINS unique 10
SET_REMOVE unique 20`}</pre>
                                    <p className="text-xs text-blue-600 mt-2">Natural: <code>create set unique</code> · <code>add 10 to set unique</code></p>
                                </div>
                            </div>

                            {/* Vector & Linked List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border-2 border-violet-200">
                                    <h3 className="text-lg font-bold mb-3 text-violet-700">📊 Vector</h3>
                                    <div className="bg-white rounded-lg p-3 border border-violet-200 text-sm">
                                        <pre className="font-mono text-gray-800">{`VECTOR v
VECTOR_PUSH v 10
VECTOR_POP v`}</pre>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-5 border-2 border-sky-200">
                                    <h3 className="text-lg font-bold mb-3 text-sky-700">🔗 Linked List</h3>
                                    <div className="bg-white rounded-lg p-3 border border-sky-200 text-sm">
                                        <pre className="font-mono text-gray-800">{`LINKED_LIST ll
LL_PUSH_BACK ll 5
LL_PUSH_FRONT ll 3`}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* Tree & Graph */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-xl p-5 border-2 border-lime-200">
                                    <h3 className="text-lg font-bold mb-3 text-lime-700">🌳 Tree (BST)</h3>
                                    <div className="bg-white rounded-lg p-3 border border-lime-200 text-sm">
                                        <pre className="font-mono text-gray-800">{`TREE t
TREE_INSERT t 15
TREE_INSERT t 10
TREE_INSERT t 20`}</pre>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border-2 border-pink-200">
                                    <h3 className="text-lg font-bold mb-3 text-pink-700">🕸️ Graph</h3>
                                    <div className="bg-white rounded-lg p-3 border border-pink-200 text-sm">
                                        <pre className="font-mono text-gray-800">{`GRAPH g 5
GRAPH_ADD_EDGE g 0 1
GRAPH_ADD_EDGE g 1 2`}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* Pair, PQ, Deque */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-xl p-4 border-2 border-fuchsia-200">
                                    <h3 className="text-base font-bold mb-2 text-fuchsia-700">👥 Pair</h3>
                                    <div className="bg-white rounded-lg p-3 border border-fuchsia-200 text-xs">
                                        <pre className="font-mono text-gray-800">{`PAIR p 3 7
PAIR_FIRST p
PAIR_SECOND p`}</pre>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-200">
                                    <h3 className="text-base font-bold mb-2 text-yellow-700">⬆️ Priority Queue</h3>
                                    <div className="bg-white rounded-lg p-3 border border-yellow-200 text-xs">
                                        <pre className="font-mono text-gray-800">{`PRIORITY_QUEUE pq
PUSH pq 5
PUSH pq 1`}</pre>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border-2 border-indigo-200">
                                    <h3 className="text-base font-bold mb-2 text-indigo-700">↔️ Deque</h3>
                                    <div className="bg-white rounded-lg p-3 border border-indigo-200 text-xs">
                                        <pre className="font-mono text-gray-800">{`DEQUE d
DEQUE_PUSH_FRONT d 1
DEQUE_PUSH_BACK d 2`}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* Common Operations */}
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border-2 border-gray-300">
                                <h3 className="text-xl font-bold mb-3 text-gray-700">🔧 Common Operations</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Size / Length</p>
                                        <code className="text-xs text-gray-600">SIZE myStack</code>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Check Empty</p>
                                        <code className="text-xs text-gray-600">EMPTY myStack</code>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Math</p>
                                        <code className="text-xs text-gray-600">+ - * / %</code>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Compare</p>
                                        <code className="text-xs text-gray-600">== != &lt; &gt; &lt;= &gt;=</code>
                                    </div>
                                </div>
                            </div>

                            {/* Complete Example */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
                                    <span className="text-3xl">✨</span>
                                    Complete Example — Stack Operations
                                </h3>
                                <div className="bg-slate-900 rounded-lg p-5 border border-indigo-300">
                                    <pre className="text-sm font-mono text-gray-100 leading-relaxed">{`START
STACK s
PUSH s 10
PUSH s 20
PUSH s 30
PRINT "Top of stack:"
PRINT TOP s
POP s
PRINT "After pop, top is:"
PRINT TOP s
PRINT SIZE s
END`}</pre>
                                </div>
                                <div className="mt-4 bg-white rounded-lg p-4 border border-indigo-200">
                                    <p className="text-sm text-gray-700">
                                        <strong className="text-indigo-600">What this does:</strong> Creates a stack, pushes 10, 20, 30,
                                        shows the top (30), pops it, then shows the new top (20) and the remaining size (2)!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50">
                        <p className="text-sm text-center text-gray-700 font-medium">
                            💡 <strong>Remember:</strong> All keywords are case-insensitive. Write naturally — the preprocessor handles the rest!
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
