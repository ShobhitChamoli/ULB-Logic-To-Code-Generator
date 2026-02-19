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
            className={`bg-white border-t border-sky-100 text-sky-600 ${isExpanded ? 'h-80' : 'h-12'} transition-all duration-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            {/* Header */}
            <div className="h-12 px-6 flex items-center justify-between border-b border-sky-100">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-sky-700">Compilation Analysis</h3>
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${activeTab === tab.id
                                    ? 'bg-sky-100 text-sky-700 font-medium shadow-sm'
                                    : 'text-sky-400 hover:text-sky-600 hover:bg-sky-50'
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
                        className="p-1 hover:bg-sky-50 text-sky-400 hover:text-sky-600 rounded transition-colors"
                    >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-sky-50 text-sky-400 hover:text-sky-600 rounded transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="h-[calc(100%-3rem)] overflow-y-auto p-6">
                    {activeTab === 'tokens' && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-sky-400/80 mb-3">Token Stream</h4>
                            {data.tokens && data.tokens.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {data.tokens.map((token, idx) => (
                                        <div
                                            key={idx}
                                            className="p-2 rounded bg-sky-50/50 border border-sky-100 hover:border-sky-300 transition-colors"
                                        >
                                            <div className="text-xs text-blue-600 font-bold">{token.type}</div>
                                            <div className="text-xs text-sky-700 font-mono truncate">{token.value}</div>
                                            <div className="text-xs text-sky-400">Line {token.line}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-sky-400/60">No tokens available</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'ast' && (
                        <div>
                            <h4 className="text-sm font-medium text-sky-400/80 mb-3">Abstract Syntax Tree</h4>
                            {data.ast ? (
                                <pre className="p-4 rounded-lg bg-sky-50/30 text-sky-700 text-xs overflow-x-auto border border-sky-100">
                                    {JSON.stringify(data.ast, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-sm text-sky-400/60">No AST available</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'symbols' && (
                        <div>
                            <h4 className="text-sm font-medium text-sky-400/80 mb-3">Symbol Table</h4>
                            {data.symbolTable && Object.keys(data.symbolTable).length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-sky-100">
                                            <th className="text-left py-2 px-3 text-sky-400/80">Variable</th>
                                            <th className="text-left py-2 px-3 text-sky-400/80">Type</th>
                                            <th className="text-left py-2 px-3 text-sky-400/80">First Used</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(data.symbolTable).map(([name, info]) => (
                                            <tr key={name} className="border-b border-sky-50 hover:bg-sky-50/30 transition-colors">
                                                <td className="py-2 px-3 font-mono text-blue-600 font-medium">{name}</td>
                                                <td className="py-2 px-3 text-sky-700">{info.type || 'any'}</td>
                                                <td className="py-2 px-3 text-sky-400">Line {info.line}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-sky-400/60">No symbols available</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}
