![calc= logo.](Logos/calc_Logo_GitHub.png)

**TODOLIST:**
 * [ ] Make those dang help pages.
 * [ ] Continue the standard library.

## Examples

```
calc= [1, 1] {i -> i (i last (i 1 lastn) +) +} 7 iter last
calc=34
```

```
calc= 1 5 .. $* 1 fold
calc=120
```

```
calc= ["Hey", "'Sup", "Yo"] {+ "!\n" +} "\n" fold
calc=
Hey!
'Sup!
Yo!
```