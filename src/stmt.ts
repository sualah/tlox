import type { Expr } from "Expr";
import { Token } from "tokens";

export abstract class Stmt {
  abstract accept<R>(visitor: Stmt.Visitor<R>) : R;
}


export namespace Stmt {

 export interface Visitor<R> {
      visitExpressionStmt(stmt: Expression): R;
      visitPrintStmt(stmt: Print): R;
}


export class Expression extends Stmt {
  expression: Expr;
  constructor(expression: Expr) {
  super(); 
  this.expression = expression;
 }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }

}


export class Print extends Stmt {
  expression: Expr;
  constructor(expression: Expr) {
  super(); 
  this.expression = expression;
 }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitPrintStmt(this);
  }

}


}
