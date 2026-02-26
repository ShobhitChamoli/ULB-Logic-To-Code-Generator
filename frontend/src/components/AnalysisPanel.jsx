import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown, ChevronUp, Download } from 'lucide-react'

export default function AnalysisPanel({ data, theme, onClose }) {
    const [activeTab, setActiveTab] = useState('tokens')
    const [isExpanded, setIsExpanded] = useState(true)

    const tabs = [
        { id: 'tokens', label: 'Tokens', icon: '🔤' },
        { id: 'ast', label: 'AST', icon: '🌳' },
        { id: 'symbols', label: 'Symbol Table', icon: '📋' },
        { id: 'complexity', label: 'Complexity', icon: '⚡' },
    ]

    const handleDownloadAST = () => {
        if (!data.ast) return;
        const blob = new Blob([JSON.stringify(data.ast, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ast.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const calculateComplexity = (ast) => {
        if (!ast) return { score: 0, details: [] };
        let score = 1; // Base complexity
        let details = [{ type: 'Base', count: 1, message: 'Default execution path' }];
        
        const countNodes = (node) => {
            if (!node) return;
            
            if (node.type === 'IfStatement') {
                score += 1;
                details.push({ type: 'If Statement', line: node.line || '?', message: 'Branching path' });
            } else if (node.type === 'WhileStatement') {
                score += 1;
                details.push({ type: 'While Loop', line: node.line || '?', message: 'Loop structure' });
            } else if (node.type === 'ForStatement') {
                score += 1;
                details.push({ type: 'For Loop', line: node.line || '?', message: 'Loop structure' });
            }

            // Traverse children
            if (node.body) {
                if (Array.isArray(node.body)) {
                    node.body.forEach(countNodes);
                } else {
                    countNodes(node.body);
                }
            }
            if (node.consequent) {
                if (Array.isArray(node.consequent)) {
                    node.consequent.forEach(countNodes);
                } else {
                    countNodes(node.consequent);
                }
            }
            if (node.alternate) {
                if (Array.isArray(node.alternate)) {
                    node.alternate.forEach(countNodes);
                } else {
                    countNodes(node.alternate);
                }
            }
        };

        if (ast.type === 'Program' && Array.isArray(ast.body)) {
            ast.body.forEach(countNodes);
        } else {
            countNodes(ast);
        }

        return { score, details };
    };

    const complexityData = calculateComplexity(data.ast);

    const getComplexityLevel = (score) => {
        if (score <= 3) return { label: 'Low', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
        if (score <= 6) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
        return { label: 'High', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    };

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
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-sky-400/80">Abstract Syntax Tree</h4>
                                {data.ast && (
                                    <button
                                        onClick={handleDownloadAST}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors border border-sky-100/50 shadow-sm"
                                        title="Download JSON"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Download JSON</span>
                                    </button>
                                )}
                            </div>
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

                    {activeTab === 'complexity' && (
                        <div className="flex flex-col h-full">
                            <h4 className="text-sm font-medium text-sky-400/80 mb-4">Code Complexity Analysis</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Score Card */}
                                <div className={`p-4 rounded-xl border ${getComplexityLevel(complexityData.score).bg} ${getComplexityLevel(complexityData.score).border} flex flex-col items-center justify-center`}>
                                    <span className="text-sm text-sky-600/70 mb-1 font-medium">Cyclomatic Score</span>
                                    <span className={`text-4xl font-black ${getComplexityLevel(complexityData.score).color}`}>
                                        {complexityData.score}
                                    </span>
                                    <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${getComplexityLevel(complexityData.score).bg} ${getComplexityLevel(complexityData.score).color}`}>
                                        {getComplexityLevel(complexityData.score).label}
                                    </span>
                                </div>
                                
                                {/* Info Description */}
                                <div className="md:col-span-2 p-4 rounded-xl bg-sky-50/50 border border-sky-100">
                                    <h5 className="text-sm font-semibold text-sky-700 mb-2">What is Cyclomatic Complexity?</h5>
                                    <p className="text-xs text-sky-600/80 mb-2 leading-relaxed">
                                        Cyclomatic complexity is a software metric used to indicate the complexity of a program. 
                                        It is computed using the control flow graph of the program: the nodes of the graph correspond to indivisible groups of commands of a program, and a directed edge connects two nodes if the second command might be executed immediately after the first command.
                                    </p>
                                    <ul className="text-xs text-sky-600/80 list-disc pl-4 space-y-1">
                                        <li><strong className="text-green-600">1-3</strong>: Simple, testable program</li>
                                        <li><strong className="text-yellow-600">4-6</strong>: Complex, moderate risk</li>
                                        <li><strong className="text-red-600">7+</strong>: Untestable, high risk component</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Details Table */}
                            <div className="flex-1 overflow-auto rounded-xl border border-sky-100 bg-white shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-sky-50 shadow-sm border-b border-sky-100 z-10">
                                        <tr>
                                            <th className="text-left py-2.5 px-4 text-sky-600 font-semibold text-xs uppercase tracking-wider">Metric Source</th>
                                            <th className="text-left py-2.5 px-4 text-sky-600 font-semibold text-xs uppercase tracking-wider">Line Info</th>
                                            <th className="text-left py-2.5 px-4 text-sky-600 font-semibold text-xs uppercase tracking-wider">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sky-50">
                                        {complexityData.details.map((detail, idx) => (
                                            <tr key={idx} className="hover:bg-sky-50/30 transition-colors">
                                                <td className="py-2 px-4 font-medium text-sky-700 flex items-center gap-2">
                                                    {detail.type === 'Base' && '📝'}
                                                    {detail.type === 'If Statement' && '🔀'}
                                                    {(detail.type === 'While Loop' || detail.type === 'For Loop') && '🔁'}
                                                    {detail.type}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {detail.line ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-700">
                                                            L{detail.line}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td className="py-2 px-4 text-sky-600/80 text-xs">{detail.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}
