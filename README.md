# Universal Logic Bridge - Logic to Code Generator

A full-stack compiler design project that converts structured pseudo-code into multiple programming languages using proper compiler design principles.

![Project Banner](https://img.shields.io/badge/Compiler-Design-purple) ![React](https://img.shields.io/badge/React-18.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## 🎯 Project Overview

**Universal Logic Bridge** is a compiler-inspired system where students write structured semi-pseudo code, and the system performs lexical, syntax, and semantic analysis to generate equivalent code in multiple programming languages.

### Key Features

✅ **Full Compiler Pipeline**: Lexical → Syntax → Semantic → Code Generation  
✅ **5 Target Languages**: Python, C++, Java, C, JavaScript  
✅ **Real-time Analysis**: Token table, AST viewer, Symbol table  
✅ **Premium UI**: Glassmorphism design with smooth animations  
✅ **Monaco Editor**: Professional code editing experience  
✅ **Error Handling**: Line-specific error messages  
✅ **History Panel**: Track compilation history  
✅ **Download Support**: Export generated code  

---

## 🏗️ Architecture

### Compiler Phases

#### 1️⃣ Lexical Analysis (Tokenization)
- **Input**: Raw pseudo-code string
- **Process**: Scans character by character, identifies tokens
- **Output**: Array of tokens with type, value, and line number
- **Recognizes**:
  - Keywords: `START`, `END`, `INPUT`, `PRINT`, `SET`, `IF`, `THEN`, `ELSE`, `WHILE`, `DO`, `FOR`, `TO`
  - Operators: `+`, `-`, `*`, `/`, `%`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `=`
  - Identifiers: Variable names
  - Literals: Numbers and strings

#### 2️⃣ Syntax Analysis (Parsing)
- **Input**: Token stream
- **Process**: Builds Abstract Syntax Tree (AST) using recursive descent parsing
- **Output**: AST representing program structure
- **Validates**:
  - Program must start with `START` and end with `END`
  - Proper block structure for `IF`, `WHILE`, `FOR`
  - Correct statement syntax

#### 3️⃣ Semantic Analysis
- **Input**: AST
- **Process**: Traverses AST, maintains symbol table
- **Output**: Symbol table and semantic errors
- **Checks**:
  - Variables declared before use
  - Type consistency (basic)
  - Scope rules

#### 4️⃣ Code Generation
- **Input**: AST
- **Process**: Traverses AST and generates target language code
- **Output**: Syntactically correct code in selected language
- **Generators**:
  - `pythonGenerator.js` - Python with proper indentation
  - `cppGenerator.js` - C++ with iostream
  - `javaGenerator.js` - Java with Scanner
  - `cGenerator.js` - C with stdio.h
  - `jsGenerator.js` - JavaScript with readline

---

## 📚 Grammar Definition (BNF)

\`\`\`bnf
<program>      ::= "START" <statements> "END"
<statements>   ::= <statement> | <statement> <statements>
<statement>    ::= <input> | <print> | <assignment> | <if> | <while> | <for>

<input>        ::= "INPUT" <identifier>
<print>        ::= "PRINT" <expression>
<assignment>   ::= "SET" <identifier> "=" <expression>

<if>           ::= "IF" <expression> "THEN" <statements> ["ELSE" <statements>] "END IF"
<while>        ::= "WHILE" <expression> "DO" <statements> "END WHILE"
<for>          ::= "FOR" <identifier> "=" <expression> "TO" <expression> <statements> "END FOR"

<expression>   ::= <term> | <term> <comparison-op> <term>
<term>         ::= <factor> | <term> ("+" | "-") <factor>
<factor>       ::= <unary> | <factor> ("*" | "/" | "%") <unary>
<unary>        ::= <primary> | "-" <unary>
<primary>      ::= <number> | <string> | <identifier> | "(" <expression> ")"

<comparison-op> ::= "==" | "!=" | "<" | ">" | "<=" | ">="
<identifier>   ::= [a-zA-Z_][a-zA-Z0-9_]*
<number>       ::= [0-9]+ | [0-9]+"."[0-9]+
<string>       ::= '"' [^"]* '"' | "'" [^']* "'"
\`\`\`

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

\`\`\`bash
# Clone or navigate to project directory
cd universal-logic-bridge

# Install all dependencies (root, frontend, backend)
npm run install:all

# Or install individually
npm install
cd frontend && npm install
cd ../backend && npm install
\`\`\`

### Running the Application

\`\`\`bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
\`\`\`

---

## 📖 Supported Pseudo-Code Syntax

### Variables
\`\`\`
SET x = 10
SET sum = a + b
SET result = (x * 2) + 5
\`\`\`

### Input/Output
\`\`\`
INPUT username
PRINT "Hello"
PRINT x
PRINT x + y
\`\`\`

### Conditionals
\`\`\`
IF x > 5 THEN
    PRINT "Greater"
ELSE
    PRINT "Smaller"
END IF
\`\`\`

### Loops
\`\`\`
WHILE x < 10 DO
    SET x = x + 1
END WHILE

FOR i = 1 TO 10
    PRINT i
END FOR
\`\`\`

### Complete Example
\`\`\`
START
INPUT n
SET factorial = 1
FOR i = 1 TO n
    SET factorial = factorial * i
END FOR
PRINT factorial
END
\`\`\`

---

## 🎨 Tech Stack

### Frontend
- **React 18.2** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor
- **Framer Motion** - Animations
- **Lucide Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Custom Compiler** - Lexer, Parser, Semantic Analyzer, Code Generators

---

## 📂 Project Structure

\`\`\`
universal-logic-bridge/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LogicEditor.jsx
│   │   │   ├── CodeOutput.jsx
│   │   │   ├── AnalysisPanel.jsx
│   │   │   └── HistoryPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── lexer/
│   │   └── Lexer.js
│   ├── parser/
│   │   └── Parser.js
│   ├── semantic/
│   │   └── SemanticAnalyzer.js
│   ├── generators/
│   │   ├── pythonGenerator.js
│   │   ├── cppGenerator.js
│   │   ├── javaGenerator.js
│   │   ├── cGenerator.js
│   │   └── jsGenerator.js
│   ├── routes/
│   │   └── compileRoutes.js
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
\`\`\`

---

## 🔍 AST Structure Example

For the pseudo-code:
\`\`\`
START
INPUT x
PRINT x
END
\`\`\`

The AST generated:
\`\`\`json
{
  "type": "Program",
  "body": [
    {
      "type": "InputStatement",
      "variable": "x",
      "line": 2
    },
    {
      "type": "PrintStatement",
      "expression": {
        "type": "Identifier",
        "name": "x"
      },
      "line": 3
    }
  ]
}
\`\`\`

---

## 🎓 Academic Value

This project demonstrates:

1. **Compiler Design Principles**
   - Lexical analysis with tokenization
   - Syntax analysis with recursive descent parsing
   - Semantic analysis with symbol tables
   - Code generation with AST traversal

2. **Software Engineering**
   - Modular architecture
   - Separation of concerns
   - Error handling and recovery
   - Clean code practices

3. **Full-Stack Development**
   - RESTful API design
   - React component architecture
   - State management
   - Responsive UI/UX

---

## 🚀 Future Enhancements

- [ ] AI-based code generation mode
- [ ] Step-by-step compilation visualization
- [ ] Multi-language side-by-side comparison
- [ ] Code complexity analysis
- [ ] Optimization suggestions
- [ ] Export AST as JSON
- [ ] Custom syntax highlighting
- [ ] Debugging support
- [ ] More target languages (Rust, Go, etc.)

---

## 📝 License

MIT License - Feel free to use for educational purposes

---

## 👨‍💻 Author

Created as a Compiler Design Project

**Universal Logic Bridge** - Bridging the gap between logic and code! 🌉
