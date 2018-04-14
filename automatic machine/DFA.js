class FARule {
	constructor(state, character, next_state) {
		this._state = state
		this._character = character
		this._next_state = next_state
	}

	appliesTo(state, character) {
		return this._state == state && this._character == character
	}

	follow() {
		return this._next_state
	}

	toString() {
		return `#<FARule ${this.state} -- ${this._character}>`
	}
}

class DFARulebook {
	constructor(rules) {
		this._rules = rules
	}

	next_state(state, character) {
		let rule = this.rule_for(state, character)

		return rule ? rule.follow() : false
	}

	rule_for(state, character) {

		let findNextState = this._rules.find((rule) => {
			return rule.appliesTo(state, character)
		})

		return findNextState !==  undefined ? findNextState : false
	}
}

class DFA {
	constructor(current_state, accept_states, rulebook) {
		this._current_state = current_state
		this._accept_states = accept_states
		this._rulebook = rulebook
	}

	accepting() {
		return this._accept_states.indexOf(this.current_state) != -1
	}

	read_character(character, save_current_state) {
		let next_state = this._rulebook.next_state(this.current_state, character)

		this.current_state = (next_state === false ? save_current_state : next_state)
	}

	read_string(string) {
		let save_current_state,read_string = Array.from(string)
		save_current_state = this._current_state

		read_string.forEach((item) => {
		  this.read_character(item, save_current_state)
		})

		this._current_state === false ? save_current_state : this._current_state
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

//rulebook.next_state(1, 'a')

dfa_design = new DFADesign(1, [3], rulebook)

dfa_design.accepts('cc')



