# Grammar Definition - Universal Logic Bridge

## Formal Grammar in BNF Notation

### Program Structure
\`\`\`bnf
<program>      ::= "START" <statements> "END"
<statements>   ::= <statement> | <statement> <statements>
<statement>    ::= <input-stmt> 
                 | <print-stmt> 
                 | <assignment-stmt> 
                 | <if-stmt> 
                 | <while-stmt> 
                 | <for-stmt>
\`\`\`

### Statement Types

#### Input Statement
\`\`\`bnf
<input-stmt>   ::= "INPUT" <identifier>
\`\`\`

#### Print Statement
\`\`\`bnf
<print-stmt>   ::= "PRINT" <expression>
\`\`\`

#### Assignment Statement
\`\`\`bnf
<assignment-stmt> ::= "SET" <identifier> "=" <expression>
\`\`\`

#### Conditional Statement
\`\`\`bnf
<if-stmt>      ::= "IF" <expression> "THEN" <statements> <else-part> "END IF"
<else-part>    ::= ε | "ELSE" <statements>
\`\`\`

#### While Loop
\`\`\`bnf
<while-stmt>   ::= "WHILE" <expression> "DO" <statements> "END WHILE"
\`\`\`

#### For Loop
\`\`\`bnf
<for-stmt>     ::= "FOR" <identifier> "=" <expression> "TO" <expression> <statements> "END FOR"
\`\`\`

### Expressions

\`\`\`bnf
<expression>   ::= <comparison>
<comparison>   ::= <term> | <term> <comp-op> <term>
<term>         ::= <factor> | <term> <add-op> <factor>
<factor>       ::= <unary> | <factor> <mul-op> <unary>
<unary>        ::= <primary> | "-" <unary>
<primary>      ::= <number> 
                 | <string> 
                 | <identifier> 
                 | "(" <expression> ")"
\`\`\`

### Operators

\`\`\`bnf
<comp-op>      ::= "==" | "!=" | "<" | ">" | "<=" | ">="
<add-op>       ::= "+" | "-"
<mul-op>       ::= "*" | "/" | "%"
\`\`\`

### Terminals

\`\`\`bnf
<identifier>   ::= <letter> | <identifier> <letter> | <identifier> <digit> | <identifier> "_"
<number>       ::= <digit> | <number> <digit> | <number> "." <digit>
<string>       ::= '"' <char-sequence> '"' | "'" <char-sequence> "'"
<letter>       ::= "a" | "b" | ... | "z" | "A" | "B" | ... | "Z" | "_"
<digit>        ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
\`\`\`

---

## Operator Precedence (Highest to Lowest)

1. **Parentheses**: `( )`
2. **Unary**: `-` (negation)
3. **Multiplicative**: `*`, `/`, `%`
4. **Additive**: `+`, `-`
5. **Comparison**: `==`, `!=`, `<`, `>`, `<=`, `>=`

---

## Associativity

- All binary operators are **left-associative**
- Unary operators are **right-associative**

---

## Keywords (Reserved Words)

\`\`\`
START, END, INPUT, PRINT, SET, IF, THEN, ELSE, END IF,
WHILE, DO, END WHILE, FOR, TO, END FOR
\`\`\`

---

## Example Parse Trees

### Simple Assignment
\`\`\`
SET x = 5
\`\`\`

Parse Tree:
\`\`\`
<assignment-stmt>
    ├── SET
    ├── <identifier> (x)
    ├── =
    └── <expression>
        └── <primary>
            └── <number> (5)
\`\`\`

### If Statement
\`\`\`
IF x > 5 THEN
    PRINT x
END IF
\`\`\`

Parse Tree:
\`\`\`
<if-stmt>
    ├── IF
    ├── <expression>
    │   ├── <identifier> (x)
    │   ├── >
    │   └── <number> (5)
    ├── THEN
    ├── <statements>
    │   └── <print-stmt>
    │       ├── PRINT
    │       └── <identifier> (x)
    └── END IF
\`\`\`

---

## Grammar Properties

- **LL(1)**: Can be parsed with one token lookahead
- **Unambiguous**: Each valid program has exactly one parse tree
- **Context-Free**: Can be recognized by a pushdown automaton
- **Deterministic**: No backtracking required during parsing
