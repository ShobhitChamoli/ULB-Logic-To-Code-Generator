import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { FileCode, AlertCircle } from 'lucide-react'

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
        <div className="h-full rounded-xl bg-white border border-gray-200 overflow-hidden flex flex-col shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-sky-400" />
                    <h2 className="text-lg font-semibold">Logic Editor</h2>
                </div>

                {/* Template Selector */}
                <select
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                >
                    <option value="">Load Example...</option>
                    {EXAMPLE_TEMPLATES.map(template => (
                        <option key={template.name} value={template.name}>
                            {template.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    defaultLanguage="plaintext"
                    value={code}
                    onChange={handleEditorChange}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                    }}
                />
            </div>

            {/* Error Display */}
            {hasErrors && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="border-t-2 border-red-500"
                >
                    {/* Error Header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-red-50 border-b border-red-200">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h3 className="text-base font-bold text-red-700">Compilation Errors</h3>
                        </div>
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white shadow-sm">
                            {errors.length} {errors.length === 1 ? 'error' : 'errors'}
                        </span>
                    </div>

                    {/* Error List */}
                    <div className="max-h-48 overflow-y-auto bg-red-50/50 p-4 space-y-3">
                        {errors.map((error, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200 shadow-sm"
                            >
                                <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                                    {error.line || '—'}
                                </span>
                                <div className="flex-1 min-w-0">
                                    {error.line > 0 && (
                                        <p className="text-xs font-semibold text-red-500 mb-0.5">Line {error.line}</p>
                                    )}
                                    <p className="text-sm text-red-800 font-medium leading-snug break-words">
                                        {error.message}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Syntax Guide */}
            <div className="p-3 border-t border-gray-200 text-xs text-gray-600 bg-gray-50">
                <p className="font-medium mb-1 text-gray-700">Supported Syntax:</p>
                <div className="flex flex-wrap gap-1.5">
                    <code className="px-2 py-0.5 bg-white border border-gray-300 rounded text-blue-600 font-semibold">START/END</code>
                    <code className="px-2 py-0.5 bg-white border border-gray-300 rounded text-blue-600 font-semibold">INPUT</code>
                    <code className="px-2 py-0.5 bg-white border border-gray-300 rounded text-blue-600 font-semibold">SET</code>
                    <code className="px-2 py-0.5 bg-white border border-gray-300 rounded text-blue-600 font-semibold">PRINT</code>
                    <code className="px-2 py-0.5 bg-white border border-gray-300 rounded text-blue-600 font-semibold">IF/ELSE</code>
                    <code className="px-2 py-0.5 bg-white border border-gray-300 rounded text-blue-600 font-semibold">FOR/WHILE</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">STACK</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">QUEUE</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">MAP</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">SET_DS</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">VECTOR</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">LINKED_LIST</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">TREE</code>
                    <code className="px-2 py-0.5 bg-white border border-green-300 rounded text-green-600 font-semibold">GRAPH</code>
                </div>
            </div>
        </div>
    )
}
