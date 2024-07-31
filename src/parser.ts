import { Expr } from "Expr";
import { TokenType } from "tokenType";
import type { Token } from "tokens";


class Parser {
 private tokens: Token[];
 private current: number = 0;

 constructor(tokens:Token[]){
    this.tokens = tokens
 }

 expression(): Expr {
    return this.equality()
 }

 equality() : Expr {
    let expr:Expr = this.comparison();
    while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
        let operator = this.previous();
        let right = this.comparison();
        expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
 }

 match( ...types: TokenType[]) : boolean {
    for (let type of types) {
          if(this.check(type)){
            this.advance();

            return true;
          }
    }
    return false;
 }

 check(type: TokenType) : boolean{
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
 }

 isAtEnd() {
        throw new Error("Method not implemented.");
    }
 peek() {
        throw new Error("Method not implemented.");
    }

 advance() {
    if(!this.isAtEnd()) this.current++;
    
    return this.previous();
 }

 comparison(): Expr {
    throw new Error("Function not implemented.");
}


 previous() : Token {
    throw new Error("Function not implemented.");
}
}


