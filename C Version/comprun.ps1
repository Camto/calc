clang main.c lex.c "len str.c" -std=c89 -pedantic-errors -o calc.exe
./calc $args[0]