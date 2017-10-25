+++
date = "2017-07-20"
draft = true
title = "p6 - Making a computer from scratch"
+++

I've decided to start this book called "Nand to tetris" which involves building a computer from a low level Nand gate.

- Boolean Logic
- Boolean Arithmetic
- Sequential Logic
- Machine Language
- Computer Architecture
- Assembler
- VM I: Stack Arithmetic
- VM II: Program Control
- High-Level Language
- Compiler I: Syntax Analysis
- Compiler II: Code Generation
- Operating System

<br/>
#### AND gate

```cpp
/**
 * And gate:
 * out = 1 if (a == 1 and b == 1)
 *       0 otherwise
 */

CHIP And {
    IN a, b;
    OUT out;

    PARTS:
    // Put your code here:
    Nand(a=a, b=b, out=nandOut);
    Not(in=nandOut, out=out);
}
```

<br/>
#### NOT gate
Not gate
```
/**
 * Not gate:
 * out = not in
 */

CHIP Not {
    IN in;
    OUT out;

    PARTS:
    Nand(a=in, b=in, out=out);
}
```
