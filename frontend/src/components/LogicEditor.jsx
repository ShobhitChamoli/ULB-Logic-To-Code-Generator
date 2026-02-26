import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { FileCode, AlertCircle, Trash2 } from 'lucide-react'

const EXAMPLE_TEMPLATES = [
    {
        name: 'Simple Calculator',
        code: `START
INPUT a
INPUT b
SET sum = a + b
PRINT sum
END`
    },
    {
        name: 'Even/Odd Checker',
        code: `START
INPUT num
SET remainder = num % 2
IF remainder == 0 THEN
    PRINT "Even"
ELSE
    PRINT "Odd"
END IF
END`
    },
    {
        name: 'Factorial Calculator',
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
        name: 'Sum of N Numbers',
        code: `START
INPUT n
SET sum = 0
SET i = 1
WHILE i <= n DO
    SET sum = sum + i
    SET i = i + 1
END WHILE
PRINT sum
END`
    },
    {
        name: '📚 Stack Example',
        code: `START
STACK s
PUSH s 10
PUSH s 20
PUSH s 30
PRINT "Top of stack:"
PRINT TOP s
POP s
PRINT "After pop:"
PRINT TOP s
END`
    },
    {
        name: '🎫 Queue Example',
        code: `START
QUEUE q
ENQUEUE q 10
ENQUEUE q 20
ENQUEUE q 30
PRINT "Front of queue:"
PRINT FRONT q
DEQUEUE q
PRINT "After dequeue:"
PRINT FRONT q
END`
    },
    {
        name: '🗺️ Map Example',
        code: `START
MAP scores
MAP_INSERT scores 1 95
MAP_INSERT scores 2 87
MAP_INSERT scores 3 92
PRINT "Score for key 1:"
MAP_GET scores 1
MAP_REMOVE scores 3
END`
    },
    {
        name: '🕸️ Graph Example',
        code: `START
GRAPH g 5
GRAPH_ADD_EDGE g 0 1
GRAPH_ADD_EDGE g 1 2
GRAPH_ADD_EDGE g 2 3
GRAPH_ADD_EDGE g 3 4
PRINT "Graph created with edges"
END`
    },
    {
        name: '🗣️ Natural Language',
        code: `begin
ask for number
set remainder to number mod 2
if remainder equals 0 then
    show "Even number!"
otherwise
    show "Odd number!"
end if
finish`
    }
]

export default function LogicEditor({ code, setCode, theme, compilationData }) {
    const [selectedTemplate, setSelectedTemplate] = useState('')

    const handleTemplateChange = (e) => {
        const templateName = e.target.value
        setSelectedTemplate(templateName)
        if (templateName) {
            const template = EXAMPLE_TEMPLATES.find(t => t.name === templateName)
            if (template) {
                setCode(template.code)
            }
        }
    }

    const handleEditorChange = (value) => {
        setCode(value || '')
        // Save to localStorage
        localStorage.setItem('lastLogicCode', value || '')
    }

    const errors = compilationData?.errors || []
    const hasErrors = errors.length > 0

    return (
        <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)] transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/50 backdrop-blur-sm relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-sm">
                        <FileCode className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Logic Editor</h2>
                        <p className="text-xs text-gray-500 font-medium">Write your pseudo-code</p>
                    </div>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-3">
                    {/* Template Selector */}
                    <div className="relative group/select">
                        <select
                            value={selectedTemplate}
                            onChange={handleTemplateChange}
                            className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 shadow-sm transition-all cursor-pointer"
                        >
                            <option value="">Load Example...</option>
                            {EXAMPLE_TEMPLATES.map(template => (
                                <option key={template.name} value={template.name}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-sky-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <motion.button
                        onClick={() => handleEditorChange('')}
                        disabled={!code}
                        className="p-2 rounded-xl bg-white border border-red-100 text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow hover:bg-red-50 hover:border-red-200 text-red-600 transition-all group/clear tooltip-wrapper"
                        whileHover={{ scale: code ? 1.05 : 1 }}
                        whileTap={{ scale: code ? 0.95 : 1 }}
                        title="Clear Editor"
                    >
                        <Trash2 className="w-4 h-4 group-hover/clear:text-red-500 transition-colors" />
                    </motion.button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative z-10 w-full min-h-0">
                <Editor
                    height="100%"
                    width="100%"
                    defaultLanguage="plaintext"
                    value={code}
                    onChange={handleEditorChange}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'on',
                        padding: { top: 16, bottom: 16 },
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        renderWhitespace: 'none',
                    }}
                />
            </div>

            {/* Error Display */}
            <AnimatePresence>
                {hasErrors && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="border-t border-red-200 bg-red-50/80 backdrop-blur-sm max-h-[300px] flex flex-col overflow-hidden shadow-inner relative z-10"
                    >
                        {/* Error Header */}
                        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-red-200/50 bg-red-100/50 sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <h3 className="text-sm font-bold text-red-800">Compilation Errors</h3>
                            </div>
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                                {errors.length} {errors.length === 1 ? 'error' : 'errors'}
                            </span>
                        </div>

                        {/* Error List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {errors.map((error, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-start gap-3 p-3 bg-white rounded-xl border border-red-100 shadow-sm hover:shadow-md hover:border-red-300 transition-all group"
                                >
                                    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100 group-hover:bg-red-100 group-hover:border-red-200 transition-colors">
                                        L{error.line || '?'}
                                    </span>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-sm text-red-900 font-medium leading-relaxed break-words">
                                            {error.message}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    )
}
