import { Token } from "tokens";

export interface Visitor<R> {
  visitBinaryExpr(expr: Binary): R;
  visitGroupingExpr(expr: Grouping): R;
  visitLiteralExpr(expr: Literal): R;
  visitUnaryExpr(expr: Unary): R;
}


export abstract class Expr {
  abstract accept<R>(visitor: Visitor<R>) : R;
}


class Binary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
  super(); 
  this.left = left;
  this.operator = operator;
  this.right = right;
 }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }

}


class Grouping extends Expr {
  expression: Expr;
  constructor(expression: Expr) {
  super(); 
  this.expression = expression;
 }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }

}


class Literal extends Expr {
  value: Object;
  constructor(value: Object) {
  super(); 
  this.value = value;
 }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }

}


class Unary extends Expr {
  operator: Token;
  right: Expr;
  constructor(operator: Token, right: Expr) {
  super(); 
  this.operator = operator;
  this.right = right;
 }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }

}


