import { Environment } from "Environment";
import { Expr } from "Expr";
import { Lox } from "Lox";
import type { Stmt } from "stmt";
import { TokenType } from "tokenType";
import type { Token } from "tokens";
import { RuntimeError } from "types";

export class Interpreter implements Expr.Visitor<any>, Stmt.Visitor<void> {
  private environment: Environment = new Environment();

  interpret(statements: Stmt[]) {
    try {
      for (let statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        Lox.runtimeError(error);
      } else {
        Lox.runtimeError(new RuntimeError(null, error as string));
      }
    }
  }

  execute(stmt: Stmt) {
    stmt.accept(this);
  }

  stringify(object: Object): string {
    if (object === null) return "nil";
    if (typeof object === "number") {
      let text = object.toString();
      if (text.endsWith(".0")) {
        text = text.substring(0, text.length - 2);
      }
      return text;
    }
    return object.toString();
  }

  visitBinaryExpr(expr: Expr.Binary): any {
    let left: Object  = this.evaluate(expr.left);
    let right: Object = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) <= Number(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return Number(left) + Number(right);
        }
        if (typeof left === "string" && typeof right === "string") {
          return String(left) + String(right);
        }
        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings."
        );
        break;
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) / Number(right);
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) * Number(right);
    }

    return null;
  }

  private checkNumberOperands(operator: Token, left: Object, right: Object) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  checkNumberOperand(operator: Token, operand: Object) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  isEqual(a: any, b: any): boolean {
    if (a === null && b == null) return true;
    if (a == null) return false;
    return a === b;
  }

  visitGroupingExpr(expr: Expr.Grouping): any {
    return this.evaluate(expr.expression);
  }

  evaluate(expr: Expr): any {
    return expr.accept(this);
  }

  visitLiteralExpr(expr: Expr.Literal): Object {
    if (expr.value === null) return "nil";
    return expr.value;
  }

  visitUnaryExpr(expr: Expr.Unary): any {
    let right: any = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        return -right;
      default:
        return null;
    }
  }

  visitExpressionStmt(stmt: Stmt.Expression) {
    this.evaluate(stmt.expression);
    return null;
  }

  visitPrintStmt(stmt: Stmt.Print) {
    let value: any = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
    return null;
  }

  visitVarStmt(stmt: Stmt.Var) {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
  }

  visitVariableExpr(expr: Expr.Variable): Object {
    return this.environment.get(expr.name);
  }

  visitAssignExpr(expr: Expr.Assign): any {
    let value: Object = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }

  visitBlockStmt(stmt: Stmt.Block) {
    this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  visitIfStmt(stmt: Stmt.If) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch != null) {
      this.execute(stmt.elseBranch);
    }
    return null;
  }

  visitLogicalExpr(expr: Expr.Logical): any {
    let left: Object  = this.evaluate(expr.left);
    if (expr.operator.type == TokenType.OR) {
      if (this.isTruthy(left)) return left;
    } else {
      if (!this.isTruthy(left)) return left;
    }
    return this.evaluate(expr.right);
  }

  visitWhileStmt(stmt: Stmt.While) {
   // console.log('while called ', stmt);
    console.log(this.evaluate(stmt.condition))
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      // console.log('hello ', stmt.condition)
     // this.execute(stmt.body);
    }
    return null;
  }

  executeBlock(statements: Stmt[], environment: Environment) {
    let previous: Environment = this.environment;
    try {
      this.environment = environment;
      for (let statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  isTruthy(object: any): boolean {
    if (object == null) return false;
   // console.log('isTruthy ', object)
    return object;
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    let result = `(${name}`;
    for (const expr of exprs) {
      result += ` ${expr.accept(this)}`;
    }
    result += ")";
    return result;
  }
}
