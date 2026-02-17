import { X, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SyntaxGuideModal({ isOpen, onClose, theme }) {
    if (!isOpen) return null

    const syntaxSections = [
        {
            title: "Program Structure",
            items: [
                { syntax: "START", description: "Begin your program" },
                { syntax: "END", description: "End your program" },
            ]
        },
        {
            title: "Variables & I/O",
            items: [
                { syntax: "INPUT variable", description: "Read input from user", example: "INPUT age" },
                { syntax: "SET variable = expression", description: "Assign value to variable", example: "SET sum = a + b" },
                { syntax: "PRINT expression", description: "Output value", example: "PRINT result" },
            ]
        },
        {
            title: "Conditional Statements",
            items: [
                { syntax: "IF condition THEN", description: "Start conditional block" },
                { syntax: "ELSE", description: "Alternative block (optional)" },
                { syntax: "END IF", description: "End conditional block" },
            ],
            example: `IF x > 10 THEN
    PRINT "Greater"
ELSE
    PRINT "Smaller"
END IF`
        },
        {
            title: "Loops",
            items: [
                { syntax: "WHILE condition DO", description: "Start while loop" },
                { syntax: "END WHILE", description: "End while loop" },
                { syntax: "FOR var = start TO end", description: "Start for loop" },
                { syntax: "END FOR", description: "End for loop" },
            ],
            examples: [
                {
                    label: "While Loop",
                    code: `WHILE i < 10 DO
    SET i = i + 1
END WHILE`
                },
                {
                    label: "For Loop",
                    code: `FOR i = 1 TO 10
    PRINT i
END FOR`
                }
            ]
        },
        {
            title: "Operators",
            items: [
                { syntax: "+ - * / %", description: "Arithmetic operators" },
                { syntax: "== != < > <= >=", description: "Comparison operators" },
                { syntax: "( )", description: "Grouping/precedence" },
            ]
        },
        {
            title: "Complex Examples",
            examples: [
                {
                    label: "Factorial Calculator",
                    code: `START
INPUT n
SET factorial = 1
FOR i = 1 TO n
    SET factorial = factorial * i
END FOR
PRINT factorial
END`
                },
                {
                    label: "Prime Number Checker",
                    code: `START
INPUT num
SET isPrime = 1
SET i = 2
WHILE i < num DO
    SET remainder = num % i
    IF remainder == 0 THEN
        SET isPrime = 0
    END IF
    SET i = i + 1
END WHILE
IF isPrime == 1 THEN
    PRINT "Prime"
ELSE
    PRINT "Not Prime"
END IF
END`
                },
                {
                    label: "Fibonacci Sequence",
                    code: `START
INPUT n
SET a = 0
SET b = 1
SET count = 0
WHILE count < n DO
    PRINT a
    SET temp = a + b
    SET a = b
    SET b = temp
    SET count = count + 1
END WHILE
END`
                }
            ]
        }
    ]

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
                    className={`w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                        } shadow-2xl`}
                >
                    {/* Header */}
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Syntax Guide
                                </h2>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Complete reference for writing logic code
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                                } transition-colors`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
                        <div className="space-y-8">
                            {syntaxSections.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
                                        }`}>
                                        {section.title}
                                    </h3>

                                    {/* Syntax Items */}
                                    {section.items && (
                                        <div className="space-y-3 mb-4">
                                            {section.items.map((item, i) => (
                                                <div key={i} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
                                                    }`}>
                                                    <code className={`font-mono text-sm font-semibold ${theme === 'dark' ? 'text-sky-300' : 'text-blue-600'
                                                        }`}>
                                                        {item.syntax}
                                                    </code>
                                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                        {item.description}
                                                    </p>
                                                    {item.example && (
                                                        <code className={`text-xs mt-2 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Example: {item.example}
                                                        </code>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Single Example */}
                                    {section.example && (
                                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'
                                            }`}>
                                            <pre className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                                                }`}>{section.example}</pre>
                                        </div>
                                    )}

                                    {/* Multiple Examples */}
                                    {section.examples && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {section.examples.map((ex, i) => (
                                                <div key={i} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'
                                                    }`}>
                                                    <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-sky-300' : 'text-blue-600'
                                                        }`}>
                                                        {ex.label}
                                                    </p>
                                                    <pre className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                                                        }`}>{ex.code}</pre>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            💡 Tip: All keywords are case-sensitive. Use UPPERCASE for keywords.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
