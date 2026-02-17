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
                                    Write naturally - like explaining to a friend!
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
                                    <p className="text-gray-700"><code className="bg-white px-2 py-1 rounded text-blue-600 font-semibold">START</code> - Begin your logic</p>
                                    <p className="text-gray-700"><code className="bg-white px-2 py-1 rounded text-blue-600 font-semibold">END</code> - Finish your logic</p>
                                </div>
                            </div>

                            {/* Input/Output */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                                <h3 className="text-xl font-bold mb-3 text-green-700">💬 Talk to User</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700"><code className="bg-white px-2 py-1 rounded text-green-600 font-semibold">INPUT age</code> - Ask user for age</p>
                                    <p className="text-gray-700"><code className="bg-white px-2 py-1 rounded text-green-600 font-semibold">PRINT "Hello"</code> - Show message</p>
                                    <p className="text-gray-700"><code className="bg-white px-2 py-1 rounded text-green-600 font-semibold">SET x = 10</code> - Remember a value</p>
                                </div>
                            </div>

                            {/* Decisions */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                                <h3 className="text-xl font-bold mb-3 text-purple-700">🤔 Make Decisions</h3>
                                <div className="bg-white rounded-lg p-4 border border-purple-200">
                                    <pre className="text-sm font-mono text-gray-800">{`IF age > 18 THEN
    PRINT "Adult"
ELSE
    PRINT "Minor"
END IF`}</pre>
                                </div>
                            </div>

                            {/* Loops */}
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-200">
                                <h3 className="text-xl font-bold mb-3 text-orange-700">🔁 Repeat Things</h3>
                                <div className="space-y-3">
                                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                                        <p className="text-xs font-semibold text-orange-600 mb-2">Count from 1 to 10:</p>
                                        <pre className="text-sm font-mono text-gray-800">{`FOR i = 1 TO 10
    PRINT i
END FOR`}</pre>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                                        <p className="text-xs font-semibold text-orange-600 mb-2">Keep going until condition is false:</p>
                                        <pre className="text-sm font-mono text-gray-800">{`WHILE x < 100 DO
    SET x = x + 1
END WHILE`}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* Arrays */}
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border-2 border-cyan-200">
                                <h3 className="text-xl font-bold mb-3 text-cyan-700">📦 Store Multiple Values (Arrays)</h3>
                                <div className="space-y-3">
                                    <div className="bg-white rounded-lg p-4 border border-cyan-200">
                                        <p className="text-xs font-semibold text-cyan-600 mb-2">Create a list:</p>
                                        <pre className="text-sm font-mono text-gray-800">{`ARRAY numbers[5]
SET numbers[0] = 10
SET numbers[1] = 20
PRINT numbers[0]`}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* Complete Example */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
                                    <span className="text-3xl">✨</span>
                                    Complete Example - Find Largest Number
                                </h3>
                                <div className="bg-slate-900 rounded-lg p-5 border border-indigo-300">
                                    <pre className="text-sm font-mono text-gray-100 leading-relaxed">{`START
INPUT n
ARRAY numbers[n]

FOR i = 0 TO n-1
    INPUT numbers[i]
END FOR

SET largest = numbers[0]

FOR i = 1 TO n-1
    IF numbers[i] > largest THEN
        SET largest = numbers[i]
    END IF
END FOR

PRINT "Largest number is:"
PRINT largest
END`}</pre>
                                </div>
                                <div className="mt-4 bg-white rounded-lg p-4 border border-indigo-200">
                                    <p className="text-sm text-gray-700">
                                        <strong className="text-indigo-600">What this does:</strong> Asks for how many numbers,
                                        reads them all, then finds and shows the biggest one!
                                    </p>
                                </div>
                            </div>

                            {/* Quick Reference */}
                            <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-300">
                                <h3 className="text-xl font-bold mb-3 text-gray-700">⚡ Quick Reference</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Math</p>
                                        <code className="text-xs text-gray-600">+ - * / %</code>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Compare</p>
                                        <code className="text-xs text-gray-600">== != &lt; &gt; &lt;= &gt;=</code>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Keywords</p>
                                        <code className="text-xs text-gray-600">START END IF THEN ELSE</code>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-semibold text-blue-600 mb-1">Loops</p>
                                        <code className="text-xs text-gray-600">FOR WHILE DO END FOR</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50">
                        <p className="text-sm text-center text-gray-700 font-medium">
                            💡 <strong>Remember:</strong> Write like you're explaining to a friend. Keep it simple and natural!
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
