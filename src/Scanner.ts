import { TokenType } from "tokenType";
import { Token } from "tokens";
export class Scanner {

    source: string;
    private readonly tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;
    private static keywords: Map<string, TokenType> = new Map();
    
   static {
    Scanner.keywords.set("and", TokenType.AND);
    Scanner.keywords.set("and", TokenType.AND);
    Scanner.keywords.set("=", TokenType.CLASS);
    Scanner.keywords.set("else", TokenType.ELSE);
    Scanner.keywords.set("false", TokenType.FALSE);
    Scanner.keywords.set("for", TokenType.FOR);
    Scanner.keywords.set("fun", TokenType.FUN);
    Scanner.keywords.set("if", TokenType.IF);
    Scanner.keywords.set("nil", TokenType.NIL);
    Scanner.keywords.set("or", TokenType.OR);
    Scanner.keywords.set("print", TokenType.PRINT);
    Scanner.keywords.set("return", TokenType.RETURN);
    Scanner.keywords.set("super", TokenType.SUPER);
    Scanner.keywords.set("this", TokenType.THIS);
    Scanner.keywords.set("true", TokenType.TRUE);
    Scanner.keywords.set("var", TokenType.VAR);
    Scanner.keywords.set("while", TokenType.WHILE);
   }

    constructor(source: string) {
        this.source = source;      
    }

    scanTokens():Token[] {

      while (!this.isAtEnd()) {
        // We are at the beginning of the next lexeme.
        this.start = this.current;
        this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", this.line));
    return this.tokens;
    }

    private  scanToken() {
     let c : string = this.advance();
      switch (c) {
          case '(': this.addToken(TokenType.LEFT_PAREN); break;
          case ')': this.addToken(TokenType.RIGHT_PAREN); break;
          case '{': this.addToken(TokenType.LEFT_BRACE); break;
          case '}': this.addToken(TokenType.RIGHT_BRACE); break;
          case ',': this.addToken(TokenType.COMMA); break;
          case '.': this.addToken(TokenType.DOT); break;
          case '-': this.addToken(TokenType.MINUS); break;
          case '+': this.addToken(TokenType.PLUS); break;
          case ';': this.addToken(TokenType.SEMICOLON); break;
          case '*': this.addToken(TokenType.STAR); break;
          case '!':
              this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
              break;
          case '=':
              this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
              break;
          case '<':
              this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
              break;
          case '>':
              this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
              break;
          case '/':
              if (this.match('/')) {
                  // A comment goes until the end of the line.
                  while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
              } else {
                  this.addToken(TokenType.SLASH);
              }
              break;
          case ' ':
          case '\r':
          case '\t':
              // Ignore whitespace.
              break;
          case '\n':
              this.line++;
              break;
          case '"': this.string(); break;
          case 'o':
              if (this.match('r')) {
                  this.addToken(TokenType.OR);
              }
              break;
          default:
              if (this.isDigit(c)) {
                  this.number();
              } else if (this.isAlpha(c)) {
                  this.identifier();
              } else {
                 // Lox.error(line, "Unexpected character.");
              }
              break;
      }
  }

    private  identifier() {
      while (this.isAlphaNumeric(this.peek())) this.advance();
      let text = this.source.substring(this.start, this.current);
      let type =  Scanner.keywords.get(text);
      if (type == null) type = TokenType.IDENTIFIER;
      this.addToken(type);
      //addToken(IDENTIFIER);
  }

  private  isDigit( c : string) : boolean {
      return c >= '0' && c <= '9';
  }

  private  number() {
      while (this.isDigit(this.peek())) this.advance();

      // Look for a fractional part.
      if (this.peek() == '.' && this.isDigit(this.peekNext())) {
          // Consume the "."
          this.advance();

          while (this.isDigit(this.peek())) this.advance();
      }

      this.addToken(TokenType.NUMBER,
              Number.parseFloat(this.source.substring(this.start, this.current)));
  }

  private  peekNext() : string {
      if (this.current + 1 >= this.source.length) return '\0';
      return this.source.charAt(this.current + 1);
  }
  private  isAlpha(c : string) : boolean{
      return (c >= 'a' && c <= 'z') ||
              (c >= 'A' && c <= 'Z') ||
              c == '_';
  }

  private  isAlphaNumeric(c : string) : boolean {
      return this.isAlpha(c) || this.isDigit(c);
  }

  private  string() {
      while (this.peek() != '"' && !this.isAtEnd()) {
          if (this.peek() == '\n') this.line++;
          this.advance();
      }

      if (this.isAtEnd()) {
       //   Lox.error(line, "Unterminated string.");
          return;
      }

      // The closing ".
      this.advance();

      // Trim the surrounding quotes.
      let value = this.source.substring(this.start + 1, this.current - 1);
      this.addToken(TokenType.STRING, value);
  }

  private  match( expected:string) : boolean {
      if (this.isAtEnd()) return false;
      if (this.source.charAt(this.current) != expected) return false;

      this.current++;
      return true;
  }

  private  peek() : string {
      if (this.isAtEnd()) return '\0';
      return this.source.charAt(this.current);
  }

  private  isAtEnd():boolean {
      return this.current >= this.source.length;
  }

  private  advance():string {
      return this.source.charAt(this.current++);
  }

  private  addToken(type : TokenType, literal?:Object) {
      let text = this.source.substring(this.start, this.current);
      this.tokens.push(new Token(type, text, this.line, literal))
  }
}