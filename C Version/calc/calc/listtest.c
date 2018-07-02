#include <stdio.h>

#include "list.h"

List(ints, int, i_)

int main(int argc, char** argv) {
	ints numbers;
	i_init(&numbers);
	
	for(int cou = 0; cou < 40; cou++) {
		i_push(&numbers, cou);
	}
	
	printf("%d, %d\n", numbers.length, numbers.capacity);
	
	size_t limit = numbers.length;
	for(int cou = 0; cou < limit; cou++) {
		printf("%d\n", i_pop(&numbers));
	}
	
	return 0;
}
