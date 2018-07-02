typedef struct Calc_Token {
	enum {symbol, number, string, operator} type;
	char* data;
}

List(Calc_Tokens, Calc_Token, ct_)
