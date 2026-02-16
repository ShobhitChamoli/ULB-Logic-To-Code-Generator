import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import LogicEditor from './components/LogicEditor'
import CodeOutput from './components/CodeOutput'
import AnalysisPanel from './components/AnalysisPanel'
import HistoryPanel from './components/HistoryPanel'

function App() {
    const [theme, setTheme] = useState('dark')
    const [mode, setMode] = useState('rule-based') // 'rule-based' or 'ai-based'
    const [logicCode, setLogicCode] = useState('')
    const [generatedCode, setGeneratedCode] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('python')
    const [compilationData, setCompilationData] = useState(null)
    const [isCompiling, setIsCompiling] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [showAnalysis, setShowAnalysis] = useState(true)

    // Apply theme to document
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    // Load saved code from localStorage
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
            <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                mode={mode}
                toggleMode={toggleMode}
            />

            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Panel - Logic Editor */}
                <motion.div
                    className="flex-1 p-4"
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
                    className="flex-1 p-4"
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

                {/* History Panel (Sidebar) */}
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
                >
                    <AnalysisPanel
                        data={compilationData}
                        theme={theme}
                        onClose={() => setShowAnalysis(false)}
                    />
                </motion.div>
            )}

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHistory(!showHistory)}
                    className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'glass-dark' : 'glass'} flex items-center justify-center shadow-lg`}
                    title="Toggle History"
                >
                    <span className="text-xl">📜</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'glass-dark' : 'glass'} flex items-center justify-center shadow-lg`}
                    title="Toggle Analysis"
                >
                    <span className="text-xl">🔍</span>
                </motion.button>
            </div>
        </div>
    )
}

export default App
