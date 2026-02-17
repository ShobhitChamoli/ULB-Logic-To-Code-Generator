# Grammar Definition - Universal Logic Bridge

## Philosophy: Natural Language Logic

This grammar supports **natural, beginner-friendly language** - not formal pseudocode. Users write like they're explaining to a friend, and the system converts it to code.

## Supported Natural Phrases

### Program Structure
```
begin / start / BEGIN / START
end / finish / END / FINISH
```

### Input/Output (Natural Language)
```
ask for [variable]
get [variable]
input [variable]
read [variable]

show [expression]
display [expression]
print [expression]
output [expression]

set [variable] to [value]
make [variable] equal to [value]
let [variable] = [value]
[variable] = [value]
```

### Lists/Arrays (Natural Language)
```
create list [name] with [size] items
make array [name] of size [size]
create array [name]

add [value] to [list] at position [index]
put [value] in [list] at [index]
set [list][index] to [value]

get item [index] from [list]
[list][index]
```

### Decisions (Natural Language)
```
if [condition] then
    [statements]
otherwise
    [statements]
end if

if [condition]
    [statements]
else
    [statements]
endif
```

### Loops (Natural Language)
```
repeat [count] times
    [statements]
end repeat

for each [item] in [list]
    [statements]
end for

for [variable] from [start] to [end]
    [statements]
end for

while [condition]
    [statements]
end while

keep doing while [condition]
    [statements]
end
```

### Comparisons (Natural Language)
```
[x] is greater than [y]       →  x > y
[x] is less than [y]          →  x < y
[x] equals [y]                →  x == y
[x] is equal to [y]           →  x == y
[x] is not equal to [y]       →  x != y
[x] is at least [y]           →  x >= y
[x] is at most [y]            →  x <= y
```

### Math Operations (Natural Language)
```
add [x] and [y]               →  x + y
[x] plus [y]                  →  x + y
subtract [y] from [x]         →  x - y
[x] minus [y]                 →  x - y
multiply [x] by [y]           →  x * y
[x] times [y]                 →  x * y
divide [x] by [y]             →  x / y
remainder of [x] divided by [y] → x % y
```

## Example: Natural Language → Code

### Example 1: Find Largest Number (Natural Style)
```
begin
ask for how many numbers
create list numbers with n items

for each position from 0 to n-1
    ask for numbers[position]
end for

set largest to numbers[0]

for each position from 1 to n-1
    if numbers[position] is greater than largest then
        set largest to numbers[position]
    end if
end for

show "The largest number is:"
show largest
end
```

### Example 2: Sum of Array (Very Natural)
```
start
get n
make array nums of size n

repeat n times with i
    get nums[i]
end repeat

set total to 0
for each i from 0 to n-1
    add nums[i] to total
end for

display total
finish
```

### Example 3: Even or Odd (Beginner Friendly)
```
begin
ask for number
set remainder to number % 2

if remainder equals 0 then
    show "Even"
otherwise
    show "Odd"
end if
end
```

## Formal BNF (For Parser Implementation)

### Core Grammar
```bnf
<program>      ::= <start-keyword> <statements> <end-keyword>
<start-keyword>::= "START" | "BEGIN" | "start" | "begin"
<end-keyword>  ::= "END" | "FINISH" | "end" | "finish"

<statements>   ::= <statement> | <statement> <statements>
<statement>    ::= <input-stmt> 
                 | <output-stmt> 
                 | <assignment-stmt>
                 | <if-stmt>
                 | <loop-stmt>
                 | <array-stmt>

<input-stmt>   ::= ("INPUT" | "ask for" | "get" | "read") <identifier>

<output-stmt>  ::= ("PRINT" | "show" | "display" | "output") <expression>

<assignment-stmt> ::= ("SET" | "set" | "make" | "let") <identifier> 
                      ("=" | "to" | "equal to") <expression>
                   | <identifier> "=" <expression>

<array-stmt>   ::= ("create list" | "make array" | "ARRAY") <identifier> 
                   ("with" | "of size") <expression> ("items" | "")
                 | ("add" | "put" | "SET") <expression> 
                   ("to" | "in") <identifier> "[" <expression> "]"

<if-stmt>      ::= "IF" <condition> "THEN" <statements> 
                   ("ELSE" | "otherwise") <statements> "END IF"

<loop-stmt>    ::= "FOR" <identifier> "=" <expression> "TO" <expression> 
                   <statements> "END FOR"
                 | "WHILE" <condition> "DO" <statements> "END WHILE"
                 | "repeat" <expression> "times" <statements> "end repeat"

<condition>    ::= <expression> <comparison-op> <expression>
                 | <expression> "is greater than" <expression>
                 | <expression> "is less than" <expression>
                 | <expression> "equals" <expression>
                 | <expression> "is equal to" <expression>

<comparison-op>::= "==" | "!=" | "<" | ">" | "<=" | ">="

<expression>   ::= <term> | <term> ("+" | "-") <expression>
<term>         ::= <factor> | <factor> ("*" | "/" | "%") <term>
<factor>       ::= <number> | <identifier> | <array-access> | "(" <expression> ")"
<array-access> ::= <identifier> "[" <expression> "]"
```

## Keywords (Case-Insensitive)

### Program Control
- START, BEGIN, start, begin
- END, FINISH, end, finish

### I/O Operations
- INPUT, ask for, get, read
- PRINT, show, display, output
- SET, set, make, let

### Control Flow
- IF, THEN, ELSE, otherwise, END IF, endif
- FOR, TO, END FOR
- WHILE, DO, END WHILE
- repeat, times, end repeat

### Arrays/Lists
- ARRAY, create list, make array
- add, put, get item

### Comparisons
- is greater than, is less than
- equals, is equal to, is not equal to
- is at least, is at most

## Design Principles

1. **Flexible Syntax**: Accept multiple ways to express the same thing
2. **Case-Insensitive**: "START" = "start" = "Start"
3. **Natural Phrases**: "ask for age" instead of "INPUT age"
4. **Beginner-Friendly**: Write like explaining to a friend
5. **Forgiving Parser**: Understand intent, not just exact syntax

## Implementation Notes

The parser should:
- Normalize input (lowercase, trim whitespace)
- Support synonym detection ("show" = "print" = "display")
- Handle natural language comparisons
- Convert to standard AST internally
- Generate clean code in target language
