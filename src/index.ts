import { AstPrinter } from "AstPrinter";
import type { Expr } from "Expr";
import { Lox } from "Lox";
import { Scanner } from "Scanner";
import figlet from "figlet";
import { Parser } from "parser";
import { TokenType } from "tokenType";
import type { Token } from "tokens";
import type { RuntimeError } from "types";

// export let hadError:boolean = false;
// export let  hadRuntimeError:boolean = false;

const tlox_header = figlet.textSync("TLOX 0.1.0");

console.log(tlox_header)

console.log("    An elegant language v0.1.0 \n\n\n  ")

let args = Bun.argv
let args_length = args?.length - 2
if (args_length > 1) {
    console.log("Usage: tlox [script] ");
    process.exit(64)
} else if (args_length == 1) {
  //  console.log(Bun.argv[2]);
    await runFile(Bun.argv[2])
} else {
    try {
       await runPrompt()
    } catch (e) {
       console.log(e)
    }
}

async function runFile(path:string) {
    try {
        const file = Bun.file(path);
        const content = await file.text();
        console.log(content)
       // Assuming you have a run function defined elsewhere
        //run(content);

      // Indicate an error in the exit code.
      if (Lox.hadError) process.exit(65);
      if (Lox.hadRuntimeError) process.exit(70);
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function runPrompt () {
    const prompt = ">> ";
    process.stdout.write(prompt);
    for await (const line of console) {
    //  console.log(`You typed: ${line}`);
     // process.stdout.write(prompt);
      run(line);
      process.stdout.write(prompt);
      Lox.hadError = false;
    }
}

async function run(source:string) {
     let scanner : Scanner = new Scanner(source);
     let tokens = scanner.scanTokens();

            // for (let token of tokens) {
            //     console.log(token.lexeme);
            // }
    
    let parser:Parser = new Parser(tokens);
    let expression:Expr | null = parser.parse();
    // List<Stmt> statements = parser.parse();

    // // stop if there was a syntax error.
    if (Lox.hadError) return;

    if (expression !== null ) console.log(new AstPrinter().print(expression))
    
    // Resolver resolver = new Resolver(interpreter);
    // resolver.resolve(statements);

    // if (hadError) return;

    // interpreter.interpret(statements);

}








