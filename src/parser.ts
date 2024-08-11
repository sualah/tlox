import { Expr } from "Expr";
import { Lox } from "Lox";
import { Stmt } from "stmt";
import { TokenType } from "tokenType";
import type { Token } from "tokens";

class ParseError extends Error {}

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Stmt[] {
    let statements: Stmt[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  declaration(): Stmt {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (error) {
      this.synchronize();
      return Object(null);
    }
  }

  varDeclaration(): Stmt {
    let name: Token = this.consume(
      TokenType.IDENTIFIER,
      "Expect variable name."
    );
    let initializer: Expr = Object(null);
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new Stmt.Var(name, initializer);
  }

  statement(): Stmt {
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.LEFT_BRACE)) return new Stmt.Block(this.block());
    return this.expressionStatement();
  }

  block(): Stmt[] {
    let statements: Stmt[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  expressionStatement(): Stmt {
    let expr: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new Stmt.Expression(expr);
  }

  printStatement(): Stmt {
    let value: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new Stmt.Print(value);
  }

  expression(): Expr {
    return this.assignment();
  }

  assignment(): Expr {
    let expr: Expr = this.equality();
    if (this.match(TokenType.EQUAL)) {
      let equals: Token = this.previous();
      let value: Expr = this.assignment();
      if (expr instanceof Expr.Variable) {
        let name: Token = expr.name;
        return new Expr.Assign(name, value);
      }
      this.error(equals, "Invalid assignment target.");
    }
    return expr;
  }

  equality(): Expr {
    let expr: Expr = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous();
      let right = this.comparison();
      expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  match(...types: TokenType[]): boolean {
    for (let type of types) {
      if (this.check(type)) {
        this.advance();

        return true;
      }
    }
    return false;
  }

  check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  isAtEnd() {
    return this.peek().type == TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  advance() {
    if (!this.isAtEnd()) this.current++;

    return this.previous();
  }

  comparison(): Expr {
    let expr: Expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      let operator: Token = this.previous();
      let right: Expr = this.term();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  term(): Expr {
    let expr: Expr = this.factor();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator: Token = this.previous();
      let right: Expr = this.factor();
      expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
  }
  factor(): Expr {
    let expr: Expr = this.unary();
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator: Token = this.previous();
      let right: Expr = this.unary();
      expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator: Token = this.previous();
      let right: Expr = this.unary();
      return new Expr.Unary(operator, right);
    }
    return this.primary();
  }

  primary(): Expr {
    if (this.match(TokenType.FALSE)) return new Expr.Literal(false);
    if (this.match(TokenType.TRUE)) return new Expr.Literal(true);
    if (this.match(TokenType.NIL)) return new Expr.Literal(Object(null));

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Expr.Literal(this.previous().literal!);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new Expr.Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      let expr: Expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Expr.Grouping(expr);
    }
    throw this.error(this.peek(), "Expect expression.");
  }

  consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  error(token: Token, message: string): ParseError {
    Lox.errorToken(token, message);
    return new ParseError();
  }

  previous(): Token {
    return this.tokens[this.current - 1];
  }

  private synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.SEMICOLON) return;
      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
    }
    this.advance();
  }
}
