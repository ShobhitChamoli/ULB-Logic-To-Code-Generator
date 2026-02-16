/**
 * Compilation Routes
 * API endpoints for code compilation
 */

import express from 'express'
import Lexer from '../lexer/Lexer.js'
import Parser from '../parser/Parser.js'
import SemanticAnalyzer from '../semantic/SemanticAnalyzer.js'
import PythonGenerator from '../generators/pythonGenerator.js'
import CppGenerator from '../generators/cppGenerator.js'
import JavaGenerator from '../generators/javaGenerator.js'
import CGenerator from '../generators/cGenerator.js'
import JSGenerator from '../generators/jsGenerator.js'

const router = express.Router()

router.post('/compile', (req, res) => {
    try {
        const { code, language, mode } = req.body

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: 'Code and language are required'
            })
        }

        // Phase 1: Lexical Analysis
        const lexer = new Lexer(code)
        const tokens = lexer.tokenize()

        // Phase 2: Syntax Analysis
        const parser = new Parser(tokens)
        const { ast, errors: parseErrors } = parser.parse()

        if (parseErrors.length > 0) {
            return res.json({
                success: false,
                errors: parseErrors,
                tokens: tokens
            })
        }

        // Phase 3: Semantic Analysis
        const semanticAnalyzer = new SemanticAnalyzer(ast)
        const { symbolTable, errors: semanticErrors } = semanticAnalyzer.analyze()

        if (semanticErrors.length > 0) {
            return res.json({
                success: false,
                errors: semanticErrors,
                tokens: tokens,
                ast: ast,
                symbolTable: symbolTable
            })
        }

        // Phase 4: Code Generation
        let generator
        switch (language) {
            case 'python':
                generator = new PythonGenerator(ast)
                break
            case 'cpp':
                generator = new CppGenerator(ast)
                break
            case 'java':
                generator = new JavaGenerator(ast)
                break
            case 'c':
                generator = new CGenerator(ast)
                break
            case 'javascript':
                generator = new JSGenerator(ast)
                break
            default:
                return res.status(400).json({
                    success: false,
                    message: `Unsupported language: ${language}`
                })
        }

        const generatedCode = generator.generate()

        // Return successful compilation
        res.json({
            success: true,
            generatedCode: generatedCode,
            tokens: tokens,
            ast: ast,
            symbolTable: symbolTable,
            errors: []
        })

    } catch (error) {
        console.error('Compilation error:', error)
        res.status(500).json({
            success: false,
            message: 'Compilation failed',
            error: error.message,
            errors: [{ line: 0, message: error.message }]
        })
    }
})

export default router
