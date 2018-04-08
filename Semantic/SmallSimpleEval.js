class Numbers {
	constructor(value) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	reducible() {
		return false;
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

	reducible() {
		return true;
	}

	reduce(environment) {
		if (this._left.reducible()) {
			return new Add(this._left.reduce(environment), this._right)
		}else if (this._right.reducible()){
			return new Add(this._left, this._right.reduce(environment))
		}else {
			return new Numbers(this._left.value + this._right.value)
		}
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

	reducible() {
		return true;
	}

	reduce(environment) {
		if (this._left.reducible()) {
			return new Multiply(this._left.reduce(environment), this.right);
		}else if (this._right.reducible()) {
			return new Multiply (this._left, this._right.reduce(environment))
		}else {
			return new Numbers(this._left.value * this._right.value)
		}
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

	reducible() {
		return false;
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

	reducible() {
		return true;
	}

	toString() {
		return `${this._left} < ${this._right}`;
	}

	reduce(environment) {
		if (this._left.reducible()) {
			return new LessThan(this._left.reduce(environment), this._right);
		}else if (this._right.reducible()){
			return new LessThan(this._left, this._right.reduce(environment));
		}else {
			return new Booleans(this._left.value < this._right.value);
		}
	}
}

class Variable {
	constructor(name) {
		this._name = name;
	}

	reducible() {
		return true;
	}

	reduce(environment) {
		return environment[this._name]
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

	reducible() {
		return true;
	}

	toString() {
		return `${this._name} = ${this._expression}`;
	}

	reduce(environment) {
		if(this._expression.reducible()) {
			return [new Assign(this._name, this._expression.reduce(environment)), environment]
		} else {
			return [new DoNothing(), environment[this._name] = this._expression]
		}
	}
}

class If {
	constructor(condition, 	consequence, alternative) {
		this._condition = condition;
		this._consequence = consequence;
		this._alternative = alternative;
	}

	reducible() {
		return true;
	}

	reduce(environment) {
		if (this._condition.reducible()) {
			return [new If(this._condition.reduce(environment), this._consequence, this._alternative)
			,environment]
		} else {
			switch(this._condition._value) {
				case true:
					return [this._consequence, this._environment];
				case false:
					return [this._alternative, this._environment];
				default:
					throw new Error("this._condition is not a boolean");
			}
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

	reducible() {
		return true;
	}

	reduce(environment) {
		let reduced_first, reduced_environment;

		switch(this._first.toString()) {
			case new DoNothing().toString():
				return [this._second, this._environment]
			default :
				[reduced_first, reduced_environment] = this._first.reduce(environment)
				return [new Sequence(reduced_first, this._second), reduced_environment]
		}
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

	reducible() {
		return true;
	}

	reduce(environment) {
		return [new If(this._condition, new Sequence(this._body, this), new DoNothing()), environment]
	}

	toString() {
		return `while (${this._condition}) { ${this._body} }`;
	}
}

class DoNothing {

	reducible() {
		return false;
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
