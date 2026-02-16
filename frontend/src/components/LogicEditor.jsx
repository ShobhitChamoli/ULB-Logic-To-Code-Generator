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
        <div className={`h-full rounded-xl ${theme === 'dark' ? 'glass-dark' : 'glass'} overflow-hidden flex flex-col shadow-2xl`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-semibold">Logic Editor</h2>
                </div>

                {/* Template Selector */}
                <select
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    className={`px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
            <div className="p-3 border-t border-gray-700/50 text-xs text-gray-400">
                <p className="font-medium mb-1">Supported Syntax:</p>
                <div className="flex flex-wrap gap-2">
                    <code className="px-2 py-0.5 bg-gray-800/50 rounded">START/END</code>
                    <code className="px-2 py-0.5 bg-gray-800/50 rounded">INPUT var</code>
                    <code className="px-2 py-0.5 bg-gray-800/50 rounded">SET var = expr</code>
                    <code className="px-2 py-0.5 bg-gray-800/50 rounded">PRINT var</code>
                    <code className="px-2 py-0.5 bg-gray-800/50 rounded">IF/ELSE/END IF</code>
                    <code className="px-2 py-0.5 bg-gray-800/50 rounded">WHILE/END WHILE</code>
                    <code className="px-2 py-0.5 bg-gray-800/50 rounded">FOR/END FOR</code>
                </div>
            </div>
        </div>
    )
}
