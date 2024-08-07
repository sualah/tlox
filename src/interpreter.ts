import { Expr } from "Expr";
import { TokenType } from "tokenType";

export class Interpreter implements Expr.Visitor<Object> {

    visitBinaryExpr(expr: Expr.Binary): Object {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
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
        case TokenType.MINUS:
          return -right;
        default:
            return Object(null)
      }
      //  return this.parenthesize(expr.operator.lexeme, expr.right);
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