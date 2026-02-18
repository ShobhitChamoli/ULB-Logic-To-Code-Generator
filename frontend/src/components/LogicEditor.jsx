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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border-t border-red-500/30"
                >
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-400 mb-1">Compilation Errors:</p>
                            <div className="space-y-1">
                                {errors.map((error, idx) => (
                                    <p key={idx} className="text-xs text-red-300">
                                        Line {error.line}: {error.message}
                                    </p>
                                ))}
                            </div>
                        </div>
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
