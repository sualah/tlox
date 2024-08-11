import type { Token } from "tokens";
import { RuntimeError } from "types";

export class Environment {
  private readonly values: Map<string, any> = new Map<string, any>();
  readonly enclosing: Environment | null;

  constructor(enclosing?: Environment) {
    this.enclosing = enclosing || null;
  }

  get(name: Token): Object {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }
    if (this.enclosing != null) return this.enclosing.get(name);
    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  define(name: string, value: Object) {
    this.values.set(name, value);
  }

  assign(name: Token, value: Object) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }
    if (this.enclosing != null) {
        this.enclosing.assign(name, value);
        return;
      }
    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }
}
