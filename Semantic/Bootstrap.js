class Numbers {
	constructor(value) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	toJs() {
		return `(e) => {return ${this._value};}`;
	}

	toString() {
		return `${this.value}`;
	}
}

class Booleans {
	constructor(value) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	toJs() {
		return `(e) => {return ${this._value};}`;
	}

	toString() {
		return `${this._value}`;
	}
}

class Variable {
	constructor(name) {
		this._name = name;
	}

	toJs() {
		return `(e) => {return e[\"${this._name}\"];}`;
	}

	toString() {
		return `${this._name}`;
	}
}

class Assign {
	constructor(name, expression) {
		this._name = name;
		this._expression = expression;
	}

	toJs() {
		return `((e) =>
		{
			e[\"${this._name}\"] = (${this._expression.toJs()})(e);
			return e;
		})`;
	}

	toString() {
		return `${this._name} = ${this._expression}`;
	}

}

class Add {
	constructor(left, right) {
		this._left = left;
		this._right = right;
	}

	get left() {
		return this._left;
	}

	get right() {
		return this._right;
	}

	toJs() {
		return `((e) => {return (${this._left.toJs()})(e) + (${this._right.toJs()})(e);})`;
	}

	toString() {
		return `${this.left} + ${this.right}`;
	}
}

class Multiply {
	constructor(left, right) {
		this._left = left;
		this._right = right;
	}

	get left() {
		return this._left;
	}

	get right() {
		return this._right;
	}

	toJs() {
		return `((e) => {return (${this._left.toJs()})(e) * (${this._right.toJs()})(e);})`;
	}

	toString() {
		return `${this._left} * ${this._right}`;
	}

}

class LessThan {
	constructor(left, right) {
		this._left = left;
		this._right = right;
	}

	toJs() {
		return `((e) => {return (${this._left.toJs()})(e) < (${this._right.toJs()})(e);})`;
	}

	toString() {
		return `${this._left} < ${this._right}`;
	}
}

class If {
	constructor(condition, 	consequence, alternative) {
		this._condition = condition;
		this._consequence = consequence;
		this._alternative = alternative;
	}

	toJs() {
		return `((e) => { if ((${this._condition.toJs()})(e)){
			return ${consequence.toJs()}(e)
		 } else {
		 	return ${alternative.toJs()}(e)
		 }
		})`
	}

	toString() {
		return `if (${this._condition}) { ${this._consequence} } else { ${this._alternative} }`
	}
}

class Sequence {
	constructor(first, 	second) {
		this._first = first;
		this._second = second;
	}

	toJs() {
		return `((e) => {
			return (${this._second.toJs()})((${this._first.toJs()})(e))
		})`
	}

	toString() {
		return `${this._first};${this._second}`;
	}
}

class While {
	constructor(condition, body) {
		this._condition = condition;
		this._body = body;
	}

	toJs() {
		return `((e) => {
			while ((${this._condition.toJs()})(e)) {
				e = (${this._body.toJs()})(e);
			}
			return e
		}) `
	}

	toString() {
		return `while (${this._condition}) { ${this._body} }`;
	}
}

class DoNothing {

	toJs() {
		return `((e) => {return e})`;
	}

	toString() {
		return "do-nothing";
	}
}