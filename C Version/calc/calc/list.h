// bhttps://stackoverflow.com/questions/20735026/making-c-dynamic-array-generic
// https://github.com/eteran/c-vector

#include <stdlib.h>

#define List(container_name, contained_type, prefix) \
	typedef struct { \
		size_t length; \
		size_t capacity; \
		contained_type* list; \
	} container_name; \
	\
	void prefix##init(container_name* list) { \
		list->length = 0; \
		list->capacity = 32; \
		list->list = (contained_type*) malloc(32 * sizeof(contained_type)); \
	} \
	\
	void prefix##push(container_name* list, contained_type item) { \
		if(list->length >= list->capacity) { \
			list->capacity *= 2; \
			list->list = (contained_type*) realloc(list->list, list->capacity * sizeof(contained_type)); \
		} \
		list->list[list->length] = item; \
		list->length++; \
	} \
	\
	contained_type prefix##pop(container_name* list) { \
		list->length--; \
		return list->list[list->length]; \
	} \
	\
	void prefix##unshift(container_name* list, contained_type item) { \
		if(list->length >= list->capacity) { \
			list->capacity *= 2; \
			list->list = (contained_type*) realloc(list->list, list->capacity * sizeof(contained_type)); \
		} \
		\
		for(size_t cou = list->length; cou > 0; cou--) { \
			list->list[cou] = list->list[cou - 1]; \
		} \
		list->list[0] = item; \
		list->length++; \
	} \
	\
	contained_type prefix##shift(container_name* list) { \
		contained_type item = list->list[0]; \
		for(size_t cou = 1; cou < list->length; cou++) { \
			list->list[cou - 1] = list->list[cou]; \
		} \
		list->length--; \
		return item; \
	}
