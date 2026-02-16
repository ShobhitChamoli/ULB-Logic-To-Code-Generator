import { useState } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { Play, Copy, Download, Trash2, Code2, Loader2 } from 'lucide-react'
import axios from 'axios'

const LANGUAGES = [
    { value: 'python', label: 'Python', ext: 'py' },
    { value: 'cpp', label: 'C++', ext: 'cpp' },
    { value: 'java', label: 'Java', ext: 'java' },
    { value: 'c', label: 'C', ext: 'c' },
    { value: 'javascript', label: 'JavaScript', ext: 'js' },
]

export default function CodeOutput({
    code,
    language,
    setLanguage,
    theme,
    logicCode,
    setGeneratedCode,
    setCompilationData,
    isCompiling,
    setIsCompiling,
    mode
}) {
    const [copySuccess, setCopySuccess] = useState(false)

    const handleConvert = async () => {
        if (!logicCode.trim()) {
            alert('Please enter some logic code first!')
            return
        }

        setIsCompiling(true)
        try {
            const response = await axios.post('/api/compile', {
                code: logicCode,
                language: language,
                mode: mode
            })

            if (response.data.success) {
                setGeneratedCode(response.data.generatedCode)
                setCompilationData(response.data)

                // Save to history
                const history = JSON.parse(localStorage.getItem('compilationHistory') || '[]')
                history.unshift({
                    id: Date.now(),
                    logic: logicCode,
                    code: response.data.generatedCode,
                    language: language,
                    timestamp: new Date().toISOString()
                })
                localStorage.setItem('compilationHistory', JSON.stringify(history.slice(0, 20)))
            } else {
                setCompilationData({ errors: response.data.errors || [] })
                setGeneratedCode('')
            }
        } catch (error) {
            console.error('Compilation error:', error)
            setCompilationData({
                errors: [{
                    line: 0,
                    message: error.response?.data?.message || 'Failed to connect to compiler service'
                }]
            })
            setGeneratedCode('')
        } finally {
            setIsCompiling(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
    }

    const handleDownload = () => {
        const lang = LANGUAGES.find(l => l.value === language)
        const blob = new Blob([code], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `generated_code.${lang?.ext || 'txt'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleClear = () => {
        setGeneratedCode('')
        setCompilationData(null)
    }

    return (
        <div className={`h-full rounded-xl ${theme === 'dark' ? 'glass-dark' : 'glass'} overflow-hidden flex flex-col shadow-2xl`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-semibold">Generated Code</h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Selector */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>

                    {/* Convert Button */}
                    <motion.button
                        onClick={handleConvert}
                        disabled={isCompiling}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: isCompiling ? 1 : 1.05 }}
                        whileTap={{ scale: isCompiling ? 1 : 0.95 }}
                    >
                        {isCompiling ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Converting...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Convert
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="p-3 border-t border-gray-700/50 flex items-center justify-end gap-2">
                <motion.button
                    onClick={handleCopy}
                    disabled={!code}
                    className={`px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: code ? 1.05 : 1 }}
                    whileTap={{ scale: code ? 0.95 : 1 }}
                >
                    <Copy className="w-4 h-4" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                </motion.button>

                <motion.button
                    onClick={handleDownload}
                    disabled={!code}
                    className={`px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: code ? 1.05 : 1 }}
                    whileTap={{ scale: code ? 0.95 : 1 }}
                >
                    <Download className="w-4 h-4" />
                    Download
                </motion.button>

                <motion.button
                    onClick={handleClear}
                    disabled={!code}
                    className={`px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-red-400`}
                    whileHover={{ scale: code ? 1.05 : 1 }}
                    whileTap={{ scale: code ? 0.95 : 1 }}
                >
                    <Trash2 className="w-4 h-4" />
                    Clear
                </motion.button>
            </div>
        </div>
    )
}
