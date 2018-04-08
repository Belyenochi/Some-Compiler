class Numbers {
	constructor(value) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	evaluate(environment) {
		return this;
	}

	toString() {
		return `${this.value}`;
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

	evaluate(environment) {
		return new Numbers(this._left.evaluate(environment)._value + this._right.evaluate(environment).value)
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

	evaluate(environment) {
		return new Numbers(this._left.evaluate(environment)._value * this._right.evaluate(environment).value)
	}

	toString() {
		return `${this._left} * ${this._right}`;
	}

}

class Booleans {
	constructor(value) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	evaluate(environment) {
		return this;
	}

	toString() {
		return `${this._value}`;
	}
}

class LessThan {
	constructor(left, right) {
		this._left = left;
		this._right = right;
	}

	evaluate(environment) {
		return new Numbers(this._left.evaluate(environment)._value < this._right.evaluate(environment)._value)
	}

	toString() {
		return `${this._left} < ${this._right}`;
	}
}

class Variable {
	constructor(name) {
		this._name = name;
	}

	evaluate(environment) {
		return environment[this._name];
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

	evaluate(environment) {
		environment[this._name] = this._expression.evaluate(environment);
		return environment;
	}

	toString() {
		return `${this._name} = ${this._expression}`;
	}

}

class If {
	constructor(condition, 	consequence, alternative) {
		this._condition = condition;
		this._consequence = consequence;
		this._alternative = alternative;
	}

	evaluate(environment) {
		switch(this._condition.evaluate(environment).toString()) {
			case new Booleans(true).toString():
				return this._consequence.evaluate(environment);
			case new Booleans(false).toString():
				return this.alternative.evaluate(environment);
			default:
					throw new Error("this._condition is not a boolean");
		}
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

	evaluate(environment) {
		return this._second.evaluate(this._first.evaluate(environment))
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

	evaluate(environment) {
		switch(this._condition.evaluate(environment).toString()) {
			case new Booleans(true).toString():
				return this.evaluate(this._body.evaluate(environment));
			case new Booleans(false).toString():
				return environment;
			default:
					throw new Error("this._condition is not a boolean");
		}
	}

	toString() {
		return `while (${this._condition}) { ${this._body} }`;
	}
}

class DoNothing {

	reducible() {
		return false;
	}

	evaluate(environment) {
		return environment;
	}

	toString() {
		return "do-nothing";
	}
}

class Machine {
	constructor(statement, environment) {
		this._statement = statement;
		this._environment = environment;
	}

	step() {
		[this._statement,this.environment] = this._statement.reduce(this._environment)
	}

	run() {
		while (this._statement.reducible()) {
			console.log(this._statement.toString(), JSON.stringify(this._environment).toString());
			this.step();
		}

		console.log(this._statement.toString(), JSON.stringify(this._environment).toString());
	}
}