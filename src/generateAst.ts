import type { FileSink } from "bun";




async function defineAst(outputDir:string, baseName:string, types:string[]) {
    const path = `${outputDir}/${baseName}.ts`;
    const file = Bun.file(path);
    const writer = file.writer();
  
    writer.write(`import { Token } from "tokens";\n\n`);
   // writer.write(`import { TokenType } from "tokens";\n\n`);

    writer.write(`export abstract class ${baseName} {\n`);   
    writer.write(`  abstract accept<R>(visitor: ${baseName}.Visitor<R>) : R;\n`);
    writer.write(`}\n\n\n`);
    writer.write(`export namespace ${baseName} {\n\n`);   
    await defineVisitor(writer, baseName, types)

    for (const type of types) {
        let className = type.split("=")[0].trim();
        let fields = type.split("=")[1].trim();
        await defineType(writer, baseName, className, fields);
    }
    writer.write(`}\n`);   

    writer.end();
  }


async function defineVisitor(writer: FileSink, baseName: string, types: string[]): Promise<void> {
    let content = ` export interface Visitor<R> {\n`;
  
    for (const type of types) {
      const typeName = type.split('=')[0].trim();
      content += `      visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}): R;\n`;
    }
  
    content += `}\n\n\n`;
  
    writer.write(content);

  }

  async function defineType(writer: FileSink, baseName: string, className: string, fieldList: string) {
    let content = `export class ${className} extends ${baseName} {\n`;
  
    const fields = fieldList.split(', ');

      // Fields
      for (const field of fields) {
        content += `  ${field};\n`;
      }
    // Constructor
    content += `  constructor(${fieldList}) {\n`;
  
    content += `  super(); \n`;

    // Store parameters in fields
    for (const field of fields) {
      const name = field.split(':')[0];
      content += `  this.${name} = ${name};\n`;
    }
  
    content += ' }\n\n';
  
    // Visitor pattern
    content += '  accept<R>(visitor: Visitor<R>): R {\n';
    content += `    return visitor.visit${className}${baseName}(this);\n`;
    content += '  }\n\n';
  
  
  
    content += '}\n\n\n';
  
     writer.write(content);
  }

  defineAst("./src", "Expr", ["Binary   = left: Expr, operator: Token, right: Expr",
        "Grouping = expression: Expr",
        "Literal  = value: Object",
        "Unary    = operator: Token, right: Expr"])


