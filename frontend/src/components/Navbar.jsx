import { motion } from 'framer-motion'
import { Sun, Moon, Zap, Github } from 'lucide-react'

export default function Navbar({ theme, toggleTheme, mode, toggleMode }) {
    return (
        <motion.nav
            className={`h-16 ${theme === 'dark' ? 'glass-dark' : 'glass'} border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50'} px-6 flex items-center justify-between`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3">
                <motion.div
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                >
                    <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Universal Logic Bridge
                    </h1>
                    <p className="text-xs text-gray-400">Logic to Code Generator</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {/* Mode Toggle */}
                <motion.button
                    onClick={toggleMode}
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'glass-dark' : 'glass'} text-sm font-medium transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {mode === 'rule-based' ? '🔧 Rule-Based' : '🤖 AI-Based'}
                </motion.button>

                {/* Theme Toggle */}
                <motion.button
                    onClick={toggleTheme}
                    className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'glass-dark' : 'glass'} flex items-center justify-center`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-purple-600" />
                    )}
                </motion.button>

                {/* GitHub Link */}
                <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'glass-dark' : 'glass'} flex items-center justify-center`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Github className="w-5 h-5" />
                </motion.a>
            </div>
        </motion.nav>
    )
}
