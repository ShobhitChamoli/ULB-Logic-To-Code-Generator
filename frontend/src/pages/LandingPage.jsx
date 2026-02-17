import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Code2, Zap, Eye, Bug, History, Download, ArrowRight, Sparkles, Cpu, FileCode } from 'lucide-react'

function LandingPage() {
    const navigate = useNavigate()

    const features = [
        {
            icon: <Code2 className="w-8 h-8" />,
            title: "Multi-Language Support",
            description: "Convert your logic to Python, C++, Java, C, or JavaScript instantly"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Real-time Compilation",
            description: "See your code generated in real-time as you write your logic"
        },
        {
            icon: <Eye className="w-8 h-8" />,
            title: "AST Visualization",
            description: "Visualize the Abstract Syntax Tree and understand code structure"
        },
        {
            icon: <Bug className="w-8 h-8" />,
            title: "Error Detection",
            description: "Get instant feedback on syntax and semantic errors with line numbers"
        },
        {
            icon: <History className="w-8 h-8" />,
            title: "History Tracking",
            description: "Track all your compilations and revisit previous code generations"
        },
        {
            icon: <Download className="w-8 h-8" />,
            title: "Code Export",
            description: "Download generated code directly to your machine"
        }
    ]

    const steps = [
        {
            number: "01",
            title: "Write Logic",
            description: "Write your pseudo-code using our simple, intuitive syntax",
            icon: <FileCode className="w-12 h-12" />
        },
        {
            number: "02",
            title: "Compile",
            description: "Our compiler analyzes and processes your logic through multiple phases",
            icon: <Cpu className="w-12 h-12" />
        },
        {
            number: "03",
            title: "Analyze",
            description: "View tokens, AST, and symbol tables to understand the compilation",
            icon: <Eye className="w-12 h-12" />
        },
        {
            number: "04",
            title: "Export",
            description: "Download your generated code in your preferred programming language",
            icon: <Download className="w-12 h-12" />
        }
    ]

    return (
        <div className="min-h-screen gradient-animated text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-20 left-10 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl"
                        animate={{
                            y: [0, 30, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                        animate={{
                            y: [0, -40, 0],
                            x: [0, -30, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-sm font-semibold mb-8">
                            <Sparkles className="w-4 h-4" />
                            Powered by Compiler Design Principles
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black mb-6 leading-tight"
                    >
                        Universal Logic
                        <br />
                        <span className="bg-gradient-to-r from-white via-sky-200 to-blue-200 bg-clip-text text-transparent">
                            Bridge
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-sky-100 mb-12 max-w-3xl mx-auto font-light"
                    >
                        Write complex algorithms and logic in simple pseudo-code. Generate production-ready code in Python, C++, Java, C, and JavaScript.
                        <br />
                        <span className="text-white/90 font-medium">From LeetCode-style problems to production code</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/editor')}
                            className="group relative px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            Launch Editor
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 glass-strong rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                        >
                            Learn More
                        </button>
                    </motion.div>

                    {/* Code Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-20 glass-strong rounded-3xl p-8 max-w-2xl mx-auto text-left"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="ml-4 text-sm text-sky-200">example.logic</span>
                        </div>
                        <pre className="text-sm md:text-base font-mono text-sky-100 leading-relaxed">
                            <code>{`START
INPUT n
SET factorial = 1
FOR i = 1 TO n
    SET factorial = factorial * i
END FOR
PRINT factorial
END`}</code>
                        </pre>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-sky-100 max-w-2xl mx-auto">
                            Professional compiler-based code generation for complex algorithms and data structures
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="glass-strong rounded-3xl p-8 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-sky-100 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6">
                            How It Works
                        </h2>
                        <p className="text-xl text-sky-100 max-w-2xl mx-auto">
                            Professional compiler pipeline: from algorithm design to executable code
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-sky-400 to-transparent -z-10" />
                                )}

                                <div className="glass-strong rounded-3xl p-8 text-center hover:scale-105 transition-transform duration-300">
                                    <div className="text-6xl font-black text-white/20 mb-4">{step.number}</div>
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mx-auto mb-6">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-sky-100 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass-strong rounded-3xl p-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6">
                            Ready to Bridge the Gap?
                        </h2>
                        <p className="text-xl text-sky-100 mb-10">
                            Start solving complex coding problems with professional code generation
                        </p>
                        <button
                            onClick={() => navigate('/editor')}
                            className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
                        >
                            Get Started Now
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sky-100 mb-2">
                        Universal Logic Bridge - Professional code generation for complex algorithms 💻
                    </p>
                    <p className="text-sky-200/60 text-sm">
                        Built with compiler design principles • Lexical → Syntax → Semantic → Code Generation
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
