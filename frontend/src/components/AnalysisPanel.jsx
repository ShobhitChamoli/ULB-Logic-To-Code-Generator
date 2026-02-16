import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

export default function AnalysisPanel({ data, theme, onClose }) {
    const [activeTab, setActiveTab] = useState('tokens')
    const [isExpanded, setIsExpanded] = useState(true)

    const tabs = [
        { id: 'tokens', label: 'Tokens', icon: '🔤' },
        { id: 'ast', label: 'AST', icon: '🌳' },
        { id: 'symbols', label: 'Symbol Table', icon: '📋' },
    ]

    return (
        <motion.div
            className={`${theme === 'dark' ? 'glass-dark' : 'glass'} border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50'} ${isExpanded ? 'h-80' : 'h-12'} transition-all duration-300`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            {/* Header */}
            <div className="h-12 px-6 flex items-center justify-between border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold">Compilation Analysis</h3>
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${activeTab === tab.id
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-gray-700/50 rounded"
                    >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-gray-700/50 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="h-[calc(100%-3rem)] overflow-y-auto p-6">
                    {activeTab === 'tokens' && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Token Stream</h4>
                            {data.tokens && data.tokens.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {data.tokens.map((token, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                                        >
                                            <div className="text-xs text-purple-400 font-medium">{token.type}</div>
                                            <div className="text-xs text-gray-300 font-mono truncate">{token.value}</div>
                                            <div className="text-xs text-gray-500">Line {token.line}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">No tokens available</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'ast' && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Abstract Syntax Tree</h4>
                            {data.ast ? (
                                <pre className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} text-xs overflow-x-auto`}>
                                    {JSON.stringify(data.ast, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-sm text-gray-400">No AST available</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'symbols' && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Symbol Table</h4>
                            {data.symbolTable && Object.keys(data.symbolTable).length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                                            <th className="text-left py-2 px-3 text-gray-400">Variable</th>
                                            <th className="text-left py-2 px-3 text-gray-400">Type</th>
                                            <th className="text-left py-2 px-3 text-gray-400">First Used</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(data.symbolTable).map(([name, info]) => (
                                            <tr key={name} className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                                <td className="py-2 px-3 font-mono text-purple-400">{name}</td>
                                                <td className="py-2 px-3 text-gray-300">{info.type || 'any'}</td>
                                                <td className="py-2 px-3 text-gray-400">Line {info.line}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-gray-400">No symbols available</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}
