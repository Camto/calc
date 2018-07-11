#include <stdio.h>

#include "list.h"

List(ints, int, i_)

int main(int argc, char** argv) {
	ints numbers;
	i_init(&numbers);
	
	printf("Added: ");
	for(int cou = 0; cou < 40; cou++) {
		printf("%d, ", cou);
		i_unshift(&numbers, cou);
	}
	
	i_insert(&numbers, -1000, 20);
	printf("\nInserted: %d", numbers.list[20]);
	printf("\nDeleted: %d", i_delete(&numbers, 30));
	
	printf("\nLength: %d, Capacity: %d", numbers.length, numbers.capacity);
	
	printf("\nShifted: ");
	size_t limit = numbers.length;
	for(int cou = 0; cou < limit; cou++) {
		printf("%d, ", i_shift(&numbers));
	}
	
	printf("\nLength: %d, Capacity: %d", numbers.length, numbers.capacity);
	
	return 0;
}
