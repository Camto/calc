# calc

```
calc= [1, 1] {i -> i (i last (i 1 lastn) +) +} 7 iter last
calc=34

calc= 1 5 .. $* 1 fold
calc=120

calc= ["Hey", "'Sup", "Yo"] {i -> i "!" +} map {acc i -> acc i + " " +} "" fold
```
## Built-in Functions

* `[data] reduce/fold/foldl/fold_left {reducer}`:  
​

## Yay Grammar

```
Program = "code=" Expr*
Expr = (
	"(" Expr ")" |
	Symbol |
	Number |
	String |
	Array |
	Function |
	Operator)
Symbol = /[A-Za-z]+[A-Za-z0-9]*/
Number = /-?\d+(\.\d+)?/
String = /"(\\"|[^"])*"/
Array = "[" Expr ("," Expr)* "]"
Function = "{" Args "=" Expr "}"
Args = Symbol ("," Symbol)* ("|" Symbol ("," Symbol)*)?
Operator = ("+" | "-" | "*" | "/" | "^" | .." | "&" | "|" | "!")
```