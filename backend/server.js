import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compileRoutes from './routes/compileRoutes.js'

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/api', compileRoutes)

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Universal Logic Bridge Compiler is running' })
})

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    })
})

app.listen(PORT, () => {
    console.log(`🚀 Compiler server running on port ${PORT}`)
    console.log(`📡 Health check: http://localhost:${PORT}/health`)
})
