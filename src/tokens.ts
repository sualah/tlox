import type { TokenType } from "tokenType";

export class Token {
    type: TokenType;
    lexeme: string;
    literal?: object;
    line: number;

    constructor(type: TokenType,lexeme: string, line: number,  literal?: object) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        this.line = line
    }

     toString():string {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}
