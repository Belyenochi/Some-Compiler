class FARule {
	constructor(state, character, next_state) {
		this._state = state;
		this._character = character;
		this._next_state = next_state;
	}

	appliesTo(state, character) {
		return this._state == state && this._character == character
	}

	follow() {
		return this._next_state;
	}

	toString() {
		return `#<FARule ${this.state} -- ${this._character}>`;
	}
}

class DFARulebook {
	constructor(rules) {
		this._rules = rules;
	}

	next_state(state, character) {
		return this.rule_for(state, character).follow();
	}

	rule_for(state, character) {

		return this._rules.find((rule) => {
			return rule.appliesTo(state, character)
		})
	}
}

class DFA {
	constructor(current_state, accept_states, rulebook) {
		this._current_state = current_state;
		this._accept_states = accept_states;
		this._rulebook = rulebook;
	}

	accepting() {
		return this._accept_states.indexOf(this._current_state) != -1;
	}

	read_character(character) {
		return this._current_state = this._rulebook.next_state(this._current_state, character)
	}

	read_string(string) {
		string = Array.from(string)
		return string.forEach((item) => {
		  this.read_character(item)
		})
	}
}

class DFADesign {
	constructor(start_state, accept_states, rulebook) {
		this._start_state = start_state
		this._accept_states = accept_states
		this._rulebook = rulebook
	}

	to_dfa() {
		return new DFA(this._start_state, this._accept_states, this._rulebook)
	}

	accepts(string) {
		let dfa = this.to_dfa()
		dfa.read_string(string)


		return dfa.accepting()
	}
}

var rulebook = new DFARulebook([
	new FARule(1, 'a', 2),	new FARule(1, 'b', 1),
	new FARule(2, 'a', 2),	new FARule(2, 'b', 3),
	new FARule(3, 'a', 3),	new FARule(3, 'b', 3),
])

rulebook.next_state(1, 'a')

dfa_design = new DFADesign(1, [3], rulebook)

dfa_design.accepts('a')



