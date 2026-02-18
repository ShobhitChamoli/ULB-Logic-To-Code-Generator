# Grammar Definition — Universal Logic Bridge

## Philosophy: Natural Language Logic

This grammar supports **natural, beginner-friendly language**. Users write like they're explaining to a friend, and the system converts it to real code in **Python, C++, Java, C, and JavaScript**.

> **All input is case-insensitive.** `START` = `start` = `Start`

---

## Program Structure
```
START / BEGIN / start / begin
  ... your logic here ...
END / FINISH / end / finish
```

---

## Input / Output
```
INPUT variable         |  ask for variable
                       |  get variable
                       |  read variable

PRINT expression       |  show expression
                       |  display expression
                       |  output expression

SET x = value          |  set x to value
                       |  make x equal to value
                       |  let x = value
                       |  x = value
```

---

## Decisions
```
IF condition THEN      |  if condition then
    statements         |      statements
ELSE                   |  otherwise
    statements         |      statements
END IF                 |  end if / endif
```

---

## Loops
```
FOR i = 1 TO 10        |  for i from 1 to 10
    statements         |      statements
END FOR                |  end for

WHILE x < 100 DO      |  while x is less than 100
    statements         |      statements
END WHILE              |  end while

                       |  repeat 5 times
                       |      statements
                       |  end repeat

                       |  keep doing while condition
                       |      statements
                       |  end while
```

---

## Comparisons
```
x > y                  |  x is greater than y
x < y                  |  x is less than y
x == y                 |  x equals y / x is equal to y
x != y                 |  x is not equal to y
x >= y                 |  x is at least y
x <= y                 |  x is at most y
```

---

## Math Operations
```
x + y                  |  x plus y
x - y                  |  x minus y
x * y                  |  x times y
x / y                  |  x divided by y
x % y                  |  x modulo y / x mod y
```

---

## Arrays
```
ARRAY numbers[5]       |  create array numbers of size 5
                       |  create list numbers with 5 items
                       |  make array numbers of size 5

SET numbers[0] = 10    |  set numbers[0] to 10
PRINT numbers[0]       |  show numbers[0]
```

---

## Stack
```
STACK myStack          |  create stack myStack
PUSH myStack 10       |  push 10 onto myStack
                       |  add 10 to stack myStack
POP myStack           |  pop from myStack
                       |  remove from stack myStack
TOP myStack           |  top of myStack / peek myStack
```

**Generated code:** `stack<int>` (C++), `list` (Python), `Stack<Integer>` (Java), array (C/JS)

---

## Queue
```
QUEUE myQueue          |  create queue myQueue
ENQUEUE myQueue 10    |  enqueue 10 into myQueue
                       |  add 10 to queue myQueue
DEQUEUE myQueue       |  dequeue from myQueue
                       |  remove from queue myQueue
FRONT myQueue         |  front of myQueue
```

**Generated code:** `queue<int>` (C++), `deque` (Python), `Queue<Integer>` (Java), array (C/JS)

---

## Map / Dictionary
```
MAP myMap              |  create map myMap
                       |  create dictionary myMap
MAP_INSERT myMap k v  |  put k v in myMap
                       |  insert k v into myMap
MAP_GET myMap k       |  get from myMap using k
                       |  map get myMap k
MAP_REMOVE myMap k    |  map remove myMap k
```

**Generated code:** `map<int,int>` (C++), `dict` (Python), `HashMap` (Java), `Map` (JS), arrays (C)

---

## Set
```
SET_DS mySet           |  create set mySet
SET_ADD mySet 10      |  add 10 to set mySet
SET_REMOVE mySet 10   |  remove 10 from set mySet
CONTAINS mySet 10     |  mySet contains 10
```

**Generated code:** `set<int>` (C++), `set()` (Python), `HashSet` (Java), `Set` (JS), array (C)

---

## Vector / Dynamic Array
```
VECTOR myVec           |  create vector myVec
VECTOR_PUSH myVec 10  |  append 10 to myVec
                       |  push 10 to vector myVec
VECTOR_POP myVec      |  remove last from myVec
```

**Generated code:** `vector<int>` (C++), `list` (Python), `ArrayList` (Java), `Array` (JS), array (C)

---

## Linked List
```
LINKED_LIST myList     |  create linked list myList
LL_PUSH_FRONT myList 5|  add 5 to front of myList
LL_PUSH_BACK myList 5 |  add 5 to back of myList
LL_POP_FRONT myList   |  remove front from myList
LL_POP_BACK myList    |  remove back from myList
```

**Generated code:** `list<int>` (C++), `deque` (Python), `LinkedList` (Java), `Array` (JS), array (C)

---

## Tree (Binary Search Tree)
```
TREE myTree            |  create tree myTree
TREE_INSERT myTree 10 |  insert 10 into tree myTree
                       |  add 10 to tree myTree
```

**Generated code:** `set<int>` (C++), `bisect/sorted list` (Python), `TreeSet` (Java), sorted array (JS/C)

---

## Graph (Adjacency List)
```
GRAPH myGraph 10       |  create graph myGraph with 10 nodes
GRAPH_ADD_EDGE myGraph 0 1  |  add edge from 0 to 1 in myGraph
                             |  add edge 0 1 in myGraph
```

**Generated code:** `vector<vector<int>>` (C++), `dict` (Python), `List<List<Integer>>` (Java), adjacency (JS/C)

---

## Pair
```
PAIR myPair 5 10       |  create pair myPair with 5 and 10
PAIR_FIRST myPair     |  first of myPair
PAIR_SECOND myPair    |  second of myPair
```

**Generated code:** `pair<int,int>` (C++), `tuple` (Python), `int[]` (Java), array (JS/C)

---

## Priority Queue
```
PRIORITY_QUEUE myPQ    |  create priority queue myPQ
```

**Generated code:** `priority_queue<int>` (C++), `heapq` (Python), `PriorityQueue` (Java), array (JS/C)

---

## Deque (Double-Ended Queue)
```
DEQUE myDeque          |  create deque myDeque
DEQUE_PUSH_FRONT myDeque 5  |  push front myDeque 5
DEQUE_PUSH_BACK myDeque 10  |  push back myDeque 10
DEQUE_POP_FRONT myDeque     |  pop front from myDeque
DEQUE_POP_BACK myDeque      |  pop back from myDeque
```

**Generated code:** `deque<int>` (C++), `deque` (Python), `ArrayDeque` (Java), `Array` (JS), array (C)

---

## Struct / Custom Type
```
STRUCT Point x y       |  create struct Point with fields x y
```

**Generated code:** `struct` (C/C++), `dict` (Python), `class` (Java), `object` (JS)

---

## Common Operations
```
SIZE myStack           |  size of myStack
EMPTY myStack          |  myStack is empty
```

---

## Complete Examples

### Example 1: Stack Operations
```
START
STACK s
PUSH s 10
PUSH s 20
PUSH s 30
POP s
PRINT TOP s
END
```

### Example 2: Natural Language — Even/Odd
```
begin
ask for number
set remainder to number mod 2
if remainder equals 0 then
    show "Even"
otherwise
    show "Odd"
end if
finish
```

### Example 3: Graph with Edges
```
START
GRAPH g 5
GRAPH_ADD_EDGE g 0 1
GRAPH_ADD_EDGE g 1 2
GRAPH_ADD_EDGE g 2 3
PRINT "Graph created"
END
```

### Example 4: Map Operations (Natural)
```
begin
create map scores
put 1 95 in scores
put 2 87 in scores
get from scores using 1
show "Done"
finish
```

### Example 5: Find Largest Number
```
START
INPUT n
ARRAY numbers n
FOR i = 0 TO n - 1
    INPUT numbers[i]
END FOR
SET largest = numbers[0]
FOR i = 1 TO n - 1
    IF numbers[i] > largest THEN
        SET largest = numbers[i]
    END IF
END FOR
PRINT "Largest:"
PRINT largest
END
```

---

## Formal BNF (For Parser Implementation)

```bnf
<program>      ::= <start-keyword> <statements> <end-keyword>
<start-keyword>::= "START" | "BEGIN"
<end-keyword>  ::= "END" | "FINISH"

<statements>   ::= <statement> | <statement> <statements>
<statement>    ::= <input-stmt> | <output-stmt> | <assignment-stmt>
                 | <if-stmt> | <loop-stmt> | <array-stmt>
                 | <ds-create-stmt> | <ds-operation-stmt>

<input-stmt>   ::= "INPUT" <identifier>
<output-stmt>  ::= "PRINT" <expression>
<assignment-stmt> ::= "SET" <identifier> "=" <expression>

<if-stmt>      ::= "IF" <condition> "THEN" <statements>
                   ("ELSE" <statements>)? "END IF"

<loop-stmt>    ::= "FOR" <identifier> "=" <expression> "TO" <expression>
                   <statements> "END FOR"
                 | "WHILE" <condition> "DO" <statements> "END WHILE"

<array-stmt>   ::= "ARRAY" <identifier> <expression>
                 | "SET" <identifier> "[" <expression> "]" "=" <expression>

<ds-create-stmt> ::= "STACK" <identifier>
                   | "QUEUE" <identifier>
                   | "MAP" <identifier>
                   | "SET_DS" <identifier>
                   | "VECTOR" <identifier>
                   | "LINKED_LIST" <identifier>
                   | "TREE" <identifier>
                   | "GRAPH" <identifier> <expression>?
                   | "PAIR" <identifier> <expression>? <expression>?
                   | "PRIORITY_QUEUE" <identifier>
                   | "DEQUE" <identifier>
                   | "STRUCT" <identifier> <identifier>+

<ds-operation-stmt> ::= "PUSH" <identifier> <expression>
                      | "POP" <identifier>
                      | "TOP" <identifier>
                      | "ENQUEUE" <identifier> <expression>
                      | "DEQUEUE" <identifier>
                      | "FRONT" <identifier>
                      | "MAP_INSERT" <identifier> <expression> <expression>
                      | "MAP_GET" <identifier> <expression>
                      | "MAP_REMOVE" <identifier> <expression>
                      | "SET_ADD" <identifier> <expression>
                      | "SET_REMOVE" <identifier> <expression>
                      | "CONTAINS" <identifier> <expression>
                      | "VECTOR_PUSH" <identifier> <expression>
                      | "VECTOR_POP" <identifier>
                      | "LL_PUSH_FRONT" <identifier> <expression>
                      | "LL_PUSH_BACK" <identifier> <expression>
                      | "LL_POP_FRONT" <identifier>
                      | "LL_POP_BACK" <identifier>
                      | "TREE_INSERT" <identifier> <expression>
                      | "GRAPH_ADD_EDGE" <identifier> <expression> <expression>
                      | "PAIR_FIRST" <identifier>
                      | "PAIR_SECOND" <identifier>
                      | "SIZE" <identifier>
                      | "EMPTY" <identifier>

<condition>    ::= <expression> <comparison-op> <expression>
<comparison-op>::= "==" | "!=" | "<" | ">" | "<=" | ">="

<expression>   ::= <term> | <term> ("+" | "-") <expression>
<term>         ::= <factor> | <factor> ("*" | "/" | "%") <term>
<factor>       ::= <number> | <identifier> | <array-access> | "(" <expression> ")"
<array-access> ::= <identifier> "[" <expression> "]"
```

---

## Design Principles

1. **Flexible Syntax** — Accept multiple ways to express the same thing
2. **Case-Insensitive** — `START` = `start` = `Start` = `sTaRt`
3. **Natural Phrases** — `ask for age` instead of `INPUT age`
4. **Beginner-Friendly** — Write like explaining to a friend
5. **Forgiving Parser** — Understand intent, not just exact syntax
6. **Data Structure Rich** — Stack, Queue, Map, Set, Vector, LinkedList, Tree, Graph, Pair, PriorityQueue, Deque, Struct
