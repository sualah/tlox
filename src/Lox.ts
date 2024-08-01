import { TokenType } from "tokenType";
import type { Token } from "tokens";
import type { RuntimeError } from "types";


export class Lox {
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
        console.log(error.getMessage() + "\n[line " + error.token.line + "]");
        Lox.hadRuntimeError = true;
    }

    static report(line:number, where:string,
        message:string) {
        console.log("[line " + line + "] Error" + where + ": " + message);
        Lox.hadError = true;
    }
    
}