import { Token } from "tokens";
import type { Expr } from "Expr";

export abstract class Stmt {
  abstract accept<R>(visitor: Stmt.Visitor<R>): R;
}

export namespace Stmt {
  export interface Visitor<R> {
    visitBlockStmt(stmt: Block): R;
    visitExpressionStmt(stmt: Expression): R;
    visitPrintStmt(stmt: Print): R;
    visitVarStmt(stmt: Var): R;
  }

  export class Block extends Stmt {
    statements: Stmt[];
    constructor(statements: Stmt[]) {
      super();
      this.statements = statements;
    }

    accept<R>(visitor: Visitor<R>): R {
      return visitor.visitBlockStmt(this);
    }
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

  export class Var extends Stmt {
    name: Token;
    initializer: Expr;
    constructor(name: Token, initializer: Expr) {
      super();
      this.name = name;
      this.initializer = initializer;
    }

    accept<R>(visitor: Visitor<R>): R {
      return visitor.visitVarStmt(this);
    }
  }
}
