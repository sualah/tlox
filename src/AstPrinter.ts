import type { Expr } from "Expr";
import type { Visitor } from "typescript";



// class AstPrinter implements Visitor<string>{
//          print(expr: Expr):string {
//             return expr.accept(this);
//         }
//     }


function  print(expr: Expr):string {
    return expr.accept();
}