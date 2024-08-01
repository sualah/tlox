import { Expr } from "Expr";
import { Token } from "tokens";
import { TokenType } from "tokenType";
import type { Visitor } from "typescript";


export class AstPrinter implements Expr.Visitor<string> {
    print(expr: Expr): string {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: Expr.Binary): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr: Expr.Grouping): string {
        return this.parenthesize("group", expr.expression);
    }

    visitLiteralExpr(expr: Expr.Literal): string {
        if (expr.value === null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr: Expr.Unary): string {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    // visitVariableExpr(expr: Expr.Variable): string {
    //     return expr.name.lexeme;
    // }

    private parenthesize(name: string, ...exprs: Expr[]): string {
        let result = `(${name}`;
        for (const expr of exprs) {
            result += ` ${expr.accept(this)}`;
        }
        result += ")";
        return result;
    }

    // visitAssignExpr(expr: Expr.Assign): string {
    //     return null;
    // }
}

// function testValues() {
//   let leftExpr = new  Expr.Unary(new Token(TokenType.MINUS, "-", 1), new Expr.Literal(123));
//   let ops = new Token(TokenType.STAR, "*", 1);
//   let rightExpr = new Expr.Grouping(new Expr.Literal(45.67));
//   let expression = new Expr.Binary(leftExpr, ops, rightExpr);

//   console.log(new AstPrinter().print(expression))

// }

// testValues();