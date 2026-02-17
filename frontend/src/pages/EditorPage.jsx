import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, Moon, Sun } from 'lucide-react'
import LogicEditor from '../components/LogicEditor'
import CodeOutput from '../components/CodeOutput'
import AnalysisPanel from '../components/AnalysisPanel'
import HistoryPanel from '../components/HistoryPanel'

function EditorPage() {
    const navigate = useNavigate()
    const [theme, setTheme] = useState('dark')
    const [mode, setMode] = useState('rule-based')
    const [logicCode, setLogicCode] = useState('')
    const [generatedCode, setGeneratedCode] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('python')
    const [compilationData, setCompilationData] = useState(null)
    const [isCompiling, setIsCompiling] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [showAnalysis, setShowAnalysis] = useState(true)

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    useEffect(() => {
        const saved = localStorage.getItem('lastLogicCode')
        if (saved) {
            setLogicCode(saved)
        }
    }, [])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    const toggleMode = () => {
        setMode(prev => prev === 'rule-based' ? 'ai-based' : 'rule-based')
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'gradient-bg-light'} transition-colors duration-300`}>
            {/* Enhanced Navbar */}
            <nav className={`${theme === 'dark' ? 'glass-dark' : 'glass'} sticky top-0 z-50 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="max-w-full px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Home */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all duration-300 group`}
                            >
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Home</span>
                            </button>
                            <div className="h-6 w-px bg-white/20"></div>
                            <h1 className="text-xl font-bold gradient-text">Universal Logic Bridge</h1>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* Mode Toggle */}
                            <button
                                onClick={toggleMode}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${mode === 'rule-based'
                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                                        : theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'
                                    }`}
                            >
                                {mode === 'rule-based' ? '🔧 Rule-Based' : '🤖 AI-Based'}
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all duration-300`}
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Editor Area */}
            <div className="flex h-[calc(100vh-73px)]">
                {/* Left Panel - Logic Editor */}
                <motion.div
                    className="flex-1 p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <LogicEditor
                        code={logicCode}
                        setCode={setLogicCode}
                        theme={theme}
                        compilationData={compilationData}
                    />
                </motion.div>

                {/* Right Panel - Code Output */}
                <motion.div
                    className="flex-1 p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <CodeOutput
                        code={generatedCode}
                        language={selectedLanguage}
                        setLanguage={setSelectedLanguage}
                        theme={theme}
                        logicCode={logicCode}
                        setGeneratedCode={setGeneratedCode}
                        setCompilationData={setCompilationData}
                        isCompiling={isCompiling}
                        setIsCompiling={setIsCompiling}
                        mode={mode}
                    />
                </motion.div>

                {/* History Panel */}
                {showHistory && (
                    <HistoryPanel
                        theme={theme}
                        onClose={() => setShowHistory(false)}
                        onSelect={(item) => {
                            setLogicCode(item.logic)
                            setGeneratedCode(item.code)
                            setSelectedLanguage(item.language)
                        }}
                    />
                )}
            </div>

            {/* Bottom Analysis Panel */}
            {showAnalysis && compilationData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-40"
                >
                    <AnalysisPanel
                        data={compilationData}
                        theme={theme}
                        onClose={() => setShowAnalysis(false)}
                    />
                </motion.div>
            )}

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHistory(!showHistory)}
                    className={`w-14 h-14 rounded-2xl ${theme === 'dark' ? 'glass-dark' : 'glass'} flex items-center justify-center shadow-xl hover:shadow-purple-500/50 transition-all duration-300`}
                    title="Toggle History"
                >
                    <span className="text-2xl">📜</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className={`w-14 h-14 rounded-2xl ${theme === 'dark' ? 'glass-dark' : 'glass'} flex items-center justify-center shadow-xl hover:shadow-purple-500/50 transition-all duration-300`}
                    title="Toggle Analysis"
                >
                    <span className="text-2xl">🔍</span>
                </motion.button>
            </div>
        </div>
    )
}

export default EditorPage
