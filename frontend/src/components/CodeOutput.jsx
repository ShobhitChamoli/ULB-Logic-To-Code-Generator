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
        <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)] transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/50 backdrop-blur-sm relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg shadow-sm">
                        <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Generated Code</h2>
                        <p className="text-xs text-gray-500 font-medium">Auto-compiled from logic</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Selector */}
                    <div className="relative group/select">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 shadow-sm transition-all cursor-pointer"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-sky-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    {/* Convert Button */}
                    <motion.button
                        onClick={handleConvert}
                        disabled={isCompiling}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-sky-500/30 transition-all border border-transparent hover:border-white/20 relative overflow-hidden group/btn"
                        whileHover={{ scale: isCompiling ? 1 : 1.02 }}
                        whileTap={{ scale: isCompiling ? 1 : 0.98 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full duration-1000 transition-transform" />
                        {isCompiling ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Converting...</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                <span>Convert Code</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative z-10 w-full">
                <Editor
                    height="100%"
                    width="100%"
                    language={language}
                    value={code || '// Click "Convert Code" to generate your program here...'}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        renderWhitespace: 'none',
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="p-3 border-t border-gray-200/50 flex items-center justify-end gap-3 bg-white/50 backdrop-blur-sm relative z-10">
                <motion.button
                    onClick={handleCopy}
                    disabled={!code}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow hover:border-gray-300 text-gray-700 transition-all"
                    whileHover={{ scale: code ? 1.02 : 1 }}
                    whileTap={{ scale: code ? 0.98 : 1 }}
                >
                    <Copy className={`w-4 h-4 ${copySuccess ? 'text-green-500' : 'text-gray-500'}`} />
                    <span className={copySuccess ? 'text-green-600' : ''}>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </motion.button>

                <motion.button
                    onClick={handleDownload}
                    disabled={!code}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow hover:border-gray-300 text-gray-700 transition-all"
                    whileHover={{ scale: code ? 1.02 : 1 }}
                    whileTap={{ scale: code ? 0.98 : 1 }}
                >
                    <Download className="w-4 h-4 text-sky-500" />
                    <span>Download</span>
                </motion.button>

                <div className="w-px h-6 bg-gray-200 mx-1"></div>

                <motion.button
                    onClick={handleClear}
                    disabled={!code}
                    className="px-4 py-2 rounded-xl bg-white border border-red-100 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow hover:bg-red-50 hover:border-red-200 text-red-600 transition-all group/clear"
                    whileHover={{ scale: code ? 1.02 : 1 }}
                    whileTap={{ scale: code ? 0.98 : 1 }}
                >
                    <Trash2 className="w-4 h-4 group-hover/clear:text-red-500 transition-colors" />
                    <span>Clear</span>
                </motion.button>
            </div>
        </div>
    )
}
