Tests

## Timing Diagram

```wavedrom
{ signal: [
  { name: "clk",         wave: "p.....|..." },
  { name: "Data",        wave: "x.345x|=.x", data: ["head", "body", "tail", "data"] },
  { name: "Request",     wave: "0.1..0|1.0" },
  {},
  { name: "Acknowledge", wave: "1.....|01." }
]}
```

## Bit-Field diagram

```wavedrom
{reg: [
    {bits: 7,  name: 'opcode',    attr: 'OP-IMM'},
    {bits: 5,  name: 'rd',        attr: 'dest'},
    {bits: 3,  name: 'func3',     attr: ['ADDI', 'SLTI', 'SLTIU', 'ANDI', 'ORI', 'XORI'], type: 4},
    {bits: 5,  name: 'rs1',       attr: 'src'},
    {bits: 12, name: 'imm[11:0]', attr: 'I-immediate[11:0]', type: 3}
], config: {hspace: 900}}
```

## Logic Circuit

```wavedrom
{ assign:[
  ["z", ["~&",
    ["~^", ["~", "p0"], ["~", "q0"]],
    ["~^", ["~", "p1"], ["~", "q1"]],
    "...",
    ["~^", ["~", "p7"], ["~", "q7"]],
    ["~","~en"]
  ]]
]}
```
