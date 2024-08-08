import { Expr } from "Expr";
import { TokenType } from "tokenType";

export class Interpreter implements Expr.Visitor<Object> {

    visitBinaryExpr(expr: Expr.Binary): Object {
      let left: Object = this.evaluate(expr.left);
      let right: Object = this.evaluate(expr.right);
      switch (expr.operator.type) {
        case TokenType.GREATER:
            return Number(left) > Number(right);
        case TokenType.GREATER_EQUAL:
            return Number(left) >= Number(right);
        case TokenType.LESS:
            return Number(left) < Number(right);
        case TokenType.LESS_EQUAL:
            return Number(left) <= Number(right);
        case TokenType.BANG_EQUAL: return !this.isEqual(left, right);
        case TokenType.EQUAL_EQUAL: return this.isEqual(left, right);
        case TokenType.MINUS:
          return Number(left) - Number(right);
        case TokenType.PLUS:
            if ( typeof left === 'number' &&  typeof right === 'number') {
              return Number(left) + Number(right);
            }
            if (typeof left === 'string' &&  typeof right === 'string') {
              return String(left) + String(right);
  }
            break;
        case TokenType.SLASH:
          return Number(left) / Number(right);
        case TokenType.STAR:
          return Number(left) * Number(right);
      }

        return Object(null);
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
            return Object(null)
      }
      //  return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    isTruthy(object: Object) : boolean {
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