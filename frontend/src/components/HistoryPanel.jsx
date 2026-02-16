import { motion } from 'framer-motion'
import { X, Clock } from 'lucide-react'

export default function HistoryPanel({ theme, onClose, onSelect }) {
    const history = JSON.parse(localStorage.getItem('compilationHistory') || '[]')

    const formatDate = (isoString) => {
        const date = new Date(isoString)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const clearHistory = () => {
        if (confirm('Clear all history?')) {
            localStorage.setItem('compilationHistory', '[]')
            window.location.reload()
        }
    }

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className={`w-80 ${theme === 'dark' ? 'glass-dark' : 'glass'} border-l ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50'} flex flex-col`}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-semibold">History</h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-700/50 rounded">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center mt-8">No history yet</p>
                ) : (
                    history.map((item) => (
                        <motion.div
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} cursor-pointer hover:border-purple-500 transition-colors`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-purple-400">{item.language}</span>
                                <span className="text-xs text-gray-400">{formatDate(item.timestamp)}</span>
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-3 font-mono">
                                {item.logic.substring(0, 100)}...
                            </p>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Clear Button */}
            {history.length > 0 && (
                <div className="p-4 border-t border-gray-700/50">
                    <button
                        onClick={clearHistory}
                        className="w-full px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                    >
                        Clear All History
                    </button>
                </div>
            )}
        </motion.div>
    )
}
