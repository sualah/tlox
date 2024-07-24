import type { Token } from "tokens";

export interface LoxCallable {
     arity():number;
     //call(Interpreter interpreter, List<Object> arguments) : object;
}

export interface RuntimeError {
     token: Token;
     getMessage:() => {};
}


export let hashmap = {

};
