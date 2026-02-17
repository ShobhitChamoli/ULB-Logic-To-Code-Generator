# Grammar Definition - Universal Logic Bridge

## Formal Grammar in BNF Notation

### Program Structure
```bnf
<program>      ::= "START" <statements> "END"
<statements>   ::= <statement> | <statement> <statements>
<statement>    ::= <input-stmt> 
                 | <print-stmt> 
                 | <assignment-stmt> 
                 | <if-stmt> 
                 | <while-stmt> 
                 | <for-stmt>
                 | <array-decl-stmt>
                 | <function-decl-stmt>
                 | <return-stmt>
```

### Statement Types

#### Input Statement
```bnf
<input-stmt>   ::= "INPUT" <identifier>
```

#### Print Statement
```bnf
<print-stmt>   ::= "PRINT" <expression>
```

#### Assignment Statement
```bnf
<assignment-stmt> ::= "SET" <identifier> "=" <expression>
                    | "SET" <array-access> "=" <expression>
```

#### Array Declaration Statement
```bnf
<array-decl-stmt> ::= "ARRAY" <identifier> "[" <expression> "]"
                    | "ARRAY" <identifier> "=" "[" <expression-list> "]"
<expression-list> ::= <expression> | <expression> "," <expression-list>
```

#### Conditional Statement
```bnf
<if-stmt>      ::= "IF" <expression> "THEN" <statements> <else-part> "END IF"
<else-part>    ::= ε | "ELSE" <statements>
```

#### While Loop
```bnf
<while-stmt>   ::= "WHILE" <expression> "DO" <statements> "END WHILE"
```

#### For Loop
```bnf
<for-stmt>     ::= "FOR" <identifier> "=" <expression> "TO" <expression> <statements> "END FOR"
```

#### Function Definition
```bnf
<function-decl-stmt> ::= "FUNCTION" <identifier> "(" <param-list> ")" <statements> "END FUNCTION"
<param-list>   ::= ε | <identifier> | <identifier> "," <param-list>
```

#### Return Statement
```bnf
<return-stmt>  ::= "RETURN" <expression>
```

### Expressions

```bnf
<expression>   ::= <comparison>
<comparison>   ::= <term> | <term> <comp-op> <term>
<term>         ::= <factor> | <term> <add-op> <factor>
<factor>       ::= <unary> | <factor> <mul-op> <unary>
<unary>        ::= <primary> | "-" <unary>
<primary>      ::= <number> 
                 | <string> 
                 | <identifier> 
                 | <array-access>
                 | <function-call>
                 | "(" <expression> ")"
<array-access> ::= <identifier> "[" <expression> "]"
<function-call>::= <identifier> "(" <arg-list> ")"
<arg-list>     ::= ε | <expression> | <expression> "," <arg-list>
```

### Operators

```bnf
<comp-op>      ::= "==" | "!=" | "<" | ">" | "<=" | ">="
<add-op>       ::= "+" | "-"
<mul-op>       ::= "*" | "/" | "%"
```

### Terminals

```bnf
<identifier>   ::= <letter> | <identifier> <letter> | <identifier> <digit> | <identifier> "_"
<number>       ::= <digit> | <number> <digit> | <number> "." <digit>
<string>       ::= '"' <char-sequence> '"' | "'" <char-sequence> "'"
<letter>       ::= "a" | "b" | ... | "z" | "A" | "B" | ... | "Z" | "_"
<digit>        ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

---

## Operator Precedence (Highest to Lowest)

1.  **Parentheses**: `( )`
2.  **Array Access**: `[ ]`
3.  **Function Call**: `( )`
4.  **Unary**: `-` (negation)
5.  **Multiplicative**: `*`, `/`, `%`
6.  **Additive**: `+`, `-`
7.  **Comparison**: `==`, `!=`, `<`, `>`, `<=`, `>=`

---

## Associativity

- All binary operators are **left-associative**
- Unary operators are **right-associative**
- Array access and function calls are **left-associative**

---

## Keywords (Reserved Words)

```
START, END, INPUT, PRINT, SET, IF, THEN, ELSE, END IF,
WHILE, DO, END WHILE, FOR, TO, END FOR,
ARRAY, FUNCTION, END FUNCTION, RETURN
```

---

## Example Parse Trees

### Simple Assignment
```
SET x = 5
```

Parse Tree:
```
<assignment-stmt>
    ├── SET
    ├── <identifier> (x)
    ├── =
    └── <expression>
        └── <primary>
            └── <number> (5)
```

### If Statement
```
IF x > 5 THEN
    PRINT x
END IF
```

Parse Tree:
```
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
```

### Array Access and Assignment
```
SET arr[0] = 10
```

Parse Tree:
```
<assignment-stmt>
    ├── SET
    ├── <array-access>
    │   ├── <identifier> (arr)
    │   ├── [
    │   ├── <expression>
    │   │   └── <primary>
    │   │       └── <number> (0)
    │   └── ]
    ├── =
    └── <expression>
        └── <primary>
            └── <number> (10)
```

### Function Call
```
PRINT calculate(a, b)
```

Parse Tree:
```
<print-stmt>
    ├── PRINT
    └── <expression>
        └── <primary>
            └── <function-call>
                ├── <identifier> (calculate)
                ├── (
                ├── <arg-list>
                │   ├── <expression>
                │   │   └── <primary>
                │   │       └── <identifier> (a)
                │   └── ,
                │   └── <arg-list>
                │       └── <expression>
                │           └── <primary>
                │               └── <identifier> (b)
                └── )
```

---

## Grammar Properties

-   **LL(1)**: Can be parsed with one token lookahead (with careful design, though array access and function calls might require more lookahead or a different parsing strategy if not handled carefully in the lexer/parser).
-   **Unambiguous**: Each valid program has exactly one parse tree (requires careful construction, especially with new rules).
-   **Context-Free**: Can be recognized by a pushdown automaton
-   **Deterministic**: No backtracking required during parsing
