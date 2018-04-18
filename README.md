# calc

![calc= Logo](/calc Logo.png)

**TODOLIST:** (before release)
* [X] Fix strings.
* [X] Fix logo.
* [ ] Make web version for my GitHub pages.

**TODOLIST:** (whenever)
* [ ] Make more good samples please.
* [ ] Make those dang help pages.

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
calc= ["Hey", "'Sup", "Yo"] {i -> i "!" +} map {acc i -> acc i + "\n" +} "\n" fold
calc=
Hey!
'Sup!
Yo!
```