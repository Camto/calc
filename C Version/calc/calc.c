/*
#include <stdio.h>
#include <stdlib.h>

int input(char *s,int length);

int main()
{
    char *buffer;
    size_t bufsize = 32;
    size_t characters;

    buffer = (char *)malloc(bufsize * sizeof(char));
    if( buffer == NULL)
    {
        perror("Unable to allocate buffer");
        exit(1);
    }

    printf("Type something: ");
    characters = getline(&buffer,&bufsize,stdin);
    printf("%zu characters were read.\n",characters);
    printf("You typed: '%s'\n",buffer);

    return(0);
}
*/

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
	char* input;
	size_t input_length;
	
	input = (char*) malloc(input_length * sizeof(char));
	if(input == NULL) {
		printf("Couldn't allocate memory for the input string.");
		return 1;
	}
	
	printf("calc= ");
	getline(&input, &input_length, stdin);
	printf("calc= Result goes here.");
	printf(input);
	return 0;
}
