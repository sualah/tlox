import { Interpreter } from "interpreter";
import { TokenType } from "tokenType";
import type { Token } from "tokens";
import  { RuntimeError } from "types";


export class Lox {
    static interpreter = new Interpreter();
    static hadError:boolean = false;
    static hadRuntimeError:boolean = false;

    static  error(line:number,  message:string) {
        Lox.report(line, "", message);
    }

    
    static  errorToken (token:Token, message:string) {
        if (token.type == TokenType.EOF) {
            Lox.report(token.line, " at end", message);
        } else {
            Lox.report(token.line, " at '" + token.lexeme + "'", message);
        }
    }

    static runtimeError(error: RuntimeError) {
        if (error.token) {
            console.log(error.message + "\n[line " + error.token.line + "]");
        } else {
            console.log(error.message + "\n");
        }
        
        Lox.hadRuntimeError = true;
    }

    static report(line:number, where:string,
        message:string) {
        console.log("[line " + line + "] Error" + where + ": " + message);
        Lox.hadError = true;
    }
    
}