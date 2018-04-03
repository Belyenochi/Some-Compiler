class Pattern {
  bracket(outer_precedence) {
    if (this.precedence() < outer_precedence) {
      return '(' + this.toString() + ')';
    } else {
      return this.toString()
    }
  }

  inspect() {
    return `/${this}/`;
  }
}

class Empty extends Pattern {
  constructor() {
    super()
  }

  toString() {
    return ''
  }

  precedence() {
    return 3
  }
}

class Literal extends Pattern{
  constructor(character) {
    super()
    this._character = character
  }

  precedence() {
    return 3
  }

  bracket(outer_precedence) {
    return super.bracket(outer_precedence)
  }

  toString() {
    return `${this._character}`
  }
}

class Concatenate extends Pattern{
  constructor(first, second) {
    super()
    this._first = first
    this._second = second
  }

  toString() {
    return [this._first, this._second].map((pattern) => {
      return pattern.bracket(this.precedence())}).join("")
  }

  precedence() {
    return 1
  }
}

class Choose extends Pattern{
  constructor(first, second) {
    super()
    this._first = first
    this._second = second
  }

  toString() {
    return [this._first, this._second].map((pattern) => {return pattern.bracket(this.precedence())}).join('|')
  }

  precedence() {
    return 0
  }
}

class Repeat extends Pattern{
  constructor(pattern) {
    super()
    this._pattern = pattern
  }

  toString() {
    return this._pattern.bracket(this.precedence()) + '*'
  }

  precedence() {
    return 2
  }
}

var pattern = new Repeat(
  new Choose(
    new Concatenate(
      new Literal('a'), new Literal('b')),
    new Literal('a')
  ))
console.log(pattern.inspect())