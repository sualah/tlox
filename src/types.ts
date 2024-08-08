import type { Token } from "tokens";

export interface LoxCallable {
     arity():number;
     //call(Interpreter interpreter, List<Object> arguments) : object;
}

// export interface RuntimeError {
//      token: Token;
//      getMessage:() => {};
// }

export class RuntimeError extends Error{
     token: Token | null;

     constructor(token: Token | null, message: string) {
          super(message);
          this.token = token;
     }
}

export let hashmap = {

};
