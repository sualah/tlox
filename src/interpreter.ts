import { Environment } from "Environment";
import { Expr } from "Expr";
import { Lox } from "Lox";
import type { Stmt } from "stmt";
import { TokenType } from "tokenType";
import type { Token } from "tokens";
import { RuntimeError } from "types";

export class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<void> {
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

  visitBinaryExpr(expr: Expr.Binary): Object {
    let left: Object = this.evaluate(expr.left);
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

    return Object(null);
  }

  private checkNumberOperands(operator: Token, left: Object, right: Object) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  checkNumberOperand(operator: Token, operand: Object) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  isEqual(a: Object, b: Object): boolean {
    if (a === null && b == null) return true;
    if (a == null) return false;
    return a === b;
  }

  visitGroupingExpr(expr: Expr.Grouping): Object {
    return this.evaluate(expr.expression);
  }

  evaluate(expr: Expr): Object {
    return expr.accept(this);
  }

  visitLiteralExpr(expr: Expr.Literal): Object {
    if (expr.value === null) return "nil";
    return expr.value;
  }

  visitUnaryExpr(expr: Expr.Unary): Object {
    let right: Object = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        return -right;
      default:
        return Object(null);
    }
    //  return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  visitExpressionStmt(stmt: Stmt.Expression) {
    this.evaluate(stmt.expression);
    return null;
  }

  visitPrintStmt(stmt: Stmt.Print) {
    let value: Object = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
    return null;
  }

  visitVarStmt(stmt: Stmt.Var) {
    let value: Object = Object(null);
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
  }

  visitVariableExpr(expr: Expr.Variable): Object {
    return this.environment.get(expr.name);
  }

  visitAssignExpr(expr: Expr.Assign): Object {
    let value: Object = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }

  visitBlockStmt(stmt: Stmt.Block) {
    this.executeBlock(stmt.statements, new Environment(this.environment));
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

  isTruthy(object: Object): boolean {
    if (object == null) return false;
    if (object instanceof Boolean) return Boolean(object);
    return true;
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
